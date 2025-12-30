<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dispute extends Model
{
    protected $fillable = [
        'dispute_number',
        'disputed_entity_type',
        'disputed_entity_id',
        'filed_by_member_id',
        'filed_at',
        'dispute_type',
        'grounds',
        'evidence',
        'status',
        'decided_by_committee_id',
        'decision_resolution_id',
        'decision',
        'decided_at',
    ];

    protected $casts = [
        'filed_at' => 'datetime',
        'evidence' => 'array',
        'decided_at' => 'datetime',
    ];

    /**
     * Get the member who filed the dispute
     */
    public function filedBy(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'filed_by_member_id');
    }

    /**
     * Get the committee that decided the dispute
     */
    public function decidedByCommittee(): BelongsTo
    {
        return $this->belongsTo(Committee::class, 'decided_by_committee_id');
    }

    /**
     * Get the resolution that decided this dispute
     */
    public function decisionResolution(): BelongsTo
    {
        return $this->belongsTo(Resolution::class, 'decision_resolution_id');
    }

    /**
     * Check if dispute is resolved
     */
    public function isResolved(): bool
    {
        return in_array($this->status, ['decided', 'closed']);
    }

    /**
     * Check if dispute is pending
     */
    public function isPending(): bool
    {
        return in_array($this->status, ['filed', 'under_review', 'hearing_scheduled']);
    }

    /**
     * Scope to filter by status
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get pending disputes
     */
    public function scopePending($query)
    {
        return $query->whereIn('status', ['filed', 'under_review', 'hearing_scheduled']);
    }
}
