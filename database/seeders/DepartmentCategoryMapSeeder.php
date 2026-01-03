<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\EmployeeCategory;
use Illuminate\Support\Facades\DB;

class DepartmentCategoryMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing mappings to avoid duplicates
        DB::table('department_category_map')->truncate();

        $mappings = $this->getDepartmentCategoryMappings();

        foreach ($mappings as $deptCode => $categoryCodes) {
            $department = Department::where('code', $deptCode)->first();
            if (!$department) continue;

            foreach ($categoryCodes as $catCode) {
                $category = EmployeeCategory::where('code', $catCode)->first();
                if (!$category) continue;

                DB::table('department_category_map')->updateOrInsert(
                    [
                        'department_id' => $department->id,
                        'employee_category_id' => $category->id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }

    private function getDepartmentCategoryMappings(): array
    {
        return [
            // Education Departments
            'SE' => ['REG', 'TEMP', 'ADH', 'CONT', 'SCH', 'HON'], // School Education
            'HE' => ['REG', 'TEMP', 'ADH', 'CONT'], // Higher Education

            // Health Department
            'HME' => ['REG', 'TEMP', 'ADH', 'CONT', 'SCH', 'OUT'], // Health & Medical Education (includes NHM scheme)

            // Administration Departments
            'GAD' => ['REG', 'TEMP', 'CONT', 'CONS', 'DEP'], // General Administration
            'HOME' => ['REG', 'TEMP', 'CONT', 'DEP'], // Home
            'REV' => ['REG', 'TEMP', 'CONT'], // Revenue
            'FIN' => ['REG', 'TEMP', 'CONT', 'CONS'], // Finance
            'LAW' => ['REG', 'TEMP', 'CONT', 'DEP'], // Law & Justice
            'PDM' => ['REG', 'TEMP', 'CONT', 'CONS'], // Planning & Development
            'IT' => ['REG', 'TEMP', 'CONT', 'OUT'], // Information Technology

            // Social Welfare
            'SW' => ['REG', 'TEMP', 'SCH', 'HON'], // Social Welfare (includes Anganwadi)
            'TA' => ['REG', 'TEMP', 'CONT'], // Tribal Affairs
            'YSS' => ['REG', 'TEMP', 'CONT', 'HON'], // Youth Services & Sports
            'CUL' => ['REG', 'TEMP', 'CONT'], // Culture
            'IPR' => ['REG', 'TEMP', 'CONT'], // Information & Public Relations

            // Agriculture & Rural
            'AGR' => ['REG', 'TEMP', 'DRW', 'SEAS'], // Agriculture
            'HORT' => ['REG', 'TEMP', 'DRW', 'SEAS'], // Horticulture
            'ASH' => ['REG', 'TEMP', 'DRW'], // Animal & Sheep Husbandry
            'FISH' => ['REG', 'TEMP', 'DRW'], // Fisheries
            'RD' => ['REG', 'TEMP', 'CONT'], // Rural Development
            'PR' => ['REG', 'TEMP', 'CONT'], // Panchayati Raj
            'COOP' => ['REG', 'TEMP', 'CONT'], // Cooperation

            // Infrastructure Departments
            'PWD' => ['REG', 'TEMP', 'WC', 'DRW', 'CONT'], // Public Works
            'JS' => ['REG', 'TEMP', 'WC', 'DRW', 'CONT'], // Jal Shakti / PHE
            'PDD' => ['REG', 'TEMP', 'WC', 'CONT'], // Power Development
            'HUD' => ['REG', 'TEMP', 'CONT'], // Housing & Urban Development
            'TRN' => ['REG', 'TEMP', 'CONT', 'OUT'], // Transport
            'IC' => ['REG', 'TEMP', 'CONT'], // Industries & Commerce
            'MIN' => ['REG', 'TEMP', 'DRW', 'WC'], // Mining

            // Environment & Disaster
            'FEE' => ['REG', 'TEMP', 'DRW', 'SEAS'], // Forest, Ecology & Environment
            'WLP' => ['REG', 'TEMP', 'CONT'], // Wildlife Protection
            'DMRR' => ['REG', 'TEMP', 'CONT', 'SEAS'], // Disaster Management
            'SNT' => ['REG', 'TEMP', 'CONT'], // Science & Technology

            // Security & Justice
            'POL' => ['REG', 'TEMP', 'DEP'], // Police
            'PRS' => ['REG', 'TEMP'], // Prisons
            'FES' => ['REG', 'TEMP', 'CONT', 'OUT'], // Fire & Emergency Services
            'PROS' => ['REG', 'TEMP', 'CONT'], // Prosecution

            // Employment & Consumer
            'LE' => ['REG', 'TEMP', 'CONT'], // Labour & Employment
            'SD' => ['REG', 'TEMP', 'CONT'], // Skill Development
            'FCS' => ['REG', 'TEMP', 'DRW'], // Food, Civil Supplies & Consumer Affairs

            // Tourism & Minority
            'TOUR' => ['REG', 'TEMP', 'CONT', 'SEAS'], // Tourism
            'MINA' => ['REG', 'TEMP', 'CONT'], // Minority Affairs
        ];
    }
}
