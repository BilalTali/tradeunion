<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberTransfer extends Model
{
    protected $fillable = [
        'member_id',
        'from_level',
        'from_entity_id',
        'to_level',
        'to_entity_id',
        'status',
        'initiated_by',
        'recommended_by',
        'approved_by',
        'reason',
        'rejection_reason',
        'effective_date',
        'cooling_off_until',
    ];

    protected $casts = [
        'effective_date' => 'date',
        'cooling_off_until' => 'date',
    ];

    /**
     * Get the member being transferred
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the user who initiated the transfer
     */
    public function initiatedBy()
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    /**
     * Get the user who recommended the transfer
     */
    public function recommendedBy()
    {
        return $this->belongsTo(User::class, 'recommended_by');
    }

    /**
     * Get the user who approved the transfer
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope: Pending transfers
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Approved transfers
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope: Completed transfers
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope: For a specific member
     */
    public function scopeForMember($query, $memberId)
    {
        return $query->where('member_id', $memberId);
    }

    /**
     * Check if this is an upward transfer (promotion)
     */
    public function isUpward(): bool
    {
        $levels = ['member' => 0, 'tehsil' => 1, 'district' => 2, 'state' => 3];
        return $levels[$this->to_level] > $levels[$this->from_level];
    }

    /**
     * Check if this is a downward transfer (demotion/return)
     */
    public function isDownward(): bool
    {
        $levels = ['member' => 0, 'tehsil' => 1, 'district' => 2, 'state' => 3];
        return $levels[$this->to_level] < $levels[$this->from_level];
    }

    /**
     * Approve this transfer
     */
    public function approve(User $user): bool
    {
        $this->status = 'approved';
        $this->approved_by = $user->id;
        return $this->save();
    }

    /**
     * Reject this transfer
     */
    public function reject(string $reason, User $user): bool
    {
        $this->status = 'rejected';
        $this->rejection_reason = $reason;
        $this->approved_by = $user->id;
        return $this->save();
    }

    /**
     * Complete this transfer (apply the changes)
     */
    public function complete(): bool
    {
        $this->status = 'completed';
        $this->effective_date = now();
        
        // Update the member's level
        $this->member->update(['member_level' => $this->to_level]);
        
        // Auto-release portfolios from old level
        $this->member->leadershipPositions()
            ->where('level', $this->from_level)
            ->where('is_current', true)
            ->update([
                'is_current' => false,
                'end_date' => now(),
            ]);
        
        return $this->save();
    }
}
