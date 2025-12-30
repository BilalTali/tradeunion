<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Jammu and Kashmir
        \App\Models\State::updateOrCreate(
            ['code' => 'JK'], 
            [
                'name' => 'Jammu and Kashmir',
                'vision' => 'Empowering teachers, strengthening education',
                'mission' => 'Democratic representation and collective voice for all teachers',
                'contact_details' => [
                    'phone' => '+91-XXXXXXXXXX',
                    'email' => 'info@jktu.org',
                ],
            ]
        );

        // Seed Ladakh
        \App\Models\State::updateOrCreate(
            ['code' => 'LD'], 
            [
                'name' => 'Ladakh',
                'vision' => 'Empowering Ladakh teachers',
                'mission' => 'Unified voice for Ladakh educators',
                'contact_details' => [
                    'phone' => '+91-YYYYYYYYYY',
                    'email' => 'info@ladakhtu.org',
                ],
            ]
        );
    }
}
