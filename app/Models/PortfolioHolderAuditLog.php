<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioHolderAuditLog extends Model
{
    protected $fillable = [
        'leadership_position_id',
        'user_id',
        'action',
        'field_changed',
        'old_value',
        'new_value',
        'remark',
    ];

    public function leadershipPosition()
    {
        return $this->belongsTo(LeadershipPosition::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
