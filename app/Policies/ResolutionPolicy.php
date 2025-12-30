<?php

namespace App\Policies;

use App\Models\Resolution;
use App\Models\User;

class ResolutionPolicy
{
    /**
     * Determine if user can view any resolutions.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
    
    /**
     * Determine if user can view a specific resolution.
     */
    public function view(User $user, Resolution $resolution): bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }
        
        switch ($resolution->level) {
            case 'state':
                return true; // All can view state resolutions
                
            case 'district':
                if ($user->role === 'district_admin' || $user->role === 'tehsil_admin') {
                    // Check if user belongs to this district
                    return $user->district_id === $resolution->entity_id;
                }
                if ($user->role === 'member') {
                    // Members can view if they belong to this district
                    $member = $user->member;
                    return $member && $member->district_id === $resolution->entity_id;
                }
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            case 'tehsil':
                if ($user->role === 'tehsil_admin') {
                    return $user->tehsil_id === $resolution->entity_id;
                }
                if ($user->role === 'district_admin') {
                    return \App\Models\Tehsil::where('id', $resolution->entity_id)
                        ->where('district_id', $user->district_id)
                        ->exists();
                }
                if ($user->role === 'member') {
                    $member = $user->member;
                    return $member && $member->tehsil_id === $resolution->entity_id;
                }
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            default:
                return false;
        }
    }
    
    /**
     * Determine if user can create resolutions.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, [
            'super_admin',
            'state_admin',
            'district_admin',
            'tehsil_admin'
        ]);
    }
    
    /**
     * Determine if user can update resolution.
     */
    public function update(User $user, Resolution $resolution): bool
    {
        // Only creator or higher admin can update
        if ($resolution->created_by === $user->id) {
            return true;
        }
        
        if (!$this->create($user)) {
            return false;
        }
        
        return $this->view($user, $resolution);
    }
    
    /**
     * Determine if user can delete resolution.
     */
    public function delete(User $user, Resolution $resolution): bool
    {
        // Can only delete if not yet executed
        return $this->update($user, $resolution) && $resolution->status !== 'executed';
    }
    
    /**
     * Determine if user can vote on resolution.
     */
    public function vote(User $user, Resolution $resolution): bool
    {
        // Members can vote if resolution is in voting status and they can view it
        if ($resolution->status !== 'voting') {
            return false;
        }
        
        return $this->view($user, $resolution);
    }
}

