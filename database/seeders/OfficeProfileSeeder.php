<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OfficeProfile;
use App\Models\State;
use App\Models\User;

class OfficeProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jkState = State::where('code', 'JK')->first();
        $adminUser = User::first(); // Assuming super admin is first

        if ($jkState && $adminUser) {
            OfficeProfile::updateOrCreate(
                [
                    'entity_type' => State::class,
                    'entity_id' => $jkState->id,
                ],
                [
                    'organization_name' => 'JAMMU AND KASHMIR EMPLOYEES COORDINATION COMMITTEE',
                    'short_name' => 'JKECC',
                    'level' => 'state',
                    'tagline' => 'Voice of the Employees',
                    'established_date' => '2010-01-01',
                    'full_address' => 'Residency Road, Srinagar, J&K - 190001',
                    'primary_email' => 'contact@jkecc.org',
                    'website' => 'https://jkecc.org',
                    'contact_numbers' => ['9906655443', '0194-2455667'],
                    'header_alignment' => 'center',
                    'primary_color' => '#dc2626',
                    'secondary_color' => '#1e40af',
                    'footer_line_1' => 'Residency Road, Srinagar | Gandhi Nagar, Jammu',
                    'is_complete' => true,
                    'completion_percentage' => 100,
                    'created_by' => $adminUser->id,
                ]
            );
            $this->command->info('State Office Profile seeded successfully for JKECC.');
        } else {
            $this->command->warn('Skipping OfficeProfileSeeder: State or Admin User not found.');
        }
    }
}
