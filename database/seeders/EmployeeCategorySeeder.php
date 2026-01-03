<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeCategory;

class EmployeeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'code' => 'REG',
                'name' => 'Regular / Permanent',
                'description' => 'Regular permanent government employees with full job security and benefits',
            ],
            [
                'code' => 'TEMP',
                'name' => 'Temporary',
                'description' => 'Temporary employees on fixed-term contracts',
            ],
            [
                'code' => 'ADH',
                'name' => 'Adhoc',
                'description' => 'Adhoc employees appointed for specific temporary assignments',
            ],
            [
                'code' => 'DRW',
                'name' => 'Daily Rated / Casual',
                'description' => 'Daily wage workers and casual laborers',
            ],
            [
                'code' => 'WC',
                'name' => 'Work Charged',
                'description' => 'Work charged employees engaged for specific projects or works',
            ],
            [
                'code' => 'CONT',
                'name' => 'Contractual',
                'description' => 'Contractual employees hired through formal contracts',
            ],
            [
                'code' => 'CONS',
                'name' => 'Consolidated Pay',
                'description' => 'Employees on consolidated monthly payment',
            ],
            [
                'code' => 'SCH',
                'name' => 'Scheme Based',
                'description' => 'Employees under specific government schemes (MDM, PM-POSHAN, NHM, etc.)',
            ],
            [
                'code' => 'SEAS',
                'name' => 'Seasonal',
                'description' => 'Seasonal workers employed during specific seasons',
            ],
            [
                'code' => 'HON',
                'name' => 'Honorarium',
                'description' => 'Workers paid honorarium (Anganwadi, ASHA, Aaya, CPW, etc.)',
            ],
            [
                'code' => 'DEP',
                'name' => 'Deputation',
                'description' => 'Officers and staff on deputation from other departments',
            ],
            [
                'code' => 'OUT',
                'name' => 'Outsourced',
                'description' => 'Outsourced staff through agencies (security, housekeeping, IT support, etc.)',
            ],
        ];

        foreach ($categories as $category) {
            EmployeeCategory::updateOrCreate(
                ['code' => $category['code']],
                array_merge($category, ['is_active' => true])
            );
        }
    }
}
