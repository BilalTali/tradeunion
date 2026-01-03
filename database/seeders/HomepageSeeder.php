<?php

namespace Database\Seeders;

use App\Models\HomepageContent;
use Illuminate\Database\Seeder;

class HomepageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Mission Cards (Hero Overlay)
        HomepageContent::updateOrCreate(
            ['key' => 'mission_cards'],
            [
                'title' => 'Our Core Mission',
                'subtitle' => 'Empowering educators across J&K',
                'content' => json_encode([
                    [
                        'icon' => '✊', 
                        'title' => 'Stronger Voice, One Platform', 
                        'description' => 'A unified digital union platform where every employee can raise issues, track actions, and participate in governance transparently.'
                    ],
                    [
                        'icon' => '📝', 
                        'title' => 'Online Grievance Desk', 
                        'description' => 'Submit issues digitally and track every action taken by union committees until resolution.'
                    ],
                    [
                        'icon' => '🗳️', 
                        'title' => 'Digital Democratic Governance', 
                        'description' => 'Multi‑level online election system with eligibility rules, OTP voting, and auditable results for fair leadership selection'
                    ],
                    [
                        'icon' => '🆔', 
                        'title' => 'Digital QR ID Cards', 
                        'description' => 'Auto‑generated membership I‑Cards with QR code for public verification and quick identity checks'
                    ],
                ]),
                'is_active' => true,
            ]
        );

        // 2. Organizational Structure
        HomepageContent::updateOrCreate(
            ['key' => 'structure'],
            [
                'title' => 'Organizational Structure',
                'subtitle' => 'Transparent hierarchy ensuring accountability at every level',
                'content' => json_encode([
                    [
                        'level' => 'State Level',
                        'color' => 'border-union-primary',
                        'description' => 'Statewide governance, policy direction, and representation before UT administration. Elected state executive manages overall operations.',
                        'scope' => 'Jurisdiction: Entire UT of J&K'
                    ],
                    [
                        'level' => 'District Level',
                        'color' => 'border-union-secondary',
                        'description' => 'Regional coordination across 4 districts (Srinagar, Jammu, Anantnag, Baramulla). District executives manage local initiatives and member services.',
                        'scope' => '4 Active Districts'
                    ],
                    [
                        'level' => 'Tehsil Level',
                        'color' => 'border-blue-500',
                        'description' => 'Grassroots representation through tehsils. Tehsil committees handle local grievances, membership verification, and community engagement.',
                        'scope' => '200+ Active Tehsils'
                    ],
                    [
                        'level' => 'Member Level',
                        'color' => 'border-green-500',
                        'description' => 'Individual teachers with verified membership. Full voting rights, access to services, and participation in democratic processes.',
                        'scope' => '50,000+ Active Members'
                    ],
                ]),
                'settings' => ['bg_color' => '#f9fafb'], // gray-50
                'is_active' => true,
            ]
        );

        // 3. Membership Journey
        HomepageContent::updateOrCreate(
            ['key' => 'journey'],
            [
                'title' => 'Membership Journey',
                'subtitle' => 'Clear, transparent process from registration to active participation',
                'content' => json_encode([
                    [
                        'number' => '1',
                        'title' => 'Registration',
                        'description' => 'Contact your Tehsil Office to submit membership application with required documents and school details',
                        'timeline' => 'Day 1',
                        'position' => 'left'
                    ],
                    [
                        'number' => '2',
                        'title' => 'Verification',
                        'description' => 'Your application will be verified by your tehsil admin to confirm employment and eligibility',
                        'timeline' => '2-5 Days',
                        'position' => 'right'
                    ],
                    [
                        'number' => '3',
                        'title' => 'Approval',
                        'description' => 'District admin approves membership after tehsil-level verification',
                        'timeline' => '5-7 Days',
                        'position' => 'left'
                    ],
                    [
                        'number' => '4',
                        'title' => 'Dashboard Access',
                        'description' => 'Receive login credentials and access to digital member services',
                        'timeline' => 'Immediate',
                        'position' => 'right'
                    ],
                    [
                        'number' => '5',
                        'title' => 'Active Membership',
                        'description' => 'Full participation rights, voting access, digital ID card, and service eligibility',
                        'timeline' => 'Ongoing',
                        'position' => 'left'
                    ],
                ]),
                'settings' => ['bg_color' => '#ffffff'],
                'is_active' => true,
            ]
        );

        // 4. Digital Features
        HomepageContent::updateOrCreate(
            ['key' => 'features'],
            [
                'title' => 'Digital Platform Features',
                'subtitle' => 'Modern, secure, and mobile-friendly digital infrastructure',
                'content' => json_encode([
                    ['icon' => '🔐', 'title' => 'Secure Dashboards', 'description' => 'Role-based access with portfolio-specific interfaces'],
                    ['icon' => '🪪', 'title' => 'Digital ID Cards', 'description' => 'QR-enabled membership cards with instant verification'],
                    ['icon' => '📄', 'title' => 'Official Documents', 'description' => 'Letters, certificates, and notices - digitally signed'],
                    ['icon' => '🗳️', 'title' => 'Online Elections', 'description' => 'Transparent, OTP-verified democratic processes'],
                    ['icon' => '📢', 'title' => 'Announcements', 'description' => 'Real-time notifications and circular distribution'],
                    ['icon' => '📋', 'title' => 'Committee Management', 'description' => 'Resolution tracking and decision documentation'],
                    ['icon' => '📱', 'title' => 'Mobile Access', 'description' => 'Fully responsive design for on-the-go access'],
                    ['icon' => '🔒', 'title' => 'Data Protection', 'description' => 'GDPR-compliant privacy and security measures'],
                ]),
                'settings' => [
                    'bg_gradient_start' => '#111827', // gray-900
                    'bg_gradient_end' => '#1f2937',   // gray-800
                    'text_color' => '#ffffff'
                ],
                'is_active' => true,
            ]
        );

        // 5. About
        HomepageContent::updateOrCreate(
            ['key' => 'about'],
            [
                'title' => 'About the Association',
                'content' => 'The Jammu and Kashmir Employees Coordination Committee (JKECC) is a legally recognized trade union representing the collective voice of educators across the Union Territory of Jammu & Kashmir. Established to protect the rights of teachers and promote excellence in education, JKECC operates on democratic principles with a transparent, three-tier organizational structure.',
                'settings' => ['bg_color' => '#f9fafb'],
                'is_active' => true,
            ]
        );
    }
}
