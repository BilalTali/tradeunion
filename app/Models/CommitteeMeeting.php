<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitteeMeeting extends Model
{
    protected $fillable = [
        'committee_id',
        'meeting_date',
        'venue',
        'meeting_type',
        'members_present',
        'quorum_met',
        'agenda',
        'minutes',
        'resolutions_discussed',
        'chaired_by',
    ];

    protected $casts = [
        'meeting_date' => 'datetime',
        'members_present' => 'array',
        'quorum_met' => 'boolean',
        'resolutions_discussed' => 'array',
    ];

    /**
     * Get the committee this meeting belongs to
     */
    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    /**
     * Get the chair of this meeting
     */
    public function chair(): BelongsTo
    {
        return $this->belongsTo(CommitteeMember::class, 'chaired_by');
    }

    /**
     * Get attendance count
     */
    public function getAttendanceCountAttribute(): int
    {
        return is_array($this->members_present) ? count($this->members_present) : 0;
    }

    /**
     * Scope to filter by meeting type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('meeting_type', $type);
    }

    /**
     * Scope to get upcoming meetings
     */
    public function scopeUpcoming($query)
    {
        return $query->where('meeting_date', '>', now());
    }

    /**
     * Scope to get past meetings
     */
    public function scopePast($query)
    {
        return $query->where('meeting_date', '<', now());
    }
}
