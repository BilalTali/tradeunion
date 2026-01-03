<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'description', 'icon', 'posting_label', 'is_active'];

    /**
     * Get employee categories available for this department
     */
    public function employeeCategories()
    {
        return $this->belongsToMany(EmployeeCategory::class, 'department_category_map');
    }
}
