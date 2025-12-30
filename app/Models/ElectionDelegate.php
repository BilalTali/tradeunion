<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElectionDelegate extends Model
{
    protected $fillable = [
        'election_id',
        'member_id',
        'delegate_type',
        'nominated_by',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function nominatedBy()
    {
        return $this->belongsTo(Member::class, 'nominated_by');
    }

    public function scopeZonalPresidents($query)
    {
        return $query->where('delegate_type', 'zonal_president');
    }

    public function scopeDistrictPresidents($query)
    {
        return $query->where('delegate_type', 'district_president');
    }

    public function scopePortfolioHolders($query)
    {
        return $query->where('delegate_type', 'portfolio_holder');
    }
}
