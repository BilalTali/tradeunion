<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\PortfolioPermissionService;

/**
 * Helper trait for controllers to easily check portfolio permissions
 */
trait HasPortfolioAuthorization
{
    protected function authorizePortfolio(string $permission, string $action = 'execute')
    {
        $service = app(PortfolioPermissionService::class);
        
        if (!$service->userCan(auth()->user(), $permission, $action)) {
            abort(403, "You do not have permission to {$action} {$permission}");
        }
    }

    protected function getActivePortfolio()
    {
        return request()->attributes->get('activePortfolio');
    }

    protected function getActivePosition()
    {
        return request()->attributes->get('activePosition');
    }

    protected function getPortfolioLevel()
    {
        return request()->attributes->get('portfolioLevel');
    }
}
