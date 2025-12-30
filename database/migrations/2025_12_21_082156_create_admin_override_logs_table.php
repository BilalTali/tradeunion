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
        Schema::create('admin_override_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->constrained('users');
            $table->string('action_type'); // E.g., 'election.open_voting', 'candidate.approve'
            $table->morphs('target'); // Polymorphic: election_id, member_id, etc.
            $table->foreignId('original_portfolio_holder_id')->nullable()->constrained('members');
            $table->text('justification'); // Required: WHY admin is bypassing portfolio authority
            $table->json('action_details'); // Context: what was changed, from/to values
            $table->ipAddress('ip_address');
            $table->timestamp('executed_at');
            $table->timestamps();
            
            // Indexes for audit queries
            $table->index('executed_at');
            $table->index('admin_user_id');
            $table->index('action_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_override_logs');
    }
};
