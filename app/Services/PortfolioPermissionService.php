<?php

namespace App\Services;

use App\Models\User;
use App\Models\Member;
use App\Models\Portfolio;
use App\Models\LeadershipPosition;
use App\Models\PortfolioPermission;
use Illuminate\Support\Collection;

class PortfolioPermissionService
{
    /**
     * Check if user has permission via their active portfolio
     */
    public function userCan(User $user, string $permission, string $action = 'execute'): bool
    {
        $member = $user->member;
        if (!$member) return false;
        
        $activePosition = $this->getActivePosition($member);
        if (!$activePosition) return false;
        
        return $this->portfolioHasPermission(
            $activePosition->portfolio,
            $permission,
            $action
        );
    }

    /**
     * Check permission at specific level
     */
    public function userCanAtLevel(User $user, string $permission, string $level, string $action = 'execute'): bool
    {
        $member = $user->member;
        if (!$member) return false;
        
        $activePosition = $this->getActivePosition($member);
        if (!$activePosition) return false;
        if ($activePosition->level !== $level) return false;
        
        return $this->portfolioHasPermission(
            $activePosition->portfolio,
            $permission,
            $action
        );
    }

    /**
     * Get user's active portfolio position
     */
    public function getActivePosition(Member $member): ?LeadershipPosition
    {
        return LeadershipPosition::where('member_id', $member->id)
            ->where('is_current', true)
            ->where('active_portfolio', true)
            ->where(function($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>', now());
            })
            ->with('portfolio')
            ->first();
    }

    /**
     * Check if portfolio grants specific permission
     */
    private function portfolioHasPermission(Portfolio $portfolio, string $permission, string $action = 'execute'): bool
    {
        $column = 'can_' . $action; // can_read, can_write, can_execute, can_delete
        
        return PortfolioPermission::where('portfolio_id', $portfolio->id)
            ->where('permission_key', $permission)
            ->where($column, true)
            ->exists();
    }

    /**
     * Get all permissions for a portfolio
     */
    public function getPortfolioPermissions(Portfolio $portfolio): Collection
    {
        return PortfolioPermission::where('portfolio_id', $portfolio->id)
            ->get()
            ->groupBy('resource_type');
    }

    /**
     * Get allowed routes for user's active portfolio
     */
    public function getUserRoutes(User $user): array
    {
        $member = $user->member;
        if (!$member) return [];
        
        $activePosition = $this->getActivePosition($member);
        if (!$activePosition) return [];
        
        return $this->getPortfolioRoutes($activePosition->portfolio, $activePosition->level);
    }

    /**
     * Map portfolio permissions to route names
     */
    private function getPortfolioRoutes(Portfolio $portfolio, string $level): array
    {
        $permissions = $this->getPortfolioPermissions($portfolio);
        $routes = [];
        
        // Permission → Route mapping
        $permissionRouteMap = [
            'election.create' => ["{$level}.elections.create", "{$level}.elections.store"],
            'election.read' => ["{$level}.elections.index", "{$level}.elections.show"],
            'election.update' => ["{$level}.elections.edit", "{$level}.elections.update"],
            'election.open_nominations' => ["{$level}.elections.open-nominations"],
            'election.close_nominations' => ["{$level}.elections.close-nominations"],
            'election.open_voting' => ["{$level}.elections.open-voting"],
            'election.close_voting' => ["{$level}.elections.close-voting"],
            'candidate.review' => ["{$level}.candidates.pending"],
            'candidate.approve' => ["{$level}.candidates.approve"],
            'candidate.reject' => ["{$level}.candidates.reject"],
            'result.calculate' => ["{$level}.results.calculate"],
            'result.certify' => ["{$level}.results.certify"],
            'member.read' => ["{$level}.members.index", "{$level}.members.show"],
            'member.approve' => ["{$level}.members.approve"],
            'portfolio.assign' => ["{$level}.portfolio-assignments.index", "{$level}.portfolio-assignments.create"],
        ];
        
        foreach ($permissions as $resourceType => $perms) {
            foreach ($perms as $perm) {
                if (isset($permissionRouteMap[$perm->permission_key])) {
                    $routes = array_merge($routes, $permissionRouteMap[$perm->permission_key]);
                }
            }
        }
        
        return array_unique($routes);
    }

    /**
     * Switch user's active portfolio
     */
    public function switchActivePortfolio(User $user, int $leadershipPositionId): bool
    {
        $member = $user->member;
        if (!$member) return false;
        
        // Deactivate all current portfolios
        LeadershipPosition::where('member_id', $member->id)
            ->update(['active_portfolio' => false]);
        
        // Activate the selected portfolio
        $position = LeadershipPosition::where('id', $leadershipPositionId)
            ->where('member_id', $member->id)
            ->where('is_current', true)
            ->first();
        
        if (!$position) return false;
        
        $position->update([
            'active_portfolio' => true,
            'last_accessed_at' => now(),
        ]);
        
        return true;
    }

    /**
     * Increment action count for tracking portfolio usage
     */
    public function recordAction(LeadershipPosition $position): void
    {
        $position->increment('action_count');
        $position->update(['last_accessed_at' => now()]);
    }

    /**
     * Get user's active portfolio name (for UI display)
     */
    public function getActivePortfolioName(User $user): ?string
    {
        $member = $user->member;
        if (!$member) return null;
        
        $activePosition = $this->getActivePosition($member);
        return $activePosition?->portfolio->name;
    }

    /**
     * Check if user has any active portfolio
     */
    public function hasActivePortfolio(User $user): bool
    {
        return $this->getActivePosition($user->member) !== null;
    }
}
