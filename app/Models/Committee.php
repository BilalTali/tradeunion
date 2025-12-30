<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'level',
        'entity_id',
        'min_members',
        'max_members',
        'quorum_percentage',
        'voting_threshold',
        'start_date',
        'end_date',
        'is_active',
        'description',
        'constitutional_basis',
        'created_by',
    ];

    protected $casts = [
        'quorum_percentage' => 'decimal:2',
        'voting_threshold' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who created this committee
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all members of this committee
     */
    public function members(): HasMany
    {
        return $this->hasMany(CommitteeMember::class);
    }

    /**
     * Get active members only
     */
    public function activeMembers(): HasMany
    {
        return $this->hasMany(CommitteeMember::class)->where('is_active', true);
    }

    /**
     * Get all resolutions proposed to this committee
     */
    public function resolutions(): HasMany
    {
        return $this->hasMany(Resolution::class);
    }

    /**
     * Get all meetings held by this committee
     */
    public function meetings(): HasMany
    {
        return $this->hasMany(CommitteeMeeting::class);
    }

    /**
     * Check if committee has quorum
     */
    public function hasQuorum(): bool
    {
        $totalMembers = $this->activeMembers()->count();
        $requiredQuorum = ceil($totalMembers * ($this->quorum_percentage / 100));
        
        return $totalMembers >= $requiredQuorum;
    }

    /**
     * Get entity (tehsil, district, or state) based on level
     */
    public function entity()
    {
        return match($this->level) {
            'tehsil' => $this->belongsTo(Tehsil::class, 'entity_id'),
            'district' => $this->belongsTo(District::class, 'entity_id'),
            'state' => $this->belongsTo(State::class, 'entity_id'),
            default => null,
        };
    }

    /**
     * Scope to filter by active committees
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by committee type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by level
     */
    public function scopeAtLevel($query, string $level)
    {
        return $query->where('level', $level);
    }
}
