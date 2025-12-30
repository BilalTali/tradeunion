<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeVote extends Model
{
    protected $fillable = [
        'committee_election_id',
        'member_id',
        'committee_candidate_id',
        'vote_hash',
        'ip_address',
        'live_photo_path',
        'verification_status',
        'verified_by',
        'verified_at',
        'voter_type',
        'portfolio_id',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    /**
     * Get the committee election this vote belongs to
     */
    public function committeeElection()
    {
        return $this->belongsTo(CommitteeElection::class);
    }

    /**
     * Get the member who cast this vote
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the candidate who received this vote
     */
    public function committeeCandidate()
    {
        return $this->belongsTo(CommitteeCandidate::class);
    }

    /**
     * Get the user who verified this vote
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the portfolio if voted as portfolio holder
     */
    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    /**
     * Scope: pending votes
     */
    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    /**
     * Scope: approved votes
     */
    public function scopeApproved($query)
    {
        return $query->where('verification_status', 'approved');
    }

    /**
     * Scope: rejected votes
     */
    public function scopeRejected($query)
    {
        return $query->where('verification_status', 'rejected');
    }
}
