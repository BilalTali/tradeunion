<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resolution extends Model
{
    protected $fillable = [
        'resolution_number',
        'committee_id',
        'type',
        'category',
        'title',
        'proposal_text',
        'rationale',
        'proposed_action',
        'proposed_by',
        'proposed_date',
        'vote_scheduled_date',
        'vote_conducted_date',
        'votes_for',
        'votes_against',
        'votes_abstain',
        'quorum_met',
        'status',
        'executed_by',
        'executed_at',
        'execution_notes',
        'effective_date',
        'expires_date',
        'attachments',
    ];

    protected $casts = [
        'proposed_action' => 'array',
        'proposed_date' => 'datetime',
        'vote_scheduled_date' => 'datetime',
        'vote_conducted_date' => 'datetime',
        'quorum_met' => 'boolean',
        'executed_at' => 'datetime',
        'effective_date' => 'date',
        'expires_date' => 'date',
        'attachments' => 'array',
    ];

    /**
     * Get the committee this resolution belongs to
     */
    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    /**
     * Get the proposer (leadership position)
     */
    public function proposer(): BelongsTo
    {
        return $this->belongsTo(LeadershipPosition::class, 'proposed_by');
    }

    /**
     * Get the executor (leadership position)
     */
    public function executor(): BelongsTo
    {
        return $this->belongsTo(LeadershipPosition::class, 'executed_by');
    }

    /**
     * Get all votes on this resolution
     */
    public function votes(): HasMany
    {
        return $this->hasMany(ResolutionVote::class);
    }

    /**
     * Check if resolution passed based on voting threshold
     */
    public function isPassed(): bool
    {
        if (!$this->quorum_met) {
            return false;
        }

        $totalVotes = $this->votes_for + $this->votes_against + $this->votes_abstain;
        
        if ($totalVotes === 0) {
            return false;
        }

        $votingThreshold = $this->committee->voting_threshold ?? 50;
        $percentageFor = ($this->votes_for / $totalVotes) * 100;

        return $percentageFor >= $votingThreshold;
    }

    /**
     * Check if resolution can be executed
     */
    public function canBeExecuted(): bool
    {
        return $this->status === 'passed' 
            && !$this->executed_at
            && !$this->hasActivePeal();
    }

    /**
     * Check if there's an active appeal
     */
    public function hasActiveAppeal(): bool
    {
        return Appeal::where('resolution_id', $this->id)
            ->whereIn('status', ['filed', 'admitted', 'under_review'])
            ->where('freezes_execution', true)
            ->exists();
    }

    /**
     * Scope to filter by status
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get executable resolutions
     */
    public function scopeExecutable($query)
    {
        return $query->where('status', 'passed')
            ->whereNull('executed_at');
    }
}
