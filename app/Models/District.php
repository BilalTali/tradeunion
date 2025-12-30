<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = [
        'state_id',
        'name',
        'code',
        'office_address',
        'contact_details'
    ];

    protected $casts = [
        'contact_details' => 'array',
    ];

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function tehsils()
    {
        return $this->hasMany(Tehsil::class);
    }

    public function members()
    {
        return $this->hasManyThrough(Member::class, Tehsil::class);
    }

    public function leadershipPositions()
    {
        return $this->hasMany(LeadershipPosition::class, 'entity_id')
            ->where('level', 'district');
    }

    /**
     * Get the office profile for this district
     */
    public function officeProfile()
    {
        return $this->morphOne(\App\Models\OfficeProfile::class, 'entity');
    }
}
