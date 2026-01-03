<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [

            // Core Administration
            ['name' => 'General Administration', 'code' => 'GAD', 'description' => 'General Administration Department', 'icon' => 'settings'],
            ['name' => 'Home', 'code' => 'HOME', 'description' => 'Home Department', 'icon' => 'shield'],
            ['name' => 'Revenue', 'code' => 'REV', 'description' => 'Revenue Department', 'icon' => 'file-text'],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Finance Department', 'icon' => 'dollar-sign'],
            ['name' => 'Law, Justice & Parliamentary Affairs', 'code' => 'LAW', 'description' => 'Law and Justice Department', 'icon' => 'scale'],
            ['name' => 'Planning, Development & Monitoring', 'code' => 'PDM', 'description' => 'Planning and Development Department', 'icon' => 'bar-chart'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Information Technology Department', 'icon' => 'cpu'],

            // Education & Health
            ['name' => 'School Education', 'code' => 'SE', 'description' => 'Department of School Education', 'icon' => 'school'],
            ['name' => 'Higher Education', 'code' => 'HE', 'description' => 'Department of Higher Education', 'icon' => 'book'],
            ['name' => 'Health & Medical Education', 'code' => 'HME', 'description' => 'Health and Medical Education Department', 'icon' => 'heart'],

            // Social Welfare
            ['name' => 'Social Welfare', 'code' => 'SW', 'description' => 'Social Welfare Department', 'icon' => 'users'],
            ['name' => 'Tribal Affairs', 'code' => 'TA', 'description' => 'Tribal Affairs Department', 'icon' => 'user-check'],
            ['name' => 'Youth Services & Sports', 'code' => 'YSS', 'description' => 'Youth Services and Sports Department', 'icon' => 'activity'],
            ['name' => 'Culture', 'code' => 'CUL', 'description' => 'Culture Department', 'icon' => 'music'],
            ['name' => 'Information & Public Relations', 'code' => 'IPR', 'description' => 'Information and Public Relations Department', 'icon' => 'mic'],

            // Agriculture & Rural
            ['name' => 'Agriculture Production', 'code' => 'AGR', 'description' => 'Agriculture Production Department', 'icon' => 'leaf'],
            ['name' => 'Horticulture', 'code' => 'HORT', 'description' => 'Horticulture Department', 'icon' => 'sun'],
            ['name' => 'Animal & Sheep Husbandry', 'code' => 'ASH', 'description' => 'Animal and Sheep Husbandry Department', 'icon' => 'gitlab'],
            ['name' => 'Fisheries', 'code' => 'FISH', 'description' => 'Fisheries Department', 'icon' => 'anchor'],
            ['name' => 'Rural Development', 'code' => 'RD', 'description' => 'Rural Development Department', 'icon' => 'home'],
            ['name' => 'Panchayati Raj', 'code' => 'PR', 'description' => 'Panchayati Raj Department', 'icon' => 'map'],
            ['name' => 'Cooperation', 'code' => 'COOP', 'description' => 'Cooperation Department', 'icon' => 'share-2'],

            // Infrastructure
            ['name' => 'Public Works (R&B)', 'code' => 'PWD', 'description' => 'Public Works Department', 'icon' => 'tool'],
            ['name' => 'Jal Shakti', 'code' => 'JS', 'description' => 'Jal Shakti / PHE Department', 'icon' => 'droplet'],
            ['name' => 'Power Development', 'code' => 'PDD', 'description' => 'Power Development Department', 'icon' => 'zap'],
            ['name' => 'Housing & Urban Development', 'code' => 'HUD', 'description' => 'Housing and Urban Development Department', 'icon' => 'building'],
            ['name' => 'Transport', 'code' => 'TRN', 'description' => 'Transport Department', 'icon' => 'truck'],
            ['name' => 'Industries & Commerce', 'code' => 'IC', 'description' => 'Industries and Commerce Department', 'icon' => 'briefcase'],
            ['name' => 'Mining', 'code' => 'MIN', 'description' => 'Mining Department', 'icon' => 'layers'],

            // Environment & Disaster
            ['name' => 'Forest, Ecology & Environment', 'code' => 'FEE', 'description' => 'Forest and Environment Department', 'icon' => 'tree'],
            ['name' => 'Wildlife Protection', 'code' => 'WLP', 'description' => 'Wildlife Protection Department', 'icon' => 'feather'],
            ['name' => 'Disaster Management', 'code' => 'DMRR', 'description' => 'Disaster Management and Relief Department', 'icon' => 'alert-triangle'],
            ['name' => 'Science & Technology', 'code' => 'SNT', 'description' => 'Science and Technology Department', 'icon' => 'atom'],

            // Security & Justice
            ['name' => 'Police', 'code' => 'POL', 'description' => 'Jammu and Kashmir Police', 'icon' => 'shield-check'],
            ['name' => 'Prisons', 'code' => 'PRS', 'description' => 'Prisons Department', 'icon' => 'lock'],
            ['name' => 'Fire & Emergency Services', 'code' => 'FES', 'description' => 'Fire and Emergency Services', 'icon' => 'alert-circle'],
            ['name' => 'Prosecution', 'code' => 'PROS', 'description' => 'Prosecution Department', 'icon' => 'file'],

            // Employment & Consumer
            ['name' => 'Labour & Employment', 'code' => 'LE', 'description' => 'Labour and Employment Department', 'icon' => 'briefcase'],
            ['name' => 'Skill Development', 'code' => 'SD', 'description' => 'Skill Development Department', 'icon' => 'trending-up'],
            ['name' => 'Food, Civil Supplies & Consumer Affairs', 'code' => 'FCS', 'description' => 'Food and Consumer Affairs Department', 'icon' => 'shopping-cart'],

            // Tourism & Minority
            ['name' => 'Tourism', 'code' => 'TOUR', 'description' => 'Tourism Department', 'icon' => 'map-pin'],
            ['name' => 'Minority Affairs', 'code' => 'MINA', 'description' => 'Minority Affairs Department', 'icon' => 'user']
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(
                ['code' => $dept['code']],
                array_merge($dept, ['is_active' => true])
            );
        }
    }
}
