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
            ['name' => 'School Education', 'code' => 'SE', 'description' => 'Department of School Education'],
            ['name' => 'Higher Education', 'code' => 'HE', 'description' => 'Department of Higher Education'],
            ['name' => 'Youth Services & Sports', 'code' => 'YSS', 'description' => 'Department of Youth Services and Sports'],
            ['name' => 'Technical Education', 'code' => 'TE', 'description' => 'Department of Technical Education'],
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::updateOrCreate(
                ['name' => $dept['name']],
                $dept
            );
        }
    }
}
