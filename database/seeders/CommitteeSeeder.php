<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Committee;
use App\Models\User;

class CommitteeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::where('role', 'super_admin')->first();
        
        if (!$superAdmin) {
            $this->command->warn('No super admin found. Skipping committee seeding.');
            return;
        }

        $committees = [
            // State Level Committees
            [
                'name' => 'State Executive Committee',
                'slug' => 'state-executive-committee',
                'type' => 'executive',
                'level' => 'state',
                'entity_id' => 1, // J&K State
                'min_members' => 7,
                'max_members' => 15,
                'quorum_percentage' => 50.00,
                'voting_threshold' => 50.00,
                'start_date' => now(),
                'end_date' => now()->addYears(3),
                'is_active' => true,
                'description' => 'The highest decision-making body of the Teachers Trade Union responsible for strategic decisions and constitutional matters.',
                'constitutional_basis' => 'Article 5 - State Executive Committee',
                'created_by' => $superAdmin->id,
            ],
            [
                'name' => 'State Election Commission',
                'slug' => 'state-election-commission',
                'type' => 'election_commission',
                'level' => 'state',
                'entity_id' => 1,
                'min_members' => 3,
                'max_members' => 7,
                'quorum_percentage' => 66.67,
                'voting_threshold' => 66.67,
                'start_date' => now(),
                'end_date' => null,
                'is_active' => true,
                'description' => 'Permanent body responsible for conducting transparent and fair elections at all levels.',
                'constitutional_basis' => 'Article 8 - Election Commission',
                'created_by' => $superAdmin->id,
            ],
            [
                'name' => 'State Disciplinary Committee',
                'slug' => 'state-disciplinary-committee',
                'type' => 'disciplinary',
                'level' => 'state',
                'entity_id' => 1,
                'min_members' => 5,
                'max_members' => 9,
                'quorum_percentage' => 60.00,
                'voting_threshold' => 66.67,
                'start_date' => now(),
                'end_date' => now()->addYears(3),
                'is_active' => true,
                'description' => 'Handles member conduct violations, ethics complaints, and disciplinary proceedings.',
                'constitutional_basis' => 'Article 12 - Disciplinary Proceedings',
                'created_by' => $superAdmin->id,
            ],
            [
                'name' => 'State Finance & Audit Committee',
                'slug' => 'state-finance-audit-committee',
                'type' => 'finance',
                'level' => 'state',
                'entity_id' => 1,
                'min_members' => 5,
                'max_members' => 7,
                'quorum_percentage' => 60.00,
                'voting_threshold' => 75.00,
                'start_date' => now(),
                'end_date' => now()->addYears(3),
                'is_active' => true,
                'description' => 'Oversees union finances, approves budgets, and conducts financial audits.',
                'constitutional_basis' => 'Article 15 - Financial Management',
                'created_by' => $superAdmin->id,
            ],
        ];

        foreach ($committees as $committee) {
            Committee::updateOrCreate(
                ['slug' => $committee['slug']],
                $committee
            );
        }

        $this->command->info('Successfully seeded ' . count($committees) . ' state-level committees.');
        $this->command->info('District and zone committee structures will be established through resolutions.');
    }
}
