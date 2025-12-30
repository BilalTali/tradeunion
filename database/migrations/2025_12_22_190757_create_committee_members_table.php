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
        Schema::create('committee_members', function (Blueprint $table) {
            $table->id();
            
            // Links
            $table->foreignId('committee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('leadership_position_id')->constrained()->cascadeOnDelete();
            
            // Role in Committee
            $table->enum('role', ['chair', 'vice_chair', 'member', 'secretary', 'convener'])->default('member');
            
            // Tenure
            $table->date('appointed_date');
            $table->date('term_end_date')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Metadata (NO FK to resolutions to avoid circular dependency)
            $table->unsignedBigInteger('appointment_resolution_id')->nullable(); // Can be linked later
            $table->foreignId('appointed_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            
            // Indexes & Constraints
            $table->index(['committee_id', 'is_active'], 'idx_committee_active');
            $table->unique(['committee_id', 'leadership_position_id'], 'unique_active_membership');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_members');
    }
};
