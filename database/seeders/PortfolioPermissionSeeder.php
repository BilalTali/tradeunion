<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portfolio;
use App\Models\PortfolioPermission;

class PortfolioPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding portfolio permissions...');

        // Election Commission Permissions (All Levels)
        $this->seedElectionCommissionPermissions();
        
        // Executive Permissions (Presidents)
        $this->seedPresidentPermissions();
        
        // Administrative Permissions (Secretaries)
        $this->seedSecretaryPermissions();
        
        // Financial Permissions (Treasurers)
        $this->seedTreasurerPermissions();

        $this->command->info('✓ Portfolio permissions seeded successfully!');
        $this->command->info('Total permissions: ' . PortfolioPermission::count());
    }

    /**
     * Seed Election Commission-specific permissions
     */
    private function seedElectionCommissionPermissions()
    {
        $ecPortfolios = Portfolio::where('type', 'election_commission')->get();

        foreach ($ecPortfolios as $portfolio) {
            $level = $portfolio->level;
            $isChief = str_contains($portfolio->code, 'CHIEF');

            // All EC members can conduct elections
            $this->createPermission($portfolio, [
                'permission_key' => 'election.create',
                'resource_type' => 'election',
                'can_write' => true,
                'can_execute' => true,
                'constraints' => ['level' => $level],
                'description' => 'Create new elections at ' . $level . ' level',
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'election.read',
                'resource_type' => 'election',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'election.open_nominations',
                'resource_type' => 'election',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'election.close_nominations',
                'resource_type' => 'election',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'election.open_voting',
                'resource_type' => 'election',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'election.close_voting',
                'resource_type' => 'election',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            // Candidate management
            $this->createPermission($portfolio, [
                'permission_key' => 'candidate.review',
                'resource_type' => 'candidate',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'candidate.approve',
                'resource_type' => 'candidate',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'candidate.reject',
                'resource_type' => 'candidate',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            // Vote verification
            $this->createPermission($portfolio, [
                'permission_key' => 'vote.verify',
                'resource_type' => 'vote',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'vote.approve',
                'resource_type' => 'vote',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'vote.reject',
                'resource_type' => 'vote',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            // Result management
            $this->createPermission($portfolio, [
                'permission_key' => 'result.calculate',
                'resource_type' => 'result',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'result.certify',
                'resource_type' => 'result',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            // Chief EC gets dispute resolution
            if ($isChief) {
                $this->createPermission($portfolio, [
                    'permission_key' => 'election.resolve_disputes',
                    'resource_type' => 'election',
                    'can_execute' => true,
                    'constraints' => ['level' => $level],
                ]);
            }
        }
    }

    /**
     * Seed President-specific permissions
     */
    private function seedPresidentPermissions()
    {
        $presidents = Portfolio::where('name', 'LIKE', '%President')
            ->where('type', 'executive')
            ->get();

        foreach ($presidents as $portfolio) {
            $level = $portfolio->level;

            // Member management
            $this->createPermission($portfolio, [
                'permission_key' => 'member.read',
                'resource_type' => 'member',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'member.approve',
                'resource_type' => 'member',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'member.suspend',
                'resource_type' => 'member',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            // Portfolio assignment
            $this->createPermission($portfolio, [
                'permission_key' => 'portfolio.assign',
                'resource_type' => 'portfolio',
                'can_write' => true,
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'portfolio.revoke',
                'resource_type' => 'portfolio',
                'can_delete' => true,
                'constraints' => ['level' => $level],
            ]);

            // Transfer management
            if (in_array($level, ['district', 'state'])) {
                $this->createPermission($portfolio, [
                    'permission_key' => 'transfer.approve',
                    'resource_type' => 'transfer',
                    'can_execute' => true,
                    'constraints' => ['level' => $level],
                ]);
            }

            $this->createPermission($portfolio, [
                'permission_key' => 'transfer.initiate',
                'resource_type' => 'transfer',
                'can_write' => true,
                'constraints' => ['level' => $level],
            ]);
        }
    }

    /**
     * Seed Secretary-specific permissions
     */
    private function seedSecretaryPermissions()
    {
        $secretaries = Portfolio::where('name', 'LIKE', '%Secretary')
            ->where('type', 'administrative')
            ->get();

        foreach ($secretaries as $portfolio) {
            $level = $portfolio->level;

            // Member data management
            $this->createPermission($portfolio, [
                'permission_key' => 'member.read',
                'resource_type' => 'member',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'member.update',
                'resource_type' => 'member',
                'can_write' => true,
                'constraints' => ['level' => $level],
            ]);

            // Transfer recommendations
            $this->createPermission($portfolio, [
                'permission_key' => 'transfer.recommend',
                'resource_type' => 'transfer',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            // Document management
            $this->createPermission($portfolio, [
                'permission_key' => 'document.create',
                'resource_type' => 'document',
                'can_write' => true,
                'constraints' => ['level' => $level],
            ]);
        }
    }

    /**
     * Seed Treasurer-specific permissions
     */
    private function seedTreasurerPermissions()
    {
        $treasurers = Portfolio::where('name', 'LIKE', '%Treasurer')
            ->where('type', 'financial')
            ->get();

        foreach ($treasurers as $portfolio) {
            $level = $portfolio->level;

            // Financial management
            $this->createPermission($portfolio, [
                'permission_key' => 'finance.view_reports',
                'resource_type' => 'finance',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'finance.create_budget',
                'resource_type' => 'finance',
                'can_write' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'finance.approve_expense',
                'resource_type' => 'finance',
                'can_execute' => true,
                'constraints' => ['level' => $level],
            ]);

            $this->createPermission($portfolio, [
                'permission_key' => 'finance.audit',
                'resource_type' => 'finance',
                'can_read' => true,
                'constraints' => ['level' => $level],
            ]);
        }
    }

    /**
     * Helper to create or update a permission
     */
    private function createPermission(Portfolio $portfolio, array $data)
    {
        PortfolioPermission::updateOrCreate(
            [
                'portfolio_id' => $portfolio->id,
                'permission_key' => $data['permission_key'],
            ],
            $data
        );
    }
}
