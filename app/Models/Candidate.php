<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = [
        'election_id',
        'member_id',
        'position_title',
        'vision_statement',
        'qualifications',
        'status',
        'vote_count',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
