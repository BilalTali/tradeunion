<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'category',
        'author_id',
        'publish_date',
        'status',
        'visibility',
        'featured_image',
        'event_type',
        'event_scope',
        'start_date',
        'end_date',
        'venue',
        'organizer_portfolio_id',
        'priority',
        'target_audience',
        'expiry_date',
        'attachments',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'expiry_date' => 'datetime',
        'attachments' => 'array',
    ];

    public function attendance()
    {
        return $this->hasMany(EventAttendance::class);
    }



    /**
     * Get the author of the blog post.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    /**
     * Get the organizer portfolio.
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Portfolio::class, 'organizer_portfolio_id');
    }

    /**
     * Scope for published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->where('publish_date', '<=', now());
    }

    /**
     * Scope for public posts.
     */
    public function scopePublic($query)
    {
        return $query->where('visibility', 'public');
    }

    /**
     * Scope by category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Generate slug from title.
     */
    public static function generateSlug($title)
    {
        $slug = \Illuminate\Support\Str::slug($title);
        $count = static::where('slug', 'LIKE', "{$slug}%")->count();
        return $count ? "{$slug}-{$count}" : $slug;
    }
}
