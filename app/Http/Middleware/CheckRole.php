<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $userRole = auth()->user()->role;

        // Check if user's role matches any of the allowed roles
        foreach ($roles as $role) {
            if ($this->matchesRole($userRole, $role)) {
                return $next($request);
            }
        }

        // User doesn't have permission
        abort(403, 'Unauthorized. You do not have permission to access this resource.');
    }

    /**
     * Check if user role matches the required role
     */
    private function matchesRole(string $userRole, string $requiredRole): bool
    {
        // Exact match
        if ($userRole === $requiredRole) {
            return true;
        }

        // Super admin has access to everything
        if ($userRole === 'super_admin') {
            return true;
        }

        // Check for pattern matches (e.g., 'district_admin' matches 'district')
        if (str_contains($userRole, $requiredRole)) {
            return true;
        }

        return false;
    }
}
