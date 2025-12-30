<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\District;
use App\Models\Tehsil;
use App\Models\State;

class DistrictTehsilSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding districts and tehsils for J&K and Ladakh...');

        // Fetch State IDs
        $jkState = State::where('code', 'JK')->first();
        $ladakhState = State::where('code', 'LD')->first();

        if (!$jkState || !$ladakhState) {
            $this->command->error('States not found! Please run StateSeeder first.');
            return;
        }

        // Jammu & Kashmir - Kashmir Division (10 districts)
        $this->seedKashmirDivision($jkState->id);

        // Jammu & Kashmir - Jammu Division (10 districts)
        $this->seedJammuDivision($jkState->id);

        // Ladakh (2 districts)
        $this->seedLadakh($ladakhState->id);

        $this->command->info('Districts and tehsils seeding completed successfully!');
        $this->command->info('Total: 22 districts seeded');

        // Clear application cache to ensure fresh data is served
        $this->command->info('Clearing application cache...');
        \Illuminate\Support\Facades\Cache::forget('districts:all');
        \Illuminate\Support\Facades\Cache::forget('districts:Jammu and Kashmir');
        \Illuminate\Support\Facades\Cache::forget('districts:Ladakh');
        \Illuminate\Support\Facades\Cache::forget('tehsils:all');
        // Ideally we should clear all tehsil caches, but a full flush is safer here
        $this->command->call('cache:clear');
        $this->command->info('✓ Application cache cleared.');
    }

    /**
     * Seed Kashmir Division districts and tehsils
     */
    private function seedKashmirDivision($stateId): void
    {
        $this->command->info('Seeding Kashmir Division...');

        // 1. Srinagar
        $srinagar = District::updateOrCreate(
            ['code' => 'JK-SRI'],
            ['name' => 'Srinagar', 'state_id' => $stateId]
        );
        $this->createTehsils($srinagar, [
            'BATMALOO','GULAB BAGH','HAWAL','IDDGAH','NISHAT','RAINAWARI','SRINAGAR','ZALDAGAR' 
        ]);

        // 2. Ganderbal
        $ganderbal = District::updateOrCreate(
            ['code' => 'JK-GAN'],
            ['name' => 'Ganderbal', 'state_id' => $stateId]
        );
        $this->createTehsils($ganderbal, [
            'Ganderbal ', 'HARIGANWAN ', 'KANGAN ', 'TULMULLA '
        ]);

        // 3. Budgam
        $budgam = District::updateOrCreate(
            ['code' => 'JK-BUD'],
            ['name' => 'Budgam', 'state_id' => $stateId]
        );
        $this->createTehsils($budgam, [
            'Budgam ', 'Beerwah ', 'Khansahib ','Khag','B K PORA','CHADOORA','CHARAR-I-SHARIF','DREYGAM','HARDUPANZOO','MAGAM','NAGAM','NARBAL','NURBAL','SOIBUGH'
        ]);

        // 4. Anantnag
        $anantnag = District::updateOrCreate(
            ['code' => 'JK-ANA'],
            ['name' => 'Anantnag', 'state_id' => $stateId]
        );
        $this->createTehsils($anantnag, [
            'Anantnag ', 'Bijbehara ','AISHMUQAM','ACHABAL','BIDDER','DORU','MATTAN','QAZIGUND','SHANGAS','SRIGUFWARA','VAILLO','VERINAG'
        ]);

        // 5. Kulgam
        $kulgam = District::updateOrCreate(
            ['code' => 'JK-KUL'],
            ['name' => 'Kulgam', 'state_id' => $stateId]
        );
        $this->createTehsils($kulgam, [
            'Kulgam ', 'DEVSAR ', 'DH PORA ', 'H C GAM ', 'QAIMOH ', 'YARIPORA '
        ]);

        // 6. Pulwama
        $pulwama = District::updateOrCreate(
            ['code' => 'JK-PUL'],
            ['name' => 'Pulwama', 'state_id' => $stateId]
        );
        $this->createTehsils($pulwama, [
            'Pulwama ', 'Pampore ', 'Tral ','AWANTIPORA','KAKPORA','SHADIMARG','TAHAB'
        ]);

        // 7. Shopian
        $shopian = District::updateOrCreate(
            ['code' => 'JK-SHO'],
            ['name' => 'Shopian', 'state_id' => $stateId]
        );
        $this->createTehsils($shopian, [
            'IMAMSHAIB','SHOPIAN','KEEGAM','VEHIL'
        ]);

        // 8. Baramulla
        $baramulla = District::updateOrCreate(
            ['code' => 'JK-BAR'],
            ['name' => 'Baramulla', 'state_id' => $stateId]
        );
        $this->createTehsils($baramulla, [
            'Baramulla ', 'Sopore ', 'Uri ', 'Pattan ','Singhpora Pattan','Wagoora','Dangerpora','Chandoosa','Boniyar','Singhpora Kalan','Nehalpora','Kunze','Tangmarg','Rafiabad','Rohuma','Julla','Dangiwicha','Fatehgarh'
            ]);

        // 9. Bandipora
        $bandipora = District::updateOrCreate(
            ['code' => 'JK-BAN'],
            ['name' => 'Bandipora', 'state_id' => $stateId]
        );
        $this->createTehsils($bandipora, [
            'Bandipora ', 'Sumbal ', 'Gurez ','Hajin ','Quilmuqam'
        ]);

        // 10. Kupwara
        $kupwara = District::updateOrCreate(
            ['code' => 'JK-KUP'],
            ['name' => 'Kupwara', 'state_id' => $stateId]
        );
        $this->createTehsils($kupwara, [
            'Chamkote','Kupwara','Handwara','Tangdar','Kralpora','Trehgam','Khumriyal','Sogam','Drugmullah','Langate','Mawar','Rajwar','Villgam'
        ]);

        $this->command->info('✓ Kashmir Division: 10 districts seeded');
    }

    /**
     * Seed Jammu Division districts and tehsils
     */
    private function seedJammuDivision($stateId): void
    {
        $this->command->info('Seeding Jammu Division...');

        // 1. Jammu
        $jammu = District::updateOrCreate(
            ['code' => 'JK-JAM'],
            ['name' => 'Jammu', 'state_id' => $stateId]
        );
        $this->createTehsils($jammu, [
            'AKHNOOR','ARINA','BHALWAL','BISHNAH','CHOWKI CHOURA','DANSAL','GANDHI NAGAR','JAMMU','JOURIAN','KHOUR','MARH','MIRAN SAHIB','PURMANDAL','RS PORA','SATWARI','VIJAYPUR'
        ]);

        // 2. Samba
        $samba = District::updateOrCreate(
            ['code' => 'JK-SAM'],
            ['name' => 'Samba', 'state_id' => $stateId]
        );
        $this->createTehsils($samba, [
            'GHAGWAL','PURMANDAL','RAMGRAH','SAMBA','VIJAYPUR'
        ]);

        // 3. Kathua
        $kathua = District::updateOrCreate(
            ['code' => 'JK-KAT'],
            ['name' => 'Kathua', 'state_id' => $stateId]
        );
        $this->createTehsils($kathua, [
            'BANI','BARNOTI','BASHOLI','BHADDU','BILLAWAR','HIRANAGAR','KATHUA','LAKHANPUR','MAHANPUR','MARHEEN','SALLAN'
        ]);

        // 4. Udhampur
        $udhampur = District::updateOrCreate(
            ['code' => 'JK-UDH'],
            ['name' => 'Udhampur', 'state_id' => $stateId]
        );
        $this->createTehsils($udhampur, [
            'BABEY','CHENANI','DUDU','GHORDI','JIB','KULWANTA','MAJALTA','PANCHARI','RAMNAGAR','TIKRI','UDHAMPUR'
        ]);

        // 5. Reasi
        $reasi = District::updateOrCreate(
            ['code' => 'JK-REA'],
            ['name' => 'Reasi', 'state_id' => $stateId]
        );
        $this->createTehsils($reasi, [
            'ARNAS','CHASSANA','CHINKAH','MAHORE','POUNI','REASI'
        ]);

        // 6. Rajouri
        $rajouri = District::updateOrCreate(
            ['code' => 'JK-RAJ'],
            ['name' => 'Rajouri', 'state_id' => $stateId]
        );
        $this->createTehsils($rajouri, [
            'BALJARALLAN','DANDSAR','DOONGI BRAHMANA','DRHAL','KALKOTE','KHAWAS','KOTRANKA','LOWER HATHAL','MANJAKOTE','MOGLA','NOWSHERA','PEERI','RAJOURI','SUNDER BANI','THANAMANDI'
        ]);

        // 7. Poonch
        $poonch = District::updateOrCreate(
            ['code' => 'JK-POO'],
            ['name' => 'Poonch', 'state_id' => $stateId]
        );
        $this->createTehsils($poonch, [
            'BAFLIAZ','BALKOTE','HARNI','KUNIYIAN','MANDI','MANKOTE','MENDHAR','NANGALI','POONCH','SATHRA','SURANKOTE'
        ]);

        // 8. Doda
        $doda = District::updateOrCreate(
            ['code' => 'JK-DOD'],
            ['name' => 'Doda', 'state_id' => $stateId]
        );
        $this->createTehsils($doda, [
            'ASSAR','BHADERWAH','BHALESSA','BHALLA','BHATYAS','DODA','GHAT','GUNDA','THATHRI'
        ]);

        // 9. Ramban
        $ramban = District::updateOrCreate(
            ['code' => 'JK-RAM'],
            ['name' => 'Ramban', 'state_id' => $stateId]
        );
        $this->createTehsils($ramban, [
            'BANIHAL','BATOTE','GOOL','KHARI','RAMBAN','UKHRAL'
        ]);

        // 10. Kishtwar
        $kishtwar = District::updateOrCreate(
            ['code' => 'JK-KIS'],
            ['name' => 'Kishtwar', 'state_id' => $stateId]
        );
        $this->createTehsils($kishtwar, [
            'DRABSHALLA','INDERWAL','KISHTWAR','MARWAH','NAGSENI','PADDAR'
        ]);

        $this->command->info('✓ Jammu Division: 10 districts seeded');
    }

    /**
     * Seed Ladakh districts and tehsils
     */
    private function seedLadakh($stateId): void
    {
        $this->command->info('Seeding Ladakh...');

        // 1. Leh
        $leh = District::updateOrCreate(
            ['code' => 'LD-LEH'],
            ['name' => 'Leh', 'state_id' => $stateId]
        );
        $this->createTehsils($leh, [
            'Leh Town', 'Nubra', 'Changthang', 'Khaltse'
        ]);

        // 2. Kargil
        $kargil = District::updateOrCreate(
            ['code' => 'LD-KAR'],
            ['name' => 'Kargil', 'state_id' => $stateId]
        );
        $this->createTehsils($kargil, [
            'Kargil Town', 'Zanskar', 'Drass', 'Shakar-Chiktan'
        ]);

        $this->command->info('✓ Ladakh: 2 districts seeded');
    }

    /**
     * Create tehsils for a district
     */
    private function createTehsils(District $district, array $tehsilNames): void
    {
        foreach ($tehsilNames as $index => $tehsilName) {
            $tehsilName = trim($tehsilName);
            $code = strtoupper($district->code . '-T' . str_pad($index + 1, 2, '0', STR_PAD_LEFT));

            // Remove if any duplicate found (Same name, different code)
            $duplicates = Tehsil::where('district_id', $district->id)
                ->where('name', $tehsilName)
                ->where('code', '!=', $code)
                ->get();

            if ($duplicates->isNotEmpty()) {
                foreach ($duplicates as $duplicate) {
                    $duplicate->delete();
                    $this->command->warn("  - Deleted duplicate tehsil: {$duplicate->name} ({$duplicate->code})");
                }
            }
            
            $tehsil = Tehsil::updateOrCreate(
                ['code' => $code],
                [
                    'district_id' => $district->id,
                    'name' => $tehsilName,
                ]
            );

            if ($tehsil->wasRecentlyCreated) {
                // $this->command->info("  + Created Tehsil: {$tehsilName} ({$code})");
                // commented out to reduce noise
            } else {
                // $this->command->line("  ~ Updated Tehsil: {$tehsilName} ({$code})");
            }
        }
    }
}
