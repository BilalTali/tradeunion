<?php

namespace App\Observers;

use App\Models\LeadershipPosition;
use App\Models\ElectionCommission;
use App\Models\Election;
use Illuminate\Support\Facades\Log;

class LeadershipPositionObserver
{
    /**
     * Handle the LeadershipPosition "created" event.
     */
    public function created(LeadershipPosition $position): void
    {
        // Set as active portfolio if it's the member's first/only portfolio
        if ($position->is_current) {
            $hasOtherActive = LeadershipPosition::where('member_id', $position->member_id)
                ->where('id', '!=', $position->id)
                ->where('is_current', true)
                ->where('active_portfolio', true)
                ->exists();
            
            // If no other active portfolios, make this one active
            if (!$hasOtherActive) {
                $position->update(['active_portfolio' => true]);
            }
        }
        
        // If this is an Election Commission portfolio, sync to election_commissions table
        if ($position->portfolio && $position->portfolio->isElectionCommission()) {
            $this->syncToElectionCommissions($position);
        }
    }

    /**
     * Handle the LeadershipPosition "updated" event.
     */
    public function updated(LeadershipPosition $position): void
    {
        // If EC portfolio is being activated/deactivated, sync accordingly
        if ($position->portfolio && $position->portfolio->isElectionCommission()) {
            if ($position->is_current && !$position->wasChanged('is_current')) {
                // Still current, might need to update elections
                $this->syncToElectionCommissions($position);
            } elseif (!$position->is_current && $position->wasChanged('is_current')) {
                // No longer current, remove from election commissions
                $this->removeFromElectionCommissions($position);
            }
        }
    }

    /**
     * Handle the LeadershipPosition "deleted" event.
     */
    public function deleted(LeadershipPosition $position): void
    {
        // Remove from all election commissions
        if ($position->portfolio && $position->portfolio->isElectionCommission()) {
            $this->removeFromElectionCommissions($position);
        }
    }

    /**
     * Sync EC portfolio holder to election_commissions table
     */
    private function syncToElectionCommissions(LeadershipPosition $position): void
    {
        try {
            // Find all elections at this level that don't have this member in commission
            $elections = Election::where('level', $position->level)
                ->whereDoesntHave('commission', function($query) use ($position) {
                    $query->where('member_id', $position->member_id);
                })
                ->get();

            foreach ($elections as $election) {
                ElectionCommission::create([
                    'election_id' => $election->id,
                    'member_id' => $position->member_id,
                    'role' => $this->getECRole($position->portfolio),
                    'appointed_at' => $position->start_date ?? now(),
                ]);

                Log::info('EC Member synced to election', [
                    'member_id' => $position->member_id,
                    'election_id' => $election->id,
                    'portfolio' => $position->portfolio->name,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to sync EC member to elections', [
                'position_id' => $position->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove EC member from election_commissions table
     */
    private function removeFromElectionCommissions(LeadershipPosition $position): void
    {
        try {
            $deleted = ElectionCommission::where('member_id', $position->member_id)->delete();

            Log::info('EC Member removed from elections', [
                'member_id' => $position->member_id,
                'commissions_removed' => $deleted,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to remove EC member from elections', [
                'position_id' => $position->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Determine EC role based on portfolio
     */
    private function getECRole($portfolio): string
    {
        if (str_contains($portfolio->code, 'CHIEF')) {
            return 'Chief Commissioner';
        } elseif (str_contains($portfolio->code, 'ASST')) {
            return 'Assistant Commissioner';
        } elseif (str_contains($portfolio->code, 'OFFICER')) {
            return 'Election Officer';
        } elseif (str_contains($portfolio->code, 'SECRETARY')) {
            return 'EC Secretary';
        } else {
            return 'Commissioner';
        }
    }
}
