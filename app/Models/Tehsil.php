<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tehsil extends Model
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
            ->where('level', 'tehsil');
    }

    /**
     * Get the office profile for this tehsil
     */
    public function officeProfile()
    {
        return $this->morphOne(\App\Models\OfficeProfile::class, 'entity');
    }
}
