<?php

namespace App\Policies;

use App\Models\CommitteeElection;
use App\Models\User;

class CommitteeElectionPolicy
{
    /**
     * Determine if user can view any committee elections.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
    
    /**
     * Determine if user can view a specific committee election.
     */
    public function view(User $user, CommitteeElection $election): bool
    {
        // Check if user can access the committee's level
        $committee = $election->committee;
        
        if ($user->role === 'super_admin') {
            return true;
        }
        
        switch ($committee->level) {
            case 'state':
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            case 'district':
                if ($user->role === 'district_admin') {
                    return $user->district_id === $committee->entity_id;
                }
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            case 'tehsil':
                if ($user->role === 'tehsil_admin') {
                    return $user->tehsil_id === $committee->entity_id;
                }
                if ($user->role === 'district_admin') {
                    return \App\Models\Tehsil::where('id', $committee->entity_id)
                        ->where('district_id', $user->district_id)
                        ->exists();
                }
                return in_array($user->role, ['super_admin', 'state_admin']);
                
            default:
                return false;
        }
    }
    
    /**
     * Determine if user can create committee elections.
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
     * Determine if user can update committee election.
     */
    public function update(User $user, CommitteeElection $election): bool
    {
        if (!$this->create($user)) {
            return false;
        }
        
        return $this->view($user, $election);
    }
    
    /**
     * Determine if user can delete committee election.
     */
    public function delete(User $user, CommitteeElection $election): bool
    {
        return $this->update($user, $election) && $election->status !== 'completed';
    }
    
    /**
     * Determine if user can manage status (as admin).
     */
    public function manageStatus(User $user, CommitteeElection $election): bool
    {
        return $this->update($user, $election);
    }
}

