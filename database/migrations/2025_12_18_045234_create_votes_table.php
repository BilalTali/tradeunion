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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_id')->constrained()->onDelete('cascade'); // Who voted (audit trail)
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade'); // Who they voted for
            $table->string('vote_hash'); // For verification
            $table->string('ip_address', 45)->nullable(); // Encrypted IP for security
            
            // Photo Verification (from add_photo_verification_to_votes_table)
            $table->string('live_photo_path')->nullable();
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            
            $table->timestamps();
            
            $table->index('election_id');
            $table->index('member_id');
            $table->unique(['election_id', 'member_id', 'candidate_id']); // Prevent duplicate votes for same candidate
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
