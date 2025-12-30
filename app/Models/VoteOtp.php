<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoteOtp extends Model
{
    protected $fillable = [
        'election_id',
        'member_id',
        'otp',
        'expires_at',
        'attempts',
        'is_verified',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_verified' => 'boolean',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Check if OTP is still valid
     */
    public function isValid(): bool
    {
        return !$this->is_verified 
            && $this->attempts < 3 
            && $this->expires_at > now();
    }
}
