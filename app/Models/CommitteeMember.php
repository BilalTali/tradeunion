<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitteeMember extends Model
{
    protected $fillable = [
        'committee_id',
        'member_id',
        'leadership_position_id',
        'role',
        'appointed_date',
        'term_end_date',
        'is_active',
        'appointment_resolution_id',
        'appointed_by',
    ];

    protected $casts = [
        'appointed_date' => 'date',
        'term_end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the committee this member belongs to
     */
    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    /**
     * Get the leadership position
     */
    public function leadershipPosition(): BelongsTo
    {
        return $this->belongsTo(LeadershipPosition::class);
    }

    /**
     * Get the member directly
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the member through leadership position (legacy)
     */
    public function memberThroughPosition()
    {
        return $this->leadershipPosition->member();
    }

    /**
     * Get the user who appointed this committee member
     */
    public function appointedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'appointed_by');
    }

    /**
     * Get the appointment resolution (if any)
     */
    public function appointmentResolution(): BelongsTo
    {
        return $this->belongsTo(Resolution::class, 'appointment_resolution_id');
    }

    /**
     * Scope to filter by active members
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by role
     */
    public function scopeWithRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Check if this member is the committee chair
     */
    public function isChair(): bool
    {
        return $this->role === 'chair';
    }
}
