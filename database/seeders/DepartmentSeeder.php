<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'School Education',
                'code' => 'SE',
                'description' => 'Department of School Education',
                'icon' => 'school',
                'is_active' => true
            ],
            [
                'name' => 'Higher Education',
                'code' => 'HE',
                'description' => 'Department of Higher Education',
                'icon' => 'graduation-cap',
                'is_active' => true
            ],
            [
                'name' => 'Youth Services & Sports',
                'code' => 'YSS',
                'description' => 'Department of Youth Services and Sports',
                'icon' => 'trophy',
                'is_active' => true
            ],
            [
                'name' => 'Technical Education',
                'code' => 'TE',
                'description' => 'Department of Technical Education',
                'icon' => 'cog',
                'is_active' => true
            ],
            [
                'name' => 'Early Childhood Education',
                'code' => 'ECE',
                'description' => 'Department of Early Childhood Education',
                'icon' => 'child',
                'is_active' => true
            ],
            [
                'name' => 'Adult & Continuing Education',
                'code' => 'ACE',
                'description' => 'Department of Adult and Continuing Education',
                'icon' => 'book-reader',
                'is_active' => true
            ],
            [
                'name' => 'Special Education',
                'code' => 'SPED',
                'description' => 'Department of Special Education',
                'icon' => 'hands-helping',
                'is_active' => true
            ],
            [
                'name' => 'Research & Development',
                'code' => 'RD',
                'description' => 'Research and Development in Education',
                'icon' => 'flask',
                'is_active' => true
            ],
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::updateOrCreate(
                ['name' => $dept['name']],
                $dept
            );
        }
    }
}
