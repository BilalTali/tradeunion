<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'election_id',
        'member_id',
        'candidate_id',
        'vote_hash',
        'ip_address',
        'live_photo_path',
        'verification_status',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
