<?php

namespace App\Http\Controllers\Traits;

use App\Models\AdminOverrideLog;
use App\Services\PortfolioPermissionService;
use Illuminate\Support\Facades\Log;

/**
 * Portfolio-Based Authorization Trait
 * 
 * Provides hybrid portfolio + role-based authorization
 * Portfolio permissions checked first, role-based admin access as fallback
 */
trait HasPortfolioAuthorization
{
    /**
     * Check if user has portfolio permission, with admin role fallback
     */
    protected function authorizePortfolio(
        string $permission, 
        string $action = 'execute',
        ?string $level = null,
        $target = null,
        string $justification = null
    ): void {
        $user = auth()->user();
        $service = app(PortfolioPermissionService::class);
        
        // Determine level if not provided
        if (!$level && $target && method_exists($target, 'getAttribute')) {
            $level = $target->getAttribute('level');
        }
        
        // Try portfolio permission first
        if ($level) {
            $hasPermission = $service->userCanAtLevel($user, $permission, $level, $action);
        } else {
            $hasPermission = $service->userCan($user, $permission, $action);
        }
        
        if ($hasPermission) {
            return; // Authorized via portfolio
        }
        
        // Check admin role fallback
        if ($this->canAdminOverride($user, $level)) {
            // Log admin override
            $this->logAdminOverride($user, $permission, $target, $justification);
            return; // Authorized via admin override
        }
        
        // Not authorized
        abort(403, "You need '$permission' portfolio permission or admin role for this action.");
    }
    
    /**
     * Check if user can override via admin role
     */
    protected function canAdminOverride($user, ?string $level = null): bool
    {
        $role = $user->role;
        
        // Super admin can override everything
        if ($role === 'super_admin') {
            return true;
        }
        
        // Level-specific admin can override at their level
        if ($level === 'state' && str_contains($role, 'state')) {
            return true;
        }
        
        if ($level === 'district' && str_contains($role, 'district')) {
            return true;
        }
        
        if ($level === 'tehsil' && str_contains($role, 'tehsil')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Log admin override action
     */
    protected function logAdminOverride($user, string $action, $target = null, ?string $justification = null): void
    {
        try {
            $targetDetails = [];
            
            if ($target && is_object($target)) {
                $targetDetails = [
                    'type' => get_class($target),
                    'id' => $target->id ?? null,
                    'title' => $target->title ?? $target->name ?? null,
                ];
            }
            
            AdminOverrideLog::create([
                'admin_user_id' => $user->id,
                'action_type' => $action,
                'target_type' => $targetDetails['type'] ?? null,
                'target_id' => $targetDetails['id'] ?? null,
                'justification' => $justification ?? 'Admin override - no portfolio holder assigned',
                'action_details' => $targetDetails,
                'ip_address' => request()->ip(),
                'executed_at' => now(),
            ]);
            
            Log::info('Admin override logged', [
                'admin_id' => $user->id,
                'action' => $action,
                'target' => $targetDetails,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log admin override', [
                'error' => $e->getMessage(),
                'admin_id' => $user->id,
                'action' => $action,
            ]);
        }
    }
    
    /**
     * Get user's effective level (for scoping data)
     */
    protected function getUserEffectiveLevel($user): array
    {
        // Check for active portfolio first
        $service = app(PortfolioPermissionService::class);
        
        if ($user->member) {
            $activePosition = $service->getActivePosition($user->member);
            
            if ($activePosition) {
                return [
                    'level' => $activePosition->level,
                    'entity_id' => $activePosition->entity_id,
                    'via' => 'portfolio',
                ];
            }
        }
        
        // Fallback to role-based level
        $role = $user->role;
        
        if ($role === 'super_admin') {
            return ['level' => 'state', 'entity_id' => 1, 'via' => 'role'];
        }
        
        if (str_contains($role, 'district')) {
            return ['level' => 'district', 'entity_id' => $user->district_id, 'via' => 'role'];
        }
        
        if (str_contains($role, 'tehsil')) {
            return ['level' => 'tehsil', 'entity_id' => $user->tehsil_id, 'via' => 'role'];
        }
        
        return ['level' => 'tehsil', 'entity_id' => $user->tehsil_id ?? null, 'via' => 'role'];
    }
    
    /**
     * Check hierarchical authority (State > District > Zone)
     */
    protected function hasHierarchicalAuthority($user, string $targetLevel): bool
    {
        $userLevel = $this->getUserEffectiveLevel($user);
        
        $hierarchy = ['state' => 3, 'district' => 2, 'tehsil' => 1];
        
        $userRank = $hierarchy[$userLevel['level']] ?? 0;
        $targetRank = $hierarchy[$targetLevel] ?? 0;
        
        return $userRank >= $targetRank;
    }
}

