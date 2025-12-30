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
        // Committee Elections Table
        Schema::create('committee_elections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_id')->constrained('committees')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('election_type', ['leadership', 'membership', 'custom'])->default('leadership');
            
            // Election timeline
            $table->dateTime('nomination_start');
            $table->dateTime('nomination_end');
            $table->dateTime('voting_start');
            $table->dateTime('voting_end');
            
            // Election status
            $table->enum('status', [
                'draft',
                'nominations_open',
                'nominations_closed',
                'voting_open',
                'voting_closed',
                'completed'
            ])->default('draft');
            
            // Voting eligibility settings
            $table->boolean('allow_portfolio_holders')->default(true);
            $table->json('allowed_portfolio_ids')->nullable();
            $table->boolean('restrict_to_same_level')->default(true);
            
            // Statistics
            $table->integer('eligible_voters_count')->default(0);
            $table->integer('eligible_candidates_count')->default(0);
            $table->integer('total_votes_cast')->default(0);
            
            // Metadata
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes
            $table->index(['committee_id', 'status'], 'comm_elections_committee_status');
            $table->index('status', 'comm_elections_status');
        });

        // Committee Candidates Table
        Schema::create('committee_candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_election_id')->constrained('committee_elections')->onDelete('cascade');
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            
            // Position details
            $table->string('position_sought');
            $table->text('nomination_statement')->nullable();
            $table->string('manifesto_file_path')->nullable();
            
            // Status
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            
            // Vote tracking
            $table->integer('vote_count')->default(0);
            
            // Approval tracking
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('approved_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['committee_election_id', 'status'], 'comm_candidates_election_status');
            $table->index('member_id', 'comm_candidates_member');
            $table->unique(['committee_election_id', 'member_id'], 'comm_candidates_unique');
        });

        // Committee Votes Table
        Schema::create('committee_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_election_id')->constrained('committee_elections')->onDelete('cascade');
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('committee_candidate_id')->constrained('committee_candidates')->onDelete('cascade');
            
            // Vote security and anonymization
            $table->string('vote_hash');
            $table->string('ip_address')->nullable();
            $table->string('live_photo_path')->nullable();
            
            // Vote verification
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('verified_at')->nullable();
            
            // Voter eligibility tracking
            $table->enum('voter_type', ['committee_member', 'portfolio_holder']);
            $table->foreignId('portfolio_id')->nullable()->constrained('portfolios')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['committee_election_id', 'verification_status'], 'comm_votes_election_verification');
            $table->index('member_id', 'comm_votes_member');
            $table->unique(['committee_election_id', 'member_id'], 'comm_votes_unique');
        });

        // Committee Vote OTPs Table
        Schema::create('committee_vote_otps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_election_id')->constrained('committee_elections')->onDelete('cascade');
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            
            // OTP details
            $table->string('otp', 6);
            $table->boolean('is_verified')->default(false);
            $table->dateTime('expires_at');
            $table->integer('attempts')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['committee_election_id', 'member_id', 'is_verified'], 'comm_vote_otps_election_member_verified');
            $table->index('expires_at', 'comm_vote_otps_expires');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_vote_otps');
        Schema::dropIfExists('committee_votes');
        Schema::dropIfExists('committee_candidates');
        Schema::dropIfExists('committee_elections');
    }
};
