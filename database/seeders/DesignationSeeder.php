<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $designations = $this->getAllDesignations();

        foreach ($designations as $designation) {
            Designation::updateOrCreate(
                ['name' => $designation['name']],
                array_merge($designation, ['is_active' => true])
            );
        }
    }

    private function getAllDesignations(): array
    {
        return array_merge(
            $this->getEducationDesignations(),
            $this->getHealthDesignations(),
            $this->getAdministrationDesignations(),
            $this->getFieldSupportDesignations(),
            $this->getTemporaryDesignations(),
            $this->getAdhocDesignations(),
            $this->getDailyRatedDesignations(),
            $this->getWorkChargedDesignations(),
            $this->getContractualDesignations(),
            $this->getConsolidatedPayDesignations(),
            $this->getSchemeBasedDesignations(),
            $this->getSeasonalDesignations(),
            $this->getHonorariumDesignations(),
            $this->getDeputationDesignations(),
            $this->getOutsourcedDesignations()
        );
    }

    private function getEducationDesignations(): array
    {
        return [
            ['name' => 'Teacher (Primary)', 'short_code' => 'TPRI', 'description' => 'Primary school teacher'],
            ['name' => 'Teacher (Middle)', 'short_code' => 'TMID', 'description' => 'Middle school teacher'],
            ['name' => 'Teacher (High School)', 'short_code' => 'THS', 'description' => 'High school teacher'],
            ['name' => 'Lecturer', 'short_code' => 'LEC', 'description' => 'College/Higher education lecturer'],
            ['name' => 'Headmaster', 'short_code' => 'HM', 'description' => 'School headmaster'],
            ['name' => 'Principal', 'short_code' => 'PRIN', 'description' => 'College/School principal'],
            ['name' => 'Zonal Education Officer', 'short_code' => 'ZEO', 'description' => 'Zonal education officer'],
            ['name' => 'Deputy CEO', 'short_code' => 'DCEO', 'description' => 'Deputy Chief Education Officer'],
            ['name' => 'Chief Education Officer', 'short_code' => 'CEO', 'description' => 'Chief Education Officer'],
            ['name' => 'Librarian', 'short_code' => 'LIB', 'description' => 'School/College librarian'],
            ['name' => 'Lab Assistant', 'short_code' => 'LABAST', 'description' => 'Laboratory assistant'],
        ];
    }

    private function getHealthDesignations(): array
    {
        return [
            ['name' => 'Medical Officer', 'short_code' => 'MO', 'description' => 'Medical officer'],
            ['name' => 'Dental Surgeon', 'short_code' => 'DS', 'description' => 'Dental surgeon'],
            ['name' => 'Specialist Doctor', 'short_code' => 'SPEC', 'description' => 'Specialist doctor'],
            ['name' => 'Staff Nurse', 'short_code' => 'SN', 'description' => 'Staff nurse'],
            ['name' => 'Pharmacist', 'short_code' => 'PHAR', 'description' => 'Pharmacist'],
            ['name' => 'Lab Technician', 'short_code' => 'LABTECH', 'description' => 'Laboratory technician'],
            ['name' => 'X-Ray Technician', 'short_code' => 'XRAY', 'description' => 'X-ray technician'],
            ['name' => 'Nursing Superintendent', 'short_code' => 'NSUP', 'description' => 'Nursing superintendent'],
        ];
    }

    private function getAdministrationDesignations(): array
    {
        return [
            ['name' => 'Junior Assistant', 'short_code' => 'JA', 'description' => 'Junior administrative assistant'],
            ['name' => 'Senior Assistant', 'short_code' => 'SA', 'description' => 'Senior administrative assistant'],
            ['name' => 'Section Officer', 'short_code' => 'SO', 'description' => 'Section officer'],
            ['name' => 'Under Secretary', 'short_code' => 'US', 'description' => 'Under secretary'],
            ['name' => 'Deputy Secretary', 'short_code' => 'DS', 'description' => 'Deputy secretary'],
            ['name' => 'Director', 'short_code' => 'DIR', 'description' => 'Director'],
            ['name' => 'Deputy Director', 'short_code' => 'DD', 'description' => 'Deputy director'],
        ];
    }

    private function getFieldSupportDesignations(): array
    {
        return [
            ['name' => 'Peon', 'short_code' => 'PEON', 'description' => 'Office peon'],
            ['name' => 'Chowkidar', 'short_code' => 'CHK', 'description' => 'Watchman/Security guard'],
            ['name' => 'Orderly', 'short_code' => 'ORD', 'description' => 'Orderly'],
            ['name' => 'Mali', 'short_code' => 'MALI', 'description' => 'Gardener'],
            ['name' => 'Driver', 'short_code' => 'DRV', 'description' => 'Driver'],
        ];
    }

    private function getTemporaryDesignations(): array
    {
        return [
            ['name' => 'Temporary Teacher', 'short_code' => 'TTCH', 'description' => 'Temporary teacher'],
            ['name' => 'Temporary Lecturer', 'short_code' => 'TLEC', 'description' => 'Temporary lecturer'],
            ['name' => 'Temporary Clerk', 'short_code' => 'TCLK', 'description' => 'Temporary clerk'],
            ['name' => 'Temporary Staff Nurse', 'short_code' => 'TSN', 'description' => 'Temporary staff nurse'],
            ['name' => 'Temporary Pharmacist', 'short_code' => 'TPHR', 'description' => 'Temporary pharmacist'],
            ['name' => 'Temporary Junior Engineer', 'short_code' => 'TJE', 'description' => 'Temporary junior engineer'],
            ['name' => 'Temporary Driver', 'short_code' => 'TDRV', 'description' => 'Temporary driver'],
            ['name' => 'Temporary Lab Assistant', 'short_code' => 'TLAB', 'description' => 'Temporary lab assistant'],
        ];
    }

    private function getAdhocDesignations(): array
    {
        return [
            ['name' => 'Adhoc Teacher', 'short_code' => 'ATCH', 'description' => 'Adhoc teacher'],
            ['name' => 'Adhoc Lecturer', 'short_code' => 'ALEC', 'description' => 'Adhoc lecturer'],
            ['name' => 'Adhoc Medical Officer', 'short_code' => 'AMO', 'description' => 'Adhoc medical officer'],
            ['name' => 'Adhoc Staff Nurse', 'short_code' => 'ASN', 'description' => 'Adhoc staff nurse'],
            ['name' => 'Adhoc Junior Engineer', 'short_code' => 'AJE', 'description' => 'Adhoc junior engineer'],
            ['name' => 'Adhoc Clerk', 'short_code' => 'ACLK', 'description' => 'Adhoc clerk'],
            ['name' => 'Adhoc Accounts Assistant', 'short_code' => 'AACC', 'description' => 'Adhoc accounts assistant'],
        ];
    }

    private function getDailyRatedDesignations(): array
    {
        return [
            ['name' => 'Daily Rated Worker (DRW)', 'short_code' => 'DRW', 'description' => 'Daily rated worker'],
            ['name' => 'Casual Labour', 'short_code' => 'CLAB', 'description' => 'Casual labourer'],
            ['name' => 'Casual Helper', 'short_code' => 'CHELP', 'description' => 'Casual helper'],
            ['name' => 'Casual Mate', 'short_code' => 'CMATE', 'description' => 'Casual mate'],
            ['name' => 'Casual Fitter', 'short_code' => 'CFIT', 'description' => 'Casual fitter'],
            ['name' => 'Casual Electrician', 'short_code' => 'CELEC', 'description' => 'Casual electrician'],
            ['name' => 'Casual Plumber', 'short_code' => 'CPLMB', 'description' => 'Casual plumber'],
            ['name' => 'Casual Peon', 'short_code' => 'CPEON', 'description' => 'Casual peon'],
            ['name' => 'Casual Chowkidar', 'short_code' => 'CCHK', 'description' => 'Casual chowkidar'],
            ['name' => 'Casual Mali', 'short_code' => 'CMALI', 'description' => 'Casual mali/gardener'],
            ['name' => 'Casual Sweeper', 'short_code' => 'CSWP', 'description' => 'Casual sweeper'],
            ['name' => 'Casual Watchman', 'short_code' => 'CWAT', 'description' => 'Casual watchman'],
        ];
    }

    private function getWorkChargedDesignations(): array
    {
        return [
            ['name' => 'Work Charged Helper', 'short_code' => 'WCHLP', 'description' => 'Work charged helper'],
            ['name' => 'Work Charged Mate', 'short_code' => 'WCMT', 'description' => 'Work charged mate'],
            ['name' => 'Work Charged Electrician', 'short_code' => 'WCELC', 'description' => 'Work charged electrician'],
            ['name' => 'Work Charged Fitter', 'short_code' => 'WCFIT', 'description' => 'Work charged fitter'],
            ['name' => 'Work Charged Lineman', 'short_code' => 'WCLN', 'description' => 'Work charged lineman'],
            ['name' => 'Work Charged Pump Operator', 'short_code' => 'WCPOP', 'description' => 'Work charged pump operator'],
            ['name' => 'Work Charged Khalasi', 'short_code' => 'WCKHL', 'description' => 'Work charged khalasi'],
            ['name' => 'Work Charged Driver', 'short_code' => 'WCDRV', 'description' => 'Work charged driver'],
            ['name' => 'Work Charged Chowkidar', 'short_code' => 'WCCHK', 'description' => 'Work charged chowkidar'],
        ];
    }

    private function getContractualDesignations(): array
    {
        return [
            ['name' => 'Contract Teacher', 'short_code' => 'CTCH', 'description' => 'Contract teacher'],
            ['name' => 'Contract Lecturer', 'short_code' => 'CLEC', 'description' => 'Contract lecturer'],
            ['name' => 'Academic Consultant', 'short_code' => 'ACON', 'description' => 'Academic consultant'],
            ['name' => 'MIS Coordinator', 'short_code' => 'MISC', 'description' => 'MIS coordinator'],
            ['name' => 'Block Education Coordinator', 'short_code' => 'BEC', 'description' => 'Block education coordinator'],
            ['name' => 'Contract Medical Officer', 'short_code' => 'CMO', 'description' => 'Contract medical officer'],
            ['name' => 'Contract Staff Nurse', 'short_code' => 'CSN', 'description' => 'Contract staff nurse'],
            ['name' => 'Contract Pharmacist', 'short_code' => 'CPHR', 'description' => 'Contract pharmacist'],
            ['name' => 'Contract Lab Technician', 'short_code' => 'CLT', 'description' => 'Contract lab technician'],
            ['name' => 'Contract Data Entry Operator', 'short_code' => 'CDEO', 'description' => 'Contract DEO'],
            ['name' => 'Contract Programmer', 'short_code' => 'CPROG', 'description' => 'Contract programmer'],
            ['name' => 'Contract System Analyst', 'short_code' => 'CSA', 'description' => 'Contract system analyst'],
            ['name' => 'Contract Office Assistant', 'short_code' => 'COA', 'description' => 'Contract office assistant'],
        ];
    }

    private function getConsolidatedPayDesignations(): array
    {
        return [
            ['name' => 'Consolidated Pay Teacher', 'short_code' => 'CPTCH', 'description' => 'Consolidated pay teacher'],
            ['name' => 'Consolidated Pay Clerk', 'short_code' => 'CPCLK', 'description' => 'Consolidated pay clerk'],
            ['name' => 'Consolidated Pay Office Assistant', 'short_code' => 'CPOA', 'description' => 'Consolidated pay office assistant'],
            ['name' => 'Consolidated Pay Accountant', 'short_code' => 'CPACC', 'description' => 'Consolidated pay accountant'],
            ['name' => 'Consolidated Pay DEO', 'short_code' => 'CPDEO', 'description' => 'Consolidated pay data entry operator'],
            ['name' => 'Consolidated Pay Technician', 'short_code' => 'CPTECH', 'description' => 'Consolidated pay technician'],
        ];
    }

    private function getSchemeBasedDesignations(): array
    {
        return [
            ['name' => 'Cook (MDM / PM-POSHAN)', 'short_code' => 'MDM-COOK', 'description' => 'MDM/PM-POSHAN cook'],
            ['name' => 'Cook-cum-Helper (CPW)', 'short_code' => 'CPW', 'description' => 'Cook-cum-helper'],
            ['name' => 'MDM Helper', 'short_code' => 'MDM-HLP', 'description' => 'MDM helper'],
            ['name' => 'Store Keeper (MDM)', 'short_code' => 'MDM-SK', 'description' => 'MDM store keeper'],
            ['name' => 'MDM Monitor', 'short_code' => 'MDM-MON', 'description' => 'MDM monitor'],
            ['name' => 'School Nutrition Coordinator', 'short_code' => 'SNC', 'description' => 'School nutrition coordinator'],
            ['name' => 'Anganwadi Supervisor', 'short_code' => 'AWS', 'description' => 'Anganwadi supervisor'],
            ['name' => 'Anganwadi Worker (Scheme)', 'short_code' => 'AWW-SCH', 'description' => 'Anganwadi worker under scheme'],
            ['name' => 'Anganwadi Helper', 'short_code' => 'AWH', 'description' => 'Anganwadi helper'],
            ['name' => 'Mini Anganwadi Worker', 'short_code' => 'MAWW', 'description' => 'Mini anganwadi worker'],
            ['name' => 'NHM Medical Officer', 'short_code' => 'NHM-MO', 'description' => 'NHM medical officer'],
            ['name' => 'NHM Nurse', 'short_code' => 'NHM-N', 'description' => 'NHM nurse'],
            ['name' => 'ANM (NHM)', 'short_code' => 'ANM', 'description' => 'Auxiliary nurse midwife'],
            ['name' => 'Block Programme Manager', 'short_code' => 'BPM', 'description' => 'Block programme manager'],
            ['name' => 'District Programme Manager', 'short_code' => 'DPM', 'description' => 'District programme manager'],
        ];
    }

    private function getSeasonalDesignations(): array
    {
        return [
            ['name' => 'Seasonal Labourer', 'short_code' => 'SLAB', 'description' => 'Seasonal labourer'],
            ['name' => 'Snow Clearance Worker', 'short_code' => 'SCW', 'description' => 'Snow clearance worker'],
            ['name' => 'Flood Relief Worker', 'short_code' => 'FRW', 'description' => 'Flood relief worker'],
            ['name' => 'Seasonal Chowkidar', 'short_code' => 'SCHK', 'description' => 'Seasonal chowkidar'],
            ['name' => 'Horticulture Seasonal Worker', 'short_code' => 'HSW', 'description' => 'Horticulture seasonal worker'],
            ['name' => 'Tourism Seasonal Guide', 'short_code' => 'TSG', 'description' => 'Tourism seasonal guide'],
        ];
    }

    private function getHonorariumDesignations(): array
    {
        return [
            ['name' => 'Anganwadi Worker', 'short_code' => 'AWW', 'description' => 'Anganwadi worker'],
            ['name' => 'Anganwadi Helper', 'short_code' => 'AWH', 'description' => 'Anganwadi helper'],
            ['name' => 'ASHA Worker', 'short_code' => 'ASHA', 'description' => 'ASHA worker'],
            ['name' => 'ASHA Facilitator', 'short_code' => 'ASHAF', 'description' => 'ASHA facilitator'],
            ['name' => 'Community Health Volunteer', 'short_code' => 'CHV', 'description' => 'Community health volunteer'],
            ['name' => 'Aaya (School Aaya)', 'short_code' => 'AAYA', 'description' => 'School aaya/helper'],
            ['name' => 'Part-Time Sweeper', 'short_code' => 'PTSWP', 'description' => 'Part-time sweeper'],
            ['name' => 'Part-Time Watchman', 'short_code' => 'PTWAT', 'description' => 'Part-time watchman'],
            ['name' => 'Part-Time Peon', 'short_code' => 'PTPEON', 'description' => 'Part-time peon'],
            ['name' => 'CPW (Honorarium based)', 'short_code' => 'CPW-HON', 'description' => 'Cook-cum-helper on honorarium'],
        ];
    }

    private function getDeputationDesignations(): array
    {
        return [
            ['name' => 'Officer on Deputation', 'short_code' => 'OD', 'description' => 'Officer on deputation'],
            ['name' => 'Teacher on Deputation', 'short_code' => 'TD', 'description' => 'Teacher on deputation'],
            ['name' => 'Engineer on Deputation', 'short_code' => 'ED', 'description' => 'Engineer on deputation'],
            ['name' => 'Medical Officer on Deputation', 'short_code' => 'MOD', 'description' => 'Medical officer on deputation'],
            ['name' => 'Administrative Officer on Deputation', 'short_code' => 'AOD', 'description' => 'Administrative officer on deputation'],
            ['name' => 'Police Officer on Deputation', 'short_code' => 'POD', 'description' => 'Police officer on deputation'],
        ];
    }

    private function getOutsourcedDesignations(): array
    {
        return [
            ['name' => 'Security Guard', 'short_code' => 'SG', 'description' => 'Outsourced security guard'],
            ['name' => 'Housekeeping Staff', 'short_code' => 'HK', 'description' => 'Outsourced housekeeping staff'],
            ['name' => 'Sweeper (Outsourced)', 'short_code' => 'OSWP', 'description' => 'Outsourced sweeper'],
            ['name' => 'Driver (Outsourced)', 'short_code' => 'ODRV', 'description' => 'Outsourced driver'],
            ['name' => 'Office Attendant', 'short_code' => 'OATT', 'description' => 'Outsourced office attendant'],
            ['name' => 'IT Support Engineer', 'short_code' => 'ITSE', 'description' => 'Outsourced IT support engineer'],
            ['name' => 'Hardware Technician', 'short_code' => 'HWTECH', 'description' => 'Outsourced hardware technician'],
            ['name' => 'Network Support Staff', 'short_code' => 'NSS', 'description' => 'Outsourced network support staff'],
            ['name' => 'Call Centre Operator', 'short_code' => 'CCO', 'description' => 'Outsourced call centre operator'],
        ];
    }
}
