<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeCategory;
use App\Models\Designation;
use Illuminate\Support\Facades\DB;

class CategoryDesignationMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing mappings
        DB::table('category_designation_map')->truncate();

        $mappings = $this->getCategoryDesignationMappings();

        foreach ($mappings as $catCode => $designationNames) {
            $category = EmployeeCategory::where('code', $catCode)->first();
            if (!$category) continue;

            foreach ($designationNames as $desigName) {
                $designation = Designation::where('name', $desigName)->first();
                if (!$designation) continue;

                DB::table('category_designation_map')->updateOrInsert(
                    [
                        'employee_category_id' => $category->id,
                        'designation_id' => $designation->id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }

    private function getCategoryDesignationMappings(): array
    {
        return [
            // REG - Regular / Permanent
            'REG' => [
                // Education
                'Teacher (Primary)', 'Teacher (Middle)', 'Teacher (High School)',
                'Lecturer', 'Headmaster', 'Principal',
                'Zonal Education Officer', 'Deputy CEO', 'Chief Education Officer',
                'Librarian', 'Lab Assistant',
                // Health
                'Medical Officer', 'Dental Surgeon', 'Specialist Doctor',
                'Staff Nurse', 'Pharmacist', 'Lab Technician',
                'X-Ray Technician', 'Nursing Superintendent',
                // Administration
                'Junior Assistant', 'Senior Assistant', 'Section Officer',
                'Under Secretary', 'Deputy Secretary', 'Director', 'Deputy Director',
                // Field Support
                'Peon', 'Chowkidar', 'Orderly', 'Mali', 'Driver',
            ],

            // TEMP - Temporary
            'TEMP' => [
                'Temporary Teacher', 'Temporary Lecturer', 'Temporary Clerk',
                'Temporary Staff Nurse', 'Temporary Pharmacist',
                'Temporary Junior Engineer', 'Temporary Driver', 'Temporary Lab Assistant',
            ],

            // ADH - Adhoc
            'ADH' => [
                'Adhoc Teacher', 'Adhoc Lecturer', 'Adhoc Medical Officer',
                'Adhoc Staff Nurse', 'Adhoc Junior Engineer',
                'Adhoc Clerk', 'Adhoc Accounts Assistant',
            ],

            // DRW - Daily Rated / Casual
            'DRW' => [
                'Daily Rated Worker (DRW)', 'Casual Labour', 'Casual Helper',
                'Casual Mate', 'Casual Fitter', 'Casual Electrician',
                'Casual Plumber', 'Casual Peon', 'Casual Chowkidar',
                'Casual Mali', 'Casual Sweeper', 'Casual Watchman',
            ],

            // WC - Work Charged
            'WC' => [
                'Work Charged Helper', 'Work Charged Mate', 'Work Charged Electrician',
                'Work Charged Fitter', 'Work Charged Lineman', 'Work Charged Pump Operator',
                'Work Charged Khalasi', 'Work Charged Driver', 'Work Charged Chowkidar',
            ],

            // CONT - Contractual
            'CONT' => [
                'Contract Teacher', 'Contract Lecturer', 'Academic Consultant',
                'MIS Coordinator', 'Block Education Coordinator',
                'Contract Medical Officer', 'Contract Staff Nurse', 'Contract Pharmacist',
                'Contract Lab Technician', 'Contract Data Entry Operator',
                'Contract Programmer', 'Contract System Analyst', 'Contract Office Assistant',
            ],

            // CONS - Consolidated Pay
            'CONS' => [
                'Consolidated Pay Teacher', 'Consolidated Pay Clerk',
                'Consolidated Pay Office Assistant', 'Consolidated Pay Accountant',
                'Consolidated Pay DEO', 'Consolidated Pay Technician',
            ],

            // SCH - Scheme Based
            'SCH' => [
                'Cook (MDM / PM-POSHAN)', 'Cook-cum-Helper (CPW)', 'MDM Helper',
                'Store Keeper (MDM)', 'MDM Monitor', 'School Nutrition Coordinator',
                'Anganwadi Supervisor', 'Anganwadi Worker (Scheme)',
                'Anganwadi Helper', 'Mini Anganwadi Worker',
                'NHM Medical Officer', 'NHM Nurse', 'ANM (NHM)',
                'Block Programme Manager', 'District Programme Manager',
            ],

            // SEAS - Seasonal
            'SEAS' => [
                'Seasonal Labourer', 'Snow Clearance Worker', 'Flood Relief Worker',
                'Seasonal Chowkidar', 'Horticulture Seasonal Worker', 'Tourism Seasonal Guide',
            ],

            // HON - Honorarium
            'HON' => [
                'Anganwadi Worker', 'Anganwadi Helper', 'ASHA Worker',
                'ASHA Facilitator', 'Community Health Volunteer',
                'Aaya (School Aaya)', 'Part-Time Sweeper', 'Part-Time Watchman',
                'Part-Time Peon', 'CPW (Honorarium based)',
            ],

            // DEP - Deputation
            'DEP' => [
                'Officer on Deputation', 'Teacher on Deputation', 'Engineer on Deputation',
                'Medical Officer on Deputation', 'Administrative Officer on Deputation',
                'Police Officer on Deputation',
            ],

            // OUT - Outsourced
            'OUT' => [
                'Security Guard', 'Housekeeping Staff', 'Sweeper (Outsourced)',
                'Driver (Outsourced)', 'Office Attendant', 'IT Support Engineer',
                'Hardware Technician', 'Network Support Staff', 'Call Centre Operator',
            ],
        ];
    }
}
