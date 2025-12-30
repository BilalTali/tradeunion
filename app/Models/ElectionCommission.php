<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElectionCommission extends Model
{
    protected $table = 'election_commission';
    
    protected $fillable = [
        'election_id',
        'member_id',
        'role',
        'assigned_by',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function scopeChief($query)
    {
        return $query->where('role', 'chief');
    }
}
