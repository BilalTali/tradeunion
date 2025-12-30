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
        Schema::create('resolution_votes', function (Blueprint $table) {
            $table->id();
            
            // What's being voted on
            $table->foreignId('resolution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('committee_member_id')->constrained()->cascadeOnDelete();
            
            // Vote
            $table->enum('vote', ['for', 'against', 'abstain']);
            $table->datetime('vote_cast_at')->useCurrent();
            $table->text('notes')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            // Constraints
            $table->unique(['resolution_id', 'committee_member_id'], 'unique_vote');
            $table->index('resolution_id', 'idx_resolution');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resolution_votes');
    }
};
