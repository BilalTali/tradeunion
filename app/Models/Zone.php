<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    protected $fillable = [
        'district_id',
        'name',
        'code',
        'description'
    ];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function leadershipPositions()
    {
        return $this->hasMany(LeadershipPosition::class, 'entity_id')
            ->where('level', 'zone');
    }

    /**
     * Get the office profile for this zone
     */
    public function officeProfile()
    {
        return $this->morphOne(\App\Models\OfficeProfile::class, 'entity');
    }
}
