<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventAttendance extends Model
{
    protected $table = 'event_attendance';

    protected $fillable = [
        'blog_post_id',
        'member_id',
        'status',
        'attended_at',
        'notes',
        'notification_sent',
        'absent_notice_sent',
    ];

    protected $casts = [
        'attended_at' => 'datetime',
        'notification_sent' => 'boolean',
        'absent_notice_sent' => 'boolean',
    ];

    public function blogPost()
    {
        return $this->belongsTo(BlogPost::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
