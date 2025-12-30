<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        // 'content' might be JSON for some rows, but we can decode manually or cast if all rows are JSON.
        // Since some are text, we won't cast 'content' globally perfectly, but if we treat lists as JSON, 
        // we handle it in controller/frontend.
        // Actually, let's cast content to array? No, simpler to leave as string and decode if needed,
        // or ensure all content is stored as JSON string even if simple text.
        // Let's stick to manual handling or 'array' if we ensure consistency.
    ];
}
