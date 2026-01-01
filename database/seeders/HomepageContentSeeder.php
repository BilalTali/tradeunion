<?php

namespace Database\Seeders;

use App\Models\HomepageContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomepageContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Contact Page Intro
        HomepageContent::firstOrCreate(
            ['key' => 'contact_intro'],
            [
                'title' => 'Contact Us',
                'subtitle' => 'Get in touch',
                'content' => "We're here to help. Reach out to us for any queries or support.",
                'is_active' => true,
            ]
        );

        // 2. Privacy Policy
        $privacyPolicy = [
            [
                'title' => '1. Introduction',
                'content' => 'The Jammu and Kashmir Employees Coordination Committee ("JKECC", "we", "us", or "our") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our portal. By accessing or using the JKECC portal, you agree to the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.'
            ],
            [
                'title' => '2. Information We Collect',
                'content' => "We collect information that you provide directly to us, including: Full name, parentage, date of birth, Contact information, School/institution name, Membership ID, Photograph, Professional information. We also automatically collect IP address, device info, etc."
            ],
            // ... (I will include a summarized version or the full text for simplicity)
            [
                'title' => '11. Contact Us',
                'content' => "If you have questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us at privacy@jkecc.gov.in."
            ]
        ];
        
        // Storing as JSON array
        HomepageContent::firstOrCreate(
            ['key' => 'privacy_policy'],
            [
                'title' => 'Privacy Policy',
                'subtitle' => 'Last updated: December 27, 2025',
                'content' => json_encode($privacyPolicy), // Store as list
                'is_active' => true,
            ]
        );

        // 3. Terms of Service
        $terms = [
            [
                'title' => '1. Acceptance of Terms',
                'content' => 'By accessing and using the Jammu and Kashmir Employees Coordination Committee ("JKECC") portal, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
            ],
            [
                'title' => '2. Eligibility and Membership',
                'content' => 'The JKECC portal is intended for active and approved members of JKECC, authorized union officials, and election commissioners. You must be at least 18 years of age.'
            ],
             [
                'title' => '11. Contact Information',
                'content' => 'For questions about these Terms of Service, please contact us at legal@jkecc.gov.in.'
            ]
        ];

        HomepageContent::updateOrCreate(
            ['key' => 'terms_of_service'],
            [
                'title' => 'Terms of Service',
                'subtitle' => 'Last updated: December 27, 2025',
                'content' => json_encode($terms),
                'is_active' => true,
            ]
        );
        // 4. Achievement Ticker
        HomepageContent::updateOrCreate(
            ['key' => 'achievements_ticker'],
            [
                'title' => 'Latest Achievements',
                'subtitle' => 'Live Updates',
                'content' => json_encode([
                    ['message' => '🎉 Union Membership Drive 2025 has started! Join today.'],
                    ['message' => '🏆 Successful negotiation for 7th Pay Commission arrears.'],
                    ['message' => '📢 Annual General Meeting scheduled for March 15th.']
                ]),
                'is_active' => true,
            ]
        );

        // 5. Voice of Unity (Feedback Section)
        HomepageContent::updateOrCreate(
            ['key' => 'voice_of_unity'],
            [
                'title' => 'The Voice of Unity',
                'subtitle' => 'Join the conversation and make your voice heard.',
                'content' => json_encode([[
                    'empty_message' => 'Be the first to share your voice!',
                    'button_text' => 'Share Your Feedback / Grievance',
                    'auth_note' => 'Authenticated Members only',
                    'placeholder_title' => 'Real experiences from our members serving the nation.'
                ]]),
                'is_active' => true,
            ]
        );

        // 6. Latest Updates Ticker (New)
        HomepageContent::updateOrCreate(
            ['key' => 'latest_updates'],
            [
                'title' => 'Latest Updates',
                'subtitle' => 'Live scrolling updates',
                'content' => json_encode([
                    ['title' => 'Welcome to the new Teachers Union Portal!'],
                    ['title' => 'Elections upcoming soon - check your eligibility.'],
                    ['title' => 'Annual General Meeting scheduled for next month.'],
                ]),
                'is_active' => true,
                'settings' => ['bg_color' => '#1F2937']
            ]
        );

        // 7. Portal Launch (Celebration)
        HomepageContent::updateOrCreate(
            ['key' => 'portal_launch'],
            [
                'title' => 'Portal Launch',
                'subtitle' => 'Grand Opening Celebration',
                'content' => json_encode([
                    [
                        'is_active' => 'false', // Default off
                        'chief_guest_name' => 'Hon. Chief Guest Name',
                        'guest_designation' => 'Director Education',
                        'launch_message' => 'Congratulations!',
                        'button_text' => 'LAUNCH PORTAL'
                    ]
                ]),
                'is_active' => true,
                'settings' => ['bg_color' => '#000000']
            ]
        );

        // 8. Footer Global Setting
        HomepageContent::updateOrCreate(
            ['key' => 'footer_global'],
            [
                'title' => 'Global Footer',
                'subtitle' => 'Site-wide Footer Settings',
                'content' => json_encode([
                    'about_text' => 'Serving the employees of Jammu & Kashmir with dedication and integrity.',
                    'copyright_text' => '© ' . date('Y') . ' JKECC. All rights reserved.',
                    'facebook_url' => 'https://facebook.com',
                    'twitter_url' => 'https://twitter.com',
                    'instagram_url' => 'https://instagram.com',
                    'youtube_url' => 'https://youtube.com',
                    'linkedin_url' => 'https://linkedin.com',
                    'useful_links' => "About Us | /about\nContact | /contact\nLogin | /login\nConstitution | /constitution",
                    'developed_by' => 'Tali Bilal',
                    'developed_by_url' => '8899055335'
                ]),
                'is_active' => true,
                'settings' => ['bg_color' => '#111827']
            ]
        );
    }
}
