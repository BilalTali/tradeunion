<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioPermission extends Model
{
    protected $fillable = [
        'portfolio_id',
        'permission_key',
        'resource_type',
        'can_read',
        'can_write',
        'can_delete',
        'can_execute',
        'constraints',
        'description',
    ];

    protected $casts = [
        'can_read' => 'boolean',
        'can_write' => 'boolean',
        'can_delete' => 'boolean',
        'can_execute' => 'boolean',
        'constraints' => 'array',
    ];

    /**
     * Get the portfolio this permission belongs to
     */
    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    /**
     * Check if this permission allows a specific action
     */
    public function allows(string $action): bool
    {
        $column = 'can_' . $action;
        return $this->$column ?? false;
    }

    /**
     * Scope: Filter by resource type
     */
    public function scopeForResource($query, string $resourceType)
    {
        return $query->where('resource_type', $resourceType);
    }

    /**
     * Scope: Filter by permission key
     */
    public function scopeForPermission($query, string $permissionKey)
    {
        return $query->where('permission_key', $permissionKey);
    }

    /**
     * Check if permission has level constraint
     */
    public function hasLevelConstraint(string $level): bool
    {
        if (!$this->constraints) return false;
        return isset($this->constraints['level']) && $this->constraints['level'] === $level;
    }
}
