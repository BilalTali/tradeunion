<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminOverrideLog extends Model
{
    protected $fillable = [
        'admin_user_id',
        'action_type',
        'target_type',
        'target_id',
        'original_portfolio_holder_id',
        'justification',
        'action_details',
        'ip_address',
        'executed_at',
    ];

    protected $casts = [
        'action_details' => 'array',
        'executed_at' => 'datetime',
    ];

    /**
     * Get the admin who performed the override
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    /**
     * Get the original portfolio holder who should have done this action
     */
    public function originalPortfolioHolder()
    {
        return $this->belongsTo(Member::class, 'original_portfolio_holder_id');
    }

    /**
     * Get the polymorphic target (election, member, etc.)
     */
    public function target()
    {
        return $this->morphTo();
    }

    /**
     * Scope: Recent overrides
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('executed_at', '>=', now()->subDays($days));
    }

    /**
     * Scope: By admin
     */
    public function scopeByAdmin($query, int $adminId)
    {
        return $query->where('admin_user_id', $adminId);
    }

    /**
     * Scope: By action type
     */
    public function scopeByAction($query, string $actionType)
    {
        return $query->where('action_type', $actionType);
    }
}
