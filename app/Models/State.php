<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $fillable = [
        'name',
        'code',
        'vision',
        'mission',
        'office_address',
        'contact_details',
        'logo_path'
    ];

    protected $casts = [
        'contact_details' => 'array',
    ];

    public function districts()
    {
        return $this->hasMany(District::class);
    }

    /**
     * Get the office profile for this state
     */
    public function officeProfile()
    {
        return $this->morphOne(\App\Models\OfficeProfile::class, 'entity');
    }
}
