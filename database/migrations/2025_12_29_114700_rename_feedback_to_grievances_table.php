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
        // 1. Rename table
        if (Schema::hasTable('feedback')) {
            Schema::rename('feedback', 'grievances');
        }

        Schema::table('grievances', function (Blueprint $table) {
            // 2. Add new columns
            if (!Schema::hasColumn('grievances', 'subject')) {
                $table->string('subject')->after('user_id')->nullable(); 
                // Set nullable initially if there's existing data, or default if empty
            }
            if (!Schema::hasColumn('grievances', 'category')) {
                $table->string('category')->default('Other')->after('subject');
            }
            if (!Schema::hasColumn('grievances', 'status')) {
                $table->string('status')->default('pending')->after('message'); // pending, in_progress, resolved, rejected
            }

            // 3. Drop old columns
            if (Schema::hasColumn('grievances', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grievances', function (Blueprint $table) {
            if (!Schema::hasColumn('grievances', 'is_approved')) {
                $table->boolean('is_approved')->default(false);
            }
            $table->dropColumn(['subject', 'category', 'status']);
        });

        if (Schema::hasTable('grievances')) {
            Schema::rename('grievances', 'feedback');
        }
    }
};
