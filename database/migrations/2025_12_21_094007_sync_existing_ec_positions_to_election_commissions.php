<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\LeadershipPosition;
use App\Models\ElectionCommission;
use App\Models\Election;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            // Sync existing EC portfolio assignments to election_commissions table
            $ecPositions = LeadershipPosition::whereHas('portfolio', function($query) {
                    $query->where('type', 'election_commission');
                })
                ->where('is_current', true)
                ->with('portfolio', 'member')
                ->get();

            if ($ecPositions->isEmpty()) {
                echo "No EC positions found to sync.\n";
                return;
            }

            $syncedCount = 0;

            foreach ($ecPositions as $position) {
                if (!$position->member) {
                    echo "⚠ Skipping position without member\n";
                    continue;
                }

                // Find all elections at this level
                $elections = Election::where('level', $position->level)->get();

                if ($elections->isEmpty()) {
                    echo "⚠ No elections found for level: {$position->level}\n";
                    continue;
                }

                foreach ($elections as $election) {
                    // Check if not already in commission
                    $exists = ElectionCommission::where('election_id', $election->id)
                        ->where('member_id', $position->member_id)
                        ->exists();

                    if (!$exists) {
                        // Get assigner - use position's assigned_by or find an admin
                        $assignedBy = $position->assigned_by;
                        if (!$assignedBy) {
                            $adminUser = \App\Models\User::where('role', 'super_admin')->first();
                            if (!$adminUser) {
                                $adminUser = \App\Models\User::whereIn('role', ['state_admin', 'district_admin', 'zone_admin'])->first();
                            }
                            $assignedBy = $adminUser ? $adminUser->id : null;
                        }

                        if (!$assignedBy) {
                            echo "⚠ No assigner found for {$position->member->name}, skipping\n";
                            continue;
                        }

                        ElectionCommission::create([
                            'election_id' => $election->id,
                            'member_id' => $position->member_id,
                            'role' => $this->getECRole($position->portfolio),
                            'appointed_at' => $position->start_date ?? now(),
                            'assigned_by' => $assignedBy,
                        ]);

                        $syncedCount++;
                        echo "✓ Synced EC member {$position->member->name} to election '{$election->title}'\n";
                    }
                }
            }

            echo "\n✓ EC synchronization complete!\n";
            echo "Total EC positions processed: " . $ecPositions->count() . "\n";
            echo "Total records synced: {$syncedCount}\n";
        } catch (\Exception $e) {
            echo "\n⚠ EC sync migration encountered an issue: " . $e->getMessage() . "\n";
            echo "This is not critical - EC assignments can still be made manually.\n";
            // Don't throw - allow migration to continue
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is data-only, no schema changes to reverse
        // Optionally, you could remove synced records, but that's risky
        echo "No schema changes to reverse. EC commission records remain.\n";
    }

    /**
     * Helper: Determine EC role from portfolio
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
};
