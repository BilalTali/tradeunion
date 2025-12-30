<?php

namespace App\Policies;

use App\Models\LeadershipPosition;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PortfolioHolderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeadershipPosition $leadershipPosition): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeadershipPosition $leadershipPosition): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeadershipPosition $leadershipPosition): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LeadershipPosition $leadershipPosition): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LeadershipPosition $leadershipPosition): bool
    {
        return false;
    }
    
    /**
     * Determine if user can manage portfolio holder profile (admins only)
     */
    public function managePortfolioHolder(User $user, LeadershipPosition $position): bool
    {
        $role = $user->role;
        
        // Super admin can manage all
        if ($role === 'super_admin') {
            return true;
        }
        
        // Level-specific admins and presidents can manage their level
        if ($position->level === 'state') {
            return in_array($role, ['state_admin', 'state_president']);
        }
        
        if ($position->level === 'district') {
            return in_array($role, ['district_admin', 'district_president']) && $user->district_id === $position->entity_id;
        }
        
        if ($position->level === 'tehsil') {
            return in_array($role, ['tehsil_admin', 'tehsil_president']) && $user->tehsil_id === $position->entity_id;
        }
        
        return false;
    }
    
    /**
     * Get user's management level
     */
    private function getUserLevel(User $user): string
    {
        $role = $user->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        return 'tehsil';
    }
}

