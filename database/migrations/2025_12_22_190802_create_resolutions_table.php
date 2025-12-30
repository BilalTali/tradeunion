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
        Schema::create('resolutions', function (Blueprint $table) {
            $table->id();
            
            // Identification
            $table->string('resolution_number', 50)->unique();
            $table->foreignId('committee_id')->constrained()->cascadeOnDelete();
            
            // Classification
            $table->enum('type', [
                'disciplinary',
                'administrative',
                'election',
                'financial',
                'constitutional',
                'general'
            ]);
            $table->enum('category', [
                'member_suspension',
                'member_termination',
                'transfer_approval',
                'election_annulment',
                'portfolio_removal',
                'budget_approval',
                'policy_change',
                'other'
            ])->nullable();
            
            // Content
            $table->string('title', 500);
            $table->longText('proposal_text');
            $table->text('rationale')->nullable();
            $table->json('proposed_action')->nullable(); // Structured action details
            
            // Proposer
            $table->foreignId('proposed_by')->constrained('leadership_positions');
            $table->datetime('proposed_date')->useCurrent();
            
            // Voting
            $table->datetime('vote_scheduled_date')->nullable();
            $table->datetime('vote_conducted_date')->nullable();
            $table->integer('votes_for')->default(0);
            $table->integer('votes_against')->default(0);
            $table->integer('votes_abstain')->default(0);
            $table->boolean('quorum_met')->default(false);
            
            // Status
            $table->enum('status', [
                'draft',
                'proposed',
                'scheduled',
                'voting',
                'passed',
                'rejected',
                'executed',
                'archived',
                'appealed'
            ])->default('draft');
            
            // Execution
            $table->foreignId('executed_by')->nullable()->constrained('leadership_positions')->nullOnDelete();
            $table->datetime('executed_at')->nullable();
            $table->text('execution_notes')->nullable();
            
            // Validity
            $table->date('effective_date')->nullable();
            $table->date('expires_date')->nullable();
            
            // Attachments
            $table->json('attachments')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'committee_id'], 'idx_status_committee');
            $table->index(['type', 'category'], 'idx_type_category');
            $table->index('resolution_number', 'idx_resolution_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resolutions');
    }
};
