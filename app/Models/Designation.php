<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Designation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get employee categories that can have this designation
     */
    public function employeeCategories()
    {
        return $this->belongsToMany(EmployeeCategory::class, 'category_designation_map');
    }

    /**
     * Get members with this designation
     */
    public function members()
    {
        return $this->hasMany(Member::class);
    }

    /**
     * Scope to get only active designations
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
