<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResolutionVote extends Model
{
    public $timestamps = false; // Only created_at

    protected $fillable = [
        'resolution_id',
        'committee_member_id',
        'vote',
        'vote_cast_at',
        'notes',
    ];

    protected $casts = [
        'vote_cast_at' => 'datetime',
    ];

    /**
     * Get the resolution being voted on
     */
    public function resolution(): BelongsTo
    {
        return $this->belongsTo(Resolution::class);
    }

    /**
     * Get the committee member who cast this vote
     */
    public function committeeMember(): BelongsTo
    {
        return $this->belongsTo(CommitteeMember::class);
    }

    /**
     * Check if vote is in favor
     */
    public function isFor(): bool
    {
        return $this->vote === 'for';
    }

    /**
     * Check if vote is against
     */
    public function isAgainst(): bool
    {
        return $this->vote === 'against';
    }

    /**
     * Check if vote is abstain
     */
    public function isAbstain(): bool
    {
        return $this->vote === 'abstain';
    }
}
