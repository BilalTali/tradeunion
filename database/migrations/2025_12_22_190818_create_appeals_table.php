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
        Schema::create('appeals', function (Blueprint $table) {
            $table->id();
            
            // Identification
            $table->string('appeal_number', 50)->unique();
            
            // What's being appealed
            $table->foreignId('dispute_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('resolution_id')->nullable()->constrained()->nullOnDelete();
            
            // Filed by
            $table->foreignId('filed_by_member_id')->constrained('members');
            $table->datetime('filed_at')->useCurrent();
            
            // Hierarchy (Zone → District → State)
            $table->enum('appeal_level', ['district', 'state']); // Can't appeal at zone level
            
            // Grounds
            $table->text('grounds');
            $table->json('supporting_documents')->nullable();
            
            // Status
            $table->enum('status', [
                'filed',
                'admitted',
                'rejected',
                'under_review',
                'decided',
                'closed'
            ])->default('filed');
            
            // Decision
            $table->foreignId('decided_by_committee_id')->nullable()->constrained('committees')->nullOnDelete();
            $table->foreignId('decision_resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->enum('decision', ['upheld', 'overturned', 'modified', 'remanded'])->nullable();
            $table->text('decision_notes')->nullable();
            $table->datetime('decided_at')->nullable();
            
            // Execution freeze
            $table->boolean('freezes_execution')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'appeal_level'], 'idx_status_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appeals');
    }
};
