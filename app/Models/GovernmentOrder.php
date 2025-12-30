<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GovernmentOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'department',
        'order_date',
        'file_path',
        'description',
        'is_active',
    ];

    protected $casts = [
        'order_date' => 'date',
        'is_active' => 'boolean',
    ];
}
