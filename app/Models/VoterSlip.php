<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class VoterSlip extends Model
{
    protected $fillable = [
        'election_id',
        'member_id',
        'slip_number',
        'verification_code',
        'is_used',
        'used_at',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'used_at' => 'datetime',
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
     * Generate a unique slip number
     */
    public static function generateSlipNumber($electionId, $memberId)
    {
        $prefix = 'VS';
        $electionCode = str_pad($electionId, 4, '0', STR_PAD_LEFT);
        $memberCode = str_pad($memberId, 6, '0', STR_PAD_LEFT);
        $random = strtoupper(Str::random(4));
        
        return "{$prefix}-{$electionCode}-{$memberCode}-{$random}";
    }

    /**
     * Generate verification code
     */
    public static function generateVerificationCode()
    {
        return strtoupper(Str::random(8));
    }

    /**
     * Mark slip as used
     */
    public function markAsUsed()
    {
        $this->update([
            'is_used' => true,
            'used_at' => now(),
        ]);
    }
}
