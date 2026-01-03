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
        Schema::create('category_designation_map', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_category_id')->constrained('employee_categories')->onDelete('cascade');
            $table->foreignId('designation_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['employee_category_id', 'designation_id'], 'cat_desig_unique');
            $table->index('employee_category_id');
            $table->index('designation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_designation_map');
    }
};
