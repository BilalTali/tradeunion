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
            ['name' => 'General Administration', 'code' => 'GAD', 'description' => 'General Administration Department', 'icon' => 'settings', 'posting_label' => 'Office/Department'],
            ['name' => 'Home', 'code' => 'HOME', 'description' => 'Home Department', 'icon' => 'shield', 'posting_label' => 'Office/Division'],
            ['name' => 'Revenue', 'code' => 'REV', 'description' => 'Revenue Department', 'icon' => 'file-text', 'posting_label' => 'Tehsil/Office'],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Finance Department', 'icon' => 'dollar-sign', 'posting_label' => 'Treasury/Office'],
            ['name' => 'Law, Justice & Parliamentary Affairs', 'code' => 'LAW', 'description' => 'Law and Justice Department', 'icon' => 'scale', 'posting_label' => 'Court/Office'],
            ['name' => 'Planning, Development & Monitoring', 'code' => 'PDM', 'description' => 'Planning and Development Department', 'icon' => 'bar-chart', 'posting_label' => 'Office/Division'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Information Technology Department', 'icon' => 'cpu', 'posting_label' => 'Office/Center'],

            // Education & Health
            ['name' => 'School Education', 'code' => 'SE', 'description' => 'Department of School Education', 'icon' => 'school', 'posting_label' => 'School'],
            ['name' => 'Higher Education', 'code' => 'HE', 'description' => 'Department of Higher Education', 'icon' => 'book', 'posting_label' => 'College/University'],
            ['name' => 'Health & Medical Education', 'code' => 'HME', 'description' => 'Health and Medical Education Department', 'icon' => 'heart', 'posting_label' => 'Hospital/Health Center'],

            // Social Welfare
            ['name' => 'Social Welfare', 'code' => 'SW', 'description' => 'Social Welfare Department', 'icon' => 'users', 'posting_label' => 'Office/Center'],
            ['name' => 'Tribal Affairs', 'code' => 'TA', 'description' => 'Tribal Affairs Department', 'icon' => 'user-check', 'posting_label' => 'Office/Division'],
            ['name' => 'Youth Services & Sports', 'code' => 'YSS', 'description' => 'Youth Services and Sports Department', 'icon' => 'activity', 'posting_label' => 'Stadium/Office'],
            ['name' => 'Culture', 'code' => 'CUL', 'description' => 'Culture Department', 'icon' => 'music', 'posting_label' => 'Cultural Center/Office'],
            ['name' => 'Information & Public Relations', 'code' => 'IPR', 'description' => 'Information and Public Relations Department', 'icon' => 'mic', 'posting_label' => 'Office/Bureau'],

            // Agriculture & Rural
            ['name' => 'Agriculture Production', 'code' => 'AGR', 'description' => 'Agriculture Production Department', 'icon' => 'leaf', 'posting_label' => 'Office/Division'],
            ['name' => 'Horticulture', 'code' => 'HORT', 'description' => 'Horticulture Department', 'icon' => 'sun', 'posting_label' => 'Office/Division'],
            ['name' => 'Animal & Sheep Husbandry', 'code' => 'ASH', 'description' => 'Animal and Sheep Husbandry Department', 'icon' => 'gitlab', 'posting_label' => 'Office/Veterinary Center'],
            ['name' => 'Fisheries', 'code' => 'FISH', 'description' => 'Fisheries Department', 'icon' => 'anchor', 'posting_label' => 'Office/Division'],
            ['name' => 'Rural Development', 'code' => 'RD', 'description' => 'Rural Development Department', 'icon' => 'home', 'posting_label' => 'Block/Office'],
            ['name' => 'Panchayati Raj', 'code' => 'PR', 'description' => 'Panchayati Raj Department', 'icon' => 'map', 'posting_label' => 'Panchayat/Office'],
            ['name' => 'Cooperation', 'code' => 'COOP', 'description' => 'Cooperation Department', 'icon' => 'share-2', 'posting_label' => 'Office/Society'],

            // Infrastructure
            ['name' => 'Public Works (R&B)', 'code' => 'PWD', 'description' => 'Public Works Department', 'icon' => 'tool', 'posting_label' => 'Division/Office'],
            ['name' => 'Jal Shakti', 'code' => 'JS', 'description' => 'Jal Shakti / PHE Department', 'icon' => 'droplet', 'posting_label' => 'PHE Division/Office'],
            ['name' => 'Power Development', 'code' => 'PDD', 'description' => 'Power Development Department', 'icon' => 'zap', 'posting_label' => 'Sub-Station/Office'],
            ['name' => 'Housing & Urban Development', 'code' => 'HUD', 'description' => 'Housing and Urban Development Department', 'icon' => 'building', 'posting_label' => 'Office/Division'],
            ['name' => 'Transport', 'code' => 'TRN', 'description' => 'Transport Department', 'icon' => 'truck', 'posting_label' => 'Office/Check Post'],
            ['name' => 'Industries & Commerce', 'code' => 'IC', 'description' => 'Industries and Commerce Department', 'icon' => 'briefcase', 'posting_label' => 'Office/Division'],
            ['name' => 'Mining', 'code' => 'MIN', 'description' => 'Mining Department', 'icon' => 'layers', 'posting_label' => 'Office/Division'],

            // Environment & Disaster
            ['name' => 'Forest, Ecology & Environment', 'code' => 'FEE', 'description' => 'Forest and Environment Department', 'icon' => 'tree', 'posting_label' => 'Forest Range/Office'],
            ['name' => 'Wildlife Protection', 'code' => 'WLP', 'description' => 'Wildlife Protection Department', 'icon' => 'feather', 'posting_label' => 'Wildlife Division/Office'],
            ['name' => 'Disaster Management', 'code' => 'DMRR', 'description' => 'Disaster Management and Relief Department', 'icon' => 'alert-triangle', 'posting_label' => 'Office/Control Room'],
            ['name' => 'Science & Technology', 'code' => 'SNT', 'description' => 'Science and Technology Department', 'icon' => 'atom', 'posting_label' => 'Office/Center'],

            // Security & Justice
            ['name' => 'Police', 'code' => 'POL', 'description' => 'Jammu and Kashmir Police', 'icon' => 'shield-check', 'posting_label' => 'Police Station/Post'],
            ['name' => 'Prisons', 'code' => 'PRS', 'description' => 'Prisons Department', 'icon' => 'lock', 'posting_label' => 'Jail/Office'],
            ['name' => 'Fire & Emergency Services', 'code' => 'FES', 'description' => 'Fire and Emergency Services', 'icon' => 'alert-circle', 'posting_label' => 'Fire Station/Office'],
            ['name' => 'Prosecution', 'code' => 'PROS', 'description' => 'Prosecution Department', 'icon' => 'file', 'posting_label' => 'Office/Court'],

            // Employment & Consumer
            ['name' => 'Labour & Employment', 'code' => 'LE', 'description' => 'Labour and Employment Department', 'icon' => 'briefcase', 'posting_label' => 'Office/Exchange'],
            ['name' => 'Skill Development', 'code' => 'SD', 'description' => 'Skill Development Department', 'icon' => 'trending-up', 'posting_label' => 'Training Center/Office'],
            ['name' => 'Food, Civil Supplies & Consumer Affairs', 'code' => 'FCS', 'description' => 'Food and Consumer Affairs Department', 'icon' => 'shopping-cart', 'posting_label' => 'Office/Depot'],

            // Tourism & Minority
            ['name' => 'Tourism', 'code' => 'TOUR', 'description' => 'Tourism Department', 'icon' => 'map-pin', 'posting_label' => 'Office/Tourist Center'],
            ['name' => 'Minority Affairs', 'code' => 'MINA', 'description' => 'Minority Affairs Department', 'icon' => 'user', 'posting_label' => 'Office/Division']
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(
                ['code' => $dept['code']],
                array_merge($dept, ['is_active' => true])
            );
        }
    }
}
