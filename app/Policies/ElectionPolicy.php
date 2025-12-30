<?php

namespace App\Policies;

use App\Models\Election;
use App\Models\User;

class ElectionPolicy
{
    /**
     * Determine if user can view any elections.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view elections list
        return true;
    }
    
    /**
     * Determine if user can view a specific election.
     */
    public function view(User $user, Election $election): bool
    {
        // Users can only view elections at their level or below
        return $this->userCanAccessLevel($user, $election->level, $election->entity_id);
    }
    
    public function create(User $user): bool
    {
        // Allow if user is an admin
        if (in_array($user->role, [
            'super_admin',
            'state_admin',
            'district_admin',
            'tehsil_admin'
        ])) {
            return true;
        }

        // FEATURE: Portfolio override
        // Logged in as a portfolio holder? Check permissions.
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            return $service->userCan($user, 'election.create', 'write');
        }

        return false;
    }
    
    /**
     * Determine if user can update election.
     */
    public function update(User $user, Election $election): bool
    {
        // Must be admin at same level or above
        if (!$this->create($user)) {
            return false;
        }
        
        // Check level match
        return $this->userCanManageLevel($user, $election->level, $election->entity_id);
    }
    
    /**
     * Determine if user can delete election.
     */
    public function delete(User $user, Election $election): bool
    {
        // Same as update, but only if not completed
        return $this->update($user, $election) && $election->status !== 'completed';
    }
    
    /**
     * Determine if user can manage election status (open/close voting, etc).
     */
    public function manageStatus(User $user, Election $election): bool
    {
        // Must be Election Commissioner for this election
        // Check portfolio first (NEW)
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            // Check if user has management permission for this level
            if ($service->userCanAtLevel($user, 'election.open_nominations', $election->level, 'execute')) {
                return true;
            }
        }

        // Fallback to legacy EC table check
        return $election->commissionMembers()
            ->where('user_id', $user->id)
            ->exists();
    }
    
    /**
     * Check if user can access a specific level/entity.
     */
    private function userCanAccessLevel(User $user, string $level, int $entityId): bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }

        // FEATURE: Portfolio override
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            // If user has any read permission at this level/entity
            $activePos = $service->getActivePosition($user->member);
            if ($activePos && $activePos->level === $level && $activePos->entity_id === $entityId) {
                return true;
            }
            
            // Allow members to view elections in their jurisdiction
            switch ($level) {
                case 'tehsil':
                    return $user->member->tehsil_id === $entityId;
                    
                case 'district':
                    // Check if member's tehsil belongs to this district
                    // Optimize: Use loaded relationship if available, or query
                    if ($user->member->tehsil) {
                        return $user->member->tehsil->district_id === $entityId;
                    }
                    return \App\Models\Tehsil::where('id', $user->member->tehsil_id)
                        ->where('district_id', $entityId)
                        ->exists();
                        
                case 'state':
                    // All valid members can view state elections
                    return true;
            }
        }
        
        switch ($level) {
            case 'state':
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            case 'district':
                if ($user->role === 'district_admin') {
                    return $user->district_id === $entityId;
                }
                return $user->role === 'super_admin' || $user->role === 'state_admin';
                
            case 'tehsil':
                if ($user->role === 'tehsil_admin') {
                    return $user->tehsil_id === $entityId;
                }
                if ($user->role === 'district_admin') {
                    // Check if zone belongs to user's district
                    return \App\Models\Tehsil::where('id', $entityId)
                        ->where('district_id', $user->district_id)
                        ->exists();
                }
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            default:
                return false;
        }
    }
    
    private function userCanManageLevel(User $user, string $level, int $entityId): bool
    {
        // Same logic as access, but stricter
        if ($user->role === 'super_admin') {
            return true;
        }

        // FEATURE: Portfolio override
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            $activePos = $service->getActivePosition($user->member);
            // Must have a portfolio at EXATCLY this level and entity
            if ($activePos && $activePos->level === $level && $activePos->entity_id === $entityId) {
                return true;
            }
        }
        
        switch ($user->role) {
            case 'state_admin':
                return $level === 'state';
                
            case 'district_admin':
                return $level === 'district' && $user->district_id === $entityId;
                
            case 'tehsil_admin':
                return $level === 'tehsil' && $user->tehsil_id === $entityId;
                
            default:
                return false;
        }
    }
}

