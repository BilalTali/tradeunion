<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('member_transfers', function (Blueprint $table) {
            // Resolution tracking for override approvals
            $table->foreignId('override_resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('member_transfers', function (Blueprint $table) {
            $table->dropForeign(['override_resolution_id']);
            $table->dropColumn('override_resolution_id');
        });
    }
};
