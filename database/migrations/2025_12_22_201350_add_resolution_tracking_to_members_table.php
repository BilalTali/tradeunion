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
        Schema::table('members', function (Blueprint $table) {
            // Resolution tracking for disciplinary actions
            $table->foreignId('suspension_resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->foreignId('termination_resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            
            // Timestamps and reasons
            $table->timestamp('suspended_at')->nullable()->after('status');
            $table->text('suspension_reason')->nullable()->after('suspended_at');
            $table->timestamp('terminated_at')->nullable()->after('suspension_reason');
            $table->text('termination_reason')->nullable()->after('terminated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['suspension_resolution_id']);
            $table->dropForeign(['termination_resolution_id']);
            $table->dropColumn([
                'suspension_resolution_id',
                'termination_resolution_id',
                'suspended_at',
                'suspension_reason',
                'terminated_at',
                'termination_reason',
            ]);
        });
    }
};
