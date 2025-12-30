<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeVoteOtp extends Model
{
    protected $fillable = [
        'committee_election_id',
        'member_id',
        'otp',
        'is_verified',
        'expires_at',
        'attempts',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the committee election this OTP belongs to
     */
    public function committeeElection()
    {
        return $this->belongsTo(CommitteeElection::class);
    }

    /**
     * Get the member this OTP belongs to
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Check if OTP is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    /**
     * Check if OTP has exceeded max attempts
     */
    public function hasExceededAttempts(): bool
    {
        return $this->attempts >= 3;
    }
}
