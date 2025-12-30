<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;

class MemberPolicy
{
    /**
     * Determine if user can view any members.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
    
    /**
     * Determine if user can view a specific member.
     */
    public function view(User $user, Member $member): bool
    {
        // Members can view their own profile
        if ($user->member && $user->member->id === $member->id) {
            return true;
        }
        
        $role = $user->role;

        // Super Admin / State Level
        if (in_array($role, ['super_admin', 'state_admin', 'state_member'])) {
            return true;
        }
        
        // District Level
        if (str_contains($role, 'district')) {
            return $member->district_id === $user->district_id;
        }
        
        // Tehsil Level / Regular Member
        if (str_contains($role, 'tehsil') || $role === 'member') {
            return $member->tehsil_id === $user->tehsil_id;
        }
        
        return false;
    }
    
    /**
     * Determine if user can create members.
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
     * Determine if user can update member.
     */
    public function update(User $user, Member $member): bool
    {
        // Members can update their own profile (limited fields)
        if ($user->member && $user->member->id === $member->id) {
            return true;
        }
        
        if (!$this->create($user)) {
            return false;
        }
        
        return $this->view($user, $member);
    }
    
    /**
     * Determine if user can delete member.
     */
    public function delete(User $user, Member $member): bool
    {
        // Only admins can delete members, not the member themselves
        if (!in_array($user->role, ['super_admin', 'state_admin', 'district_admin', 'tehsil_admin'])) {
            return false;
        }
        
        return $this->view($user, $member);
    }
    
    /**
     * Determine if user can suspend member.
     */
    public function suspend(User $user, Member $member): bool
    {
        return $this->delete($user, $member);
    }
    
    /**
     * Determine if user can transfer member.
     */
    public function transfer(User $user, Member $member): bool
    {
        // Only state and district admins can approve transfers
        return in_array($user->role, ['super_admin', 'state_admin', 'district_admin']);
    }
}

