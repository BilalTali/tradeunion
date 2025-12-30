<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appeal extends Model
{
    protected $fillable = [
        'appeal_number',
        'dispute_id',
        'resolution_id',
        'filed_by_member_id',
        'filed_at',
        'appeal_level',
        'grounds',
        'supporting_documents',
        'status',
        'decided_by_committee_id',
        'decision_resolution_id',
        'decision',
        'decision_notes',
        'decided_at',
        'freezes_execution',
    ];

    protected $casts = [
        'filed_at' => 'datetime',
        'supporting_documents' => 'array',
        'decided_at' => 'datetime',
        'freezes_execution' => 'boolean',
    ];

    /**
     * Get the dispute being appealed (if any)
     */
    public function dispute(): BelongsTo
    {
        return $this->belongsTo(Dispute::class);
    }

    /**
     * Get the resolution being appealed (if any)
     */
    public function resolution(): BelongsTo
    {
        return $this->belongsTo(Resolution::class);
    }

    /**
     * Get the member who filed the appeal
     */
    public function filedBy(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'filed_by_member_id');
    }

    /**
     * Get the committee that decided the appeal
     */
    public function decidedByCommittee(): BelongsTo
    {
        return $this->belongsTo(Committee::class, 'decided_by_committee_id');
    }

    /**
     * Get the resolution that decided this appeal
     */
    public function decisionResolution(): BelongsTo
    {
        return $this->belongsTo(Resolution::class, 'decision_resolution_id');
    }

    /**
     * Check if appeal is resolved
     */
    public function isResolved(): bool
    {
        return in_array($this->status, ['decided', 'closed']);
    }

    /**
     * Check if appeal is active (blocks execution)
     */
    public function isActive(): bool
    {
        return $this->freezes_execution 
            && in_array($this->status, ['filed', 'admitted', 'under_review']);
    }

    /**
     * Scope to filter by status
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get active appeals
     */
    public function scopeActive($query)
    {
        return $query->where('freezes_execution', true)
            ->whereIn('status', ['filed', 'admitted', 'under_review']);
    }

    /**
     * Scope to filter by appeal level
     */
    public function scopeAtLevel($query, string $level)
    {
        return $query->where('appeal_level', $level);
    }
}
