<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portfolio;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding portfolios...');

        // Clear existing portfolios (safe for re-seeding)
        // Portfolio::truncate(); // Uncomment if you want to reset

        // ========================================
        // TEHSIL LEVEL PORTFOLIOS
        // ========================================
        $this->command->info('Seeding Tehsil portfolios...');

        // Executive
        $tehsilPresident = $this->createPortfolio([
            'code' => 'TEHSIL_PRESIDENT',
            'name' => 'Tehsil President',
            'level' => 'tehsil',
            'type' => 'executive',
            'category' => 'Core Leadership',
            'authority_rank' => 10,
            'can_assign_portfolios' => true,
            'can_initiate_transfers' => true,
            'description' => 'Head of the Tehsil Unit',
        ]);

        $this->createPortfolio([
            'code' => 'TEHSIL_VICE_PRESIDENT',
            'name' => 'Tehsil Vice President',
            'level' => 'tehsil',
            'type' => 'executive',
            'category' => 'Core Leadership',
            'authority_rank' => 20,
            'reports_to_portfolio_id' => $tehsilPresident->id,
            'description' => 'Deputy to the Tehsil President',
        ]);

        $this->createPortfolio([
            'code' => 'TEHSIL_SECRETARY',
            'name' => 'Tehsil Secretary',
            'level' => 'tehsil',
            'type' => 'administrative',
            'category' => 'Core Leadership',
            'authority_rank' => 30,
            'reports_to_portfolio_id' => $tehsilPresident->id,
            'description' => 'Administrative head of the Tehsil',
        ]);

        $this->createPortfolio([
            'code' => 'TEHSIL_JOINT_SECRETARY',
            'name' => 'Tehsil Joint Secretary',
            'level' => 'tehsil',
            'type' => 'administrative',
            'category' => 'Core Leadership',
            'authority_rank' => 40,
            'description' => 'Assists the Tehsil Secretary',
        ]);

        $this->createPortfolio([
            'code' => 'TEHSIL_TREASURER',
            'name' => 'Tehsil Treasurer',
            'level' => 'tehsil',
            'type' => 'financial',
            'category' => 'Core Leadership',
            'authority_rank' => 35,
            'is_financial_role' => true,
            'reports_to_portfolio_id' => $tehsilPresident->id,
            'description' => 'Manages Tehsil finances',
        ]);

        // Election Commission - Tehsil
        $tehsilEC = $this->createPortfolio([
            'code' => 'TEHSIL_EC_COMMISSIONER',
            'name' => 'Tehsil Election Commissioner',
            'level' => 'tehsil',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 15,
            'can_conduct_elections' => true,
            'description' => 'Head of Tehsil Election Commission',
            'conflict_flags' => ['executive', 'administrative', 'financial'],
        ]);

        $this->createPortfolio([
            'code' => 'TEHSIL_EC_ASST',
            'name' => 'Tehsil Asst. Election Commissioner',
            'level' => 'tehsil',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 25,
            'can_conduct_elections' => true,
            'reports_to_portfolio_id' => $tehsilEC->id,
            'description' => 'Assists the Tehsil Election Commissioner',
        ]);

        $this->createPortfolio([
            'code' => 'TEHSIL_EC_OFFICER',
            'name' => 'Tehsil Election Officer',
            'level' => 'tehsil',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 45,
            'can_conduct_elections' => true,
            'reports_to_portfolio_id' => $tehsilEC->id,
            'description' => 'Election officer for Tehsil elections',
        ]);

        // ========================================
        // DISTRICT LEVEL PORTFOLIOS
        // ========================================
        $this->command->info('Seeding District portfolios...');

        // Executive
        $distPresident = $this->createPortfolio([
            'code' => 'DIST_PRESIDENT',
            'name' => 'District President',
            'level' => 'district',
            'type' => 'executive',
            'category' => 'Core Leadership',
            'authority_rank' => 10,
            'can_assign_portfolios' => true,
            'can_initiate_transfers' => true,
            'can_approve_transfers' => true,
            'description' => 'Head of the District Unit',
        ]);

        $this->createPortfolio([
            'code' => 'DIST_VICE_PRESIDENT',
            'name' => 'District Vice President',
            'level' => 'district',
            'type' => 'executive',
            'category' => 'Core Leadership',
            'authority_rank' => 20,
            'reports_to_portfolio_id' => $distPresident->id,
            'description' => 'Deputy to the District President',
        ]);

        $this->createPortfolio([
            'code' => 'DIST_SECRETARY',
            'name' => 'District Secretary',
            'level' => 'district',
            'type' => 'administrative',
            'category' => 'Core Leadership',
            'authority_rank' => 30,
            'reports_to_portfolio_id' => $distPresident->id,
            'description' => 'Administrative head of the District',
        ]);

        $this->createPortfolio([
            'code' => 'DIST_JOINT_SECRETARY',
            'name' => 'District Joint Secretary',
            'level' => 'district',
            'type' => 'administrative',
            'category' => 'Core Leadership',
            'authority_rank' => 40,
            'description' => 'Assists the District Secretary',
        ]);

        $this->createPortfolio([
            'code' => 'DIST_TREASURER',
            'name' => 'District Treasurer',
            'level' => 'district',
            'type' => 'financial',
            'category' => 'Core Leadership',
            'authority_rank' => 35,
            'is_financial_role' => true,
            'reports_to_portfolio_id' => $distPresident->id,
            'description' => 'Manages District finances',
        ]);

        // Election Commission - District
        $distChiefEC = $this->createPortfolio([
            'code' => 'DIST_CHIEF_EC',
            'name' => 'District Chief Election Commissioner',
            'level' => 'district',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 10,
            'can_conduct_elections' => true,
            'can_resolve_disputes' => true,
            'description' => 'Head of District Election Commission',
            'conflict_flags' => ['executive', 'administrative', 'financial'],
        ]);

        $this->createPortfolio([
            'code' => 'DIST_EC_COMMISSIONER',
            'name' => 'District Election Commissioner',
            'level' => 'district',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 20,
            'can_conduct_elections' => true,
            'reports_to_portfolio_id' => $distChiefEC->id,
            'description' => 'Member of District Election Commission',
        ]);

        $this->createPortfolio([
            'code' => 'DIST_EC_OFFICER',
            'name' => 'District Election Officer',
            'level' => 'district',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 40,
            'can_conduct_elections' => true,
            'reports_to_portfolio_id' => $distChiefEC->id,
            'description' => 'Election officer for District elections',
        ]);

        // ========================================
        // STATE LEVEL PORTFOLIOS
        // ========================================
        $this->command->info('Seeding State portfolios...');

        // Executive
        $statePresident = $this->createPortfolio([
            'code' => 'STATE_PRESIDENT',
            'name' => 'State President',
            'level' => 'state',
            'type' => 'executive',
            'category' => 'Core Leadership',
            'authority_rank' => 1,
            'can_assign_portfolios' => true,
            'can_initiate_transfers' => true,
            'can_approve_transfers' => true,
            'description' => 'Head of the State Unit',
        ]);

        $this->createPortfolio([
            'code' => 'STATE_VICE_PRESIDENT',
            'name' => 'State Vice President',
            'level' => 'state',
            'type' => 'executive',
            'category' => 'Core Leadership',
            'authority_rank' => 5,
            'reports_to_portfolio_id' => $statePresident->id,
            'description' => 'Deputy to the State President',
        ]);

        $this->createPortfolio([
            'code' => 'STATE_SECRETARY',
            'name' => 'State Secretary',
            'level' => 'state',
            'type' => 'administrative',
            'category' => 'Core Leadership',
            'authority_rank' => 10,
            'reports_to_portfolio_id' => $statePresident->id,
            'description' => 'Administrative head of the State',
        ]);

        $this->createPortfolio([
            'code' => 'STATE_JOINT_SECRETARY',
            'name' => 'State Joint Secretary',
            'level' => 'state',
            'type' => 'administrative',
            'category' => 'Core Leadership',
            'authority_rank' => 20,
            'description' => 'Assists the State Secretary',
        ]);

        $this->createPortfolio([
            'code' => 'STATE_TREASURER',
            'name' => 'State Treasurer',
            'level' => 'state',
            'type' => 'financial',
            'category' => 'Core Leadership',
            'authority_rank' => 15,
            'is_financial_role' => true,
            'reports_to_portfolio_id' => $statePresident->id,
            'description' => 'Manages State finances',
        ]);

        // Election Commission - State
        $stateChiefEC = $this->createPortfolio([
            'code' => 'STATE_CHIEF_EC',
            'name' => 'State Chief Election Commissioner',
            'level' => 'state',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 1,
            'can_conduct_elections' => true,
            'can_resolve_disputes' => true,
            'description' => 'Head of State Election Commission - Final authority on elections',
            'conflict_flags' => ['executive', 'administrative', 'financial'],
        ]);

        $this->createPortfolio([
            'code' => 'STATE_EC_COMMISSIONER',
            'name' => 'State Election Commissioner',
            'level' => 'state',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 5,
            'can_conduct_elections' => true,
            'can_resolve_disputes' => true,
            'reports_to_portfolio_id' => $stateChiefEC->id,
            'description' => 'Member of State Election Commission',
        ]);

        $this->createPortfolio([
            'code' => 'STATE_EC_SECRETARY',
            'name' => 'State Election Secretary',
            'level' => 'state',
            'type' => 'election_commission',
            'category' => 'Election Commission',
            'authority_rank' => 15,
            'can_conduct_elections' => true,
            'reports_to_portfolio_id' => $stateChiefEC->id,
            'description' => 'Administrative head of State Election Commission',
        ]);

        $this->command->info('✓ Portfolio seeding completed!');
        $this->command->info('Total portfolios: ' . Portfolio::count());
    }

    /**
     * Create or update a portfolio
     */
    private function createPortfolio(array $data): Portfolio
    {
        return Portfolio::updateOrCreate(
            ['code' => $data['code']],
            array_merge([
                'is_active' => true,
            ], $data)
        );
    }
}
