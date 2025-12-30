<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = [
        'code',
        'name',
        'level',
        'type',
        'category',
        'description',
        'constitutional_responsibilities',
        'authority_rank',
        'reports_to_portfolio_id',
        'can_assign_portfolios',
        'can_initiate_transfers',
        'can_approve_transfers',
        'can_conduct_elections',
        'can_resolve_disputes',
        'is_financial_role',
        'eligibility_rules',
        'conflict_flags',
        'is_active',
    ];

    protected $casts = [
        'can_assign_portfolios' => 'boolean',
        'can_initiate_transfers' => 'boolean',
        'can_approve_transfers' => 'boolean',
        'can_conduct_elections' => 'boolean',
        'can_resolve_disputes' => 'boolean',
        'is_financial_role' => 'boolean',
        'is_active' => 'boolean',
        'eligibility_rules' => 'array',
        'conflict_flags' => 'array',
    ];

    /**
     * Get the portfolio this one reports to
     */
    public function reportsTo()
    {
        return $this->belongsTo(Portfolio::class, 'reports_to_portfolio_id');
    }

    /**
     * Get portfolios that report to this one
     */
    public function subordinates()
    {
        return $this->hasMany(Portfolio::class, 'reports_to_portfolio_id');
    }

    /**
     * Get leadership positions using this portfolio
     */
    public function leadershipPositions()
    {
        return $this->hasMany(LeadershipPosition::class);
    }

    /**
     * Scope: Active portfolios only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: By level
     */
    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope: Executive roles
     */
    public function scopeExecutive($query)
    {
        return $query->whereIn('type', ['executive', 'administrative', 'financial', 'legal']);
    }

    /**
     * Scope: Election Commission roles
     */
    public function scopeElectionCommission($query)
    {
        return $query->where('type', 'election_commission');
    }

    /**
     * Check if this is an Election Commission portfolio
     */
    public function isElectionCommission(): bool
    {
        return $this->type === 'election_commission';
    }

    /**
     * Check if this portfolio conflicts with another
     */
    public function conflictsWith(Portfolio $other): bool
    {
        // EC and Executive roles conflict
        if ($this->isElectionCommission() && !$other->isElectionCommission()) {
            return true;
        }
        if (!$this->isElectionCommission() && $other->isElectionCommission()) {
            return true;
        }
        return false;
    }

    /**
     * Get all permissions for this portfolio
     */
    public function permissions()
    {
        return $this->hasMany(PortfolioPermission::class);
    }

    /**
     * Check if portfolio has a specific permission
     */
    public function hasPermission(string $permission, string $action = 'execute'): bool
    {
        $column = 'can_' . $action;
        
        return $this->permissions()
            ->where('permission_key', $permission)
            ->where($column, true)
            ->exists();
    }

    /**
     * Get permissions by resource type
     */
    public function permissionsByResource(string $resourceType)
    {
        return $this->permissions()
            ->where('resource_type', $resourceType)
            ->get();
    }

    /**
     * Check if portfolio can manage a resource type
     */
    public function canManage(string $resourceType): bool
    {
        return $this->permissions()
            ->where('resource_type', $resourceType)
            ->where(function($q) {
                $q->where('can_write', true)
                  ->orWhere('can_execute', true);
            })
            ->exists();
    }

    /**
     * Get all permission keys for this portfolio
     */
    public function getPermissionKeys(): array
    {
        return $this->permissions()
            ->pluck('permission_key')
            ->toArray();
    }
}
