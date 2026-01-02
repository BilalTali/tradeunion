<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HomepageContent;
use App\Models\OfficeProfile;
use App\Models\State;

class FixBrandingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Force Update Office Profile
        $jkState = State::where('code', 'JK')->first();
        if ($jkState) {
            OfficeProfile::updateOrCreate(
                ['entity_id' => $jkState->id, 'entity_type' => State::class],
                [
                    'organization_name' => 'JAMMU AND KASHMIR EMPLOYEES COORDINATION COMMITTEE',
                    'short_name' => 'JKECC',
                    'tagline' => 'Voice of the Employees',
                    'primary_email' => 'contact@jkecc.org',
                    'website' => 'https://jkecc.org',
                    'primary_color' => '#dc2626',
                    'secondary_color' => '#1e40af',
                ]
            );
            $this->command->info('Updated Office Profile to JKECC.');
        }

        // 2. Force Update Homepage Content (Mission)
        HomepageContent::updateOrCreate(
            ['key' => 'mission_cards'],
            [
                'title' => 'Our Core Mission',
                'subtitle' => 'Empowering educators across J&K',
                'content' => json_encode([
                    [
                        'icon' => '✊', 
                        'title' => 'Empowerment & Advocacy', 
                        'description' => 'Uniting teachers to advocate for fair wages, better working conditions, and professional dignity.'
                    ],
                    [
                        'icon' => '🎓', 
                        'title' => 'Professional Growth', 
                        'description' => 'Training programs, workshops, and skill enhancement opportunities for continuous learning.'
                    ],
                    [
                        'icon' => '🏥', 
                        'title' => 'Welfare & Insurance', 
                        'description' => 'Access to welfare schemes, medical assistance, and insurance support for members and families.'
                    ],
                    [
                        'icon' => '🗳️', 
                        'title' => 'Democratic Governance', 
                        'description' => 'Fair elections and member participation in decision-making.'
                    ],
                ]),
            ]
        );

        // 3. Force Update About Content
        HomepageContent::updateOrCreate(
            ['key' => 'about'],
            [
                'title' => 'About JKECC',
                'content' => 'The Jammu and Kashmir Employees Coordination Committee (JKECC) is a legally recognized trade union representing the collective voice of educators across the Union Territory of Jammu & Kashmir. Established to protect the rights of teachers and promote excellence in education, JKECC operates on democratic principles with a transparent, three-tier organizational structure.',
            ]
        );

        // 4. Force Update Terms & Privacy titles if stored
        HomepageContent::updateOrCreate(
            ['key' => 'privacy_policy'],
            [
                'title' => 'Privacy Policy',
                'subtitle' => 'JKECC Data Protection Standards',
            ]
        );
        HomepageContent::updateOrCreate(
            ['key' => 'terms_of_service'],
            [
                'title' => 'Terms of Service',
                'subtitle' => 'JKECC Portal Usage Guidelines',
            ]
        );

        $this->command->info('All branding content updated to JKECC.');
    }
}
