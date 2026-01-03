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
            // Add nullable foreign keys to preserve existing data
            $table->foreignId('employee_category_id')->nullable()->after('department_id')->constrained('employee_categories')->onDelete('set null');
            $table->foreignId('designation_id')->nullable()->after('employee_category_id')->constrained()->onDelete('set null');
            
            $table->index('employee_category_id');
            $table->index('designation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['employee_category_id']);
            $table->dropForeign(['designation_id']);
            $table->dropColumn(['employee_category_id', 'designation_id']);
        });
    }
};
