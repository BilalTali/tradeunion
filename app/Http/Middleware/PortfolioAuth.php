<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\PortfolioPermissionService;
use Symfony\Component\HttpFoundation\Response;

class PortfolioAuth
{
    protected $permissionService;

    public function __construct(PortfolioPermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission  The required permission (e.g., 'election.create')
     * @param  string  $action  The CRUD action (read, write, execute, delete)
     */
    public function handle(Request $request, Closure $next, string $permission, string $action = 'execute'): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        // Check if user has the required permission via their active portfolio
        if (!$this->permissionService->userCan($user, $permission, $action)) {
            abort(403, "You do not have permission to {$action} {$permission}. Please contact your administrator to assign the appropriate portfolio.");
        }

        // Permission granted - proceed with request
        return $next($request);
    }
}
