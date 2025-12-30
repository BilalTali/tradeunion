<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeCandidate extends Model
{
    protected $fillable = [
        'committee_election_id',
        'member_id',
        'position_sought',
        'nomination_statement',
        'manifesto_file_path',
        'status',
        'rejection_reason',
        'vote_count',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Get the committee election this candidate belongs to
     */
    public function committeeElection()
    {
        return $this->belongsTo(CommitteeElection::class);
    }

    /**
     * Get the member who is the candidate
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the user who approved this candidate
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get all votes for this candidate
     */
    public function votes()
    {
        return $this->hasMany(CommitteeVote::class);
    }

    /**
     * Scope: approved candidates
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope: pending candidates
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: rejected candidates
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
