<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get departments that have this category
     */
    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_category_map');
    }

    /**
     * Get designations available for this category
     */
    public function designations()
    {
        return $this->belongsToMany(Designation::class, 'category_designation_map');
    }

    /**
     * Get members in this category
     */
    public function members()
    {
        return $this->hasMany(Member::class);
    }

    /**
     * Scope to get only active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
