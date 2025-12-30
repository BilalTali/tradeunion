<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadershipPosition extends Model
{
    protected $fillable = [
        'level',
        'entity_id',
        'position_title',
        'portfolio_id',
        'member_id',
        'assigned_by',
        'start_date',
        'end_date',
        'is_current',
        'is_elected',
        // Portfolio Holder Authority Fields
        'appointment_order_number',
        'appointment_date',
        'appointing_authority',
        'status',
        'signature_path',
        'signature_valid_from',
        'signature_valid_to',
        'seal_image_path',
        'digital_signature_enabled',
        'portfolio_accepted_at',
        'conflict_of_interest_declaration',
        'election_neutrality_declaration',
        'admin_remarks',
        'last_modified_by',
        // Resolution tracking
        'removal_resolution_id',
        'removed_at',
        'removal_reason',
        // Tracking fields
        'active_portfolio',
        'last_accessed_at',
        'action_count',
    ];

    protected $casts = [
        'entity_id' => 'integer',
        'portfolio_id' => 'integer',
        'member_id' => 'integer',
        'action_count' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_elected' => 'boolean',
        'appointment_date' => 'date',
        'signature_valid_from' => 'date',
        'signature_valid_to' => 'date',
        'digital_signature_enabled' => 'boolean',
        'portfolio_accepted_at' => 'datetime',
        'conflict_of_interest_declaration' => 'array',
        'election_neutrality_declaration' => 'array',
        'removed_at' => 'datetime',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the removal resolution
     */
    public function removalResolution()
    {
        return $this->belongsTo(Resolution::class, 'removal_resolution_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Scope to get current positions
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    /**
     * Scope to get presidents
     */
    public function scopePresidents($query)
    {
        return $query->where('position_title', 'President');
    }

    /**
     * Scope to get positions at a specific level
     */
    public function scopeAtLevel($query, $level)
    {
        return $query->where('level', $level);
    }
    
    /**
     * Get audit logs for this position
     */
    public function auditLogs()
    {
        return $this->hasMany(PortfolioHolderAuditLog::class);
    }
    
    /**
     * Check if signature is currently valid
     */
    public function isSignatureValid(): bool
    {
        if (!$this->signature_path || !$this->signature_valid_to) return false;
        return now()->lte($this->signature_valid_to);
    }
    
    /**
     * Check if portfolio has been formally accepted
     */
    public function hasAcceptedPortfolio(): bool
    {
        return !is_null($this->portfolio_accepted_at);
    }
}
