<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElectionResult extends Model
{
    protected $fillable = [
        'election_id',
        'position_title',
        'winner_id',
        'total_votes',
        'total_voters',
        'vote_percentage',
        'is_certified',
        'certified_by',
        'certified_at',
    ];

    protected $casts = [
        'is_certified' => 'boolean',
        'certified_at' => 'datetime',
        'vote_percentage' => 'decimal:2',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function winner()
    {
        return $this->belongsTo(Member::class, 'winner_id');
    }

    public function certifier()
    {
        return $this->belongsTo(User::class, 'certified_by');
    }
}
