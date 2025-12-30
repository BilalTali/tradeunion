<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request and redirect to role-specific dashboard
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return $next($request);
        }

        $role = $user->role;
        $currentPath = $request->path();

        // Define role prefixes
        $rolePrefix = $this->getRolePrefix($role);
        
        // If accessing root dashboard, redirect to role-specific dashboard
        if ($currentPath === 'dashboard') {
            return redirect("/{$rolePrefix}/dashboard");
        }

        // Check if user is accessing wrong prefix
        $allowedPrefixes = $this->getAllowedPrefixes($role);
        $currentPrefix = explode('/', $currentPath)[0];

        if (!in_array($currentPrefix, $allowedPrefixes) && $currentPrefix !== '') {
            // Redirect to correct prefix
            return redirect("/{$rolePrefix}/dashboard");
        }

        return $next($request);
    }

    private function getRolePrefix($role)
    {
        if ($role === 'super_admin') {
            return 'state';
        } elseif (str_contains($role, 'district')) {
            return 'district';
        } elseif (str_contains($role, 'zone')) {
            return 'zone';
        } else {
            return 'member';
        }
    }

    private function getAllowedPrefixes($role)
    {
        $prefix = $this->getRolePrefix($role);
        
        // All roles can access these common routes
        $common = ['logout', 'profile', 'login', 'register'];
        
        return array_merge([$prefix], $common);
    }
}
