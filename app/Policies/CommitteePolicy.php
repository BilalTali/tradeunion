<?php

namespace App\Policies;

use App\Models\Committee;
use App\Models\User;

class CommitteePolicy
{
    /**
     * Determine if user can view any committees.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
    
    /**
     * Determine if user can view a specific committee.
     */
    public function view(User $user, Committee $committee): bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }
        
        switch ($committee->level) {
            case 'state':
                return in_array($user->role, ['super_admin', 'state_admin', 'state_president']);
                
            case 'district':
                if (in_array($user->role, ['district_admin', 'district_president'])) {
                    return $user->district_id === $committee->entity_id;
                }
                return in_array($user->role, ['super_admin', 'state_admin', 'state_president']);
                
            case 'tehsil':
                if (in_array($user->role, ['tehsil_admin', 'tehsil_president'])) {
                    return $user->tehsil_id === $committee->entity_id;
                }
                if (in_array($user->role, ['district_admin', 'district_president'])) {
                    return \App\Models\Tehsil::where('id', $committee->entity_id)
                        ->where('district_id', $user->district_id)
                        ->exists();
                }
                return in_array($user->role, ['super_admin', 'state_admin', 'state_president']);
                
            default:
                return false;
        }
    }
    
    /**
     * Determine if user can create committees.
     */
    public function create(User $user): bool
    {
        if (in_array($user->role, [
            'super_admin', 
            'state_admin', 'state_president',
            'district_admin', 'district_president',
            'tehsil_admin', 'tehsil_president'
        ])) {
            return true;
        }

        // Check for portfolio holders (Presidents/General Secretaries)
        if ($user->member) {
            try {
                $service = app(\App\Services\PortfolioPermissionService::class);
                $position = $service->getActivePosition($user->member);
                
                if ($position && $position->portfolio) {
                    // Allow Presidents and General Secretaries to create committees
                    $portfolioName = strtolower($position->portfolio->name);
                    return str_contains($portfolioName, 'president') || str_contains($portfolioName, 'general secretary');
                }
            } catch (\Exception $e) {
                // Fall through to false
            }
        }

        return false;
    }
    
    /**
     * Determine if user can update committee.
     */
    public function update(User $user, Committee $committee): bool
    {
        if (!$this->create($user)) {
            return false;
        }
        
        return $this->view($user, $committee);
    }
    
    /**
     * Determine if user can delete committee.
     */
    public function delete(User $user, Committee $committee): bool
    {
        return $this->update($user, $committee);
    }
    
    /**
     * Determine if user can manage committee members.
     */
    public function manageMembers(User $user, Committee $committee): bool
    {
        return $this->update($user, $committee);
    }
}

