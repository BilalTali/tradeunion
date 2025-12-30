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
        Schema::table('leadership_positions', function (Blueprint $table) {
            // Resolution tracking for portfolio removal
            $table->foreignId('removal_resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->timestamp('removed_at')->nullable()->after('end_date');
            $table->text('removal_reason')->nullable()->after('removed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leadership_positions', function (Blueprint $table) {
            $table->dropForeign(['removal_resolution_id']);
            $table->dropColumn([
                'removal_resolution_id',
                'removed_at',
                'removal_reason',
            ]);
        });
    }
};
