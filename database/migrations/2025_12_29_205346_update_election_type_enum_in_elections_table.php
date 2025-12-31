<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Use raw statement to update ENUM definition to include 'tehsil_president'
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE elections MODIFY COLUMN election_type ENUM('zonal_president', 'district_president', 'state_president', 'tehsil_president') NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to previous ENUM definition (be careful as this could truncate data if 'tehsil_president' exists)
        // We'll leave 'tehsil_president' in the down migration for safety, effectively making this irreversible without data loss
        // Or strictly revert:
        // DB::statement("ALTER TABLE elections MODIFY COLUMN election_type ENUM('zonal_president', 'district_president', 'state_president') NOT NULL");
    }
};
