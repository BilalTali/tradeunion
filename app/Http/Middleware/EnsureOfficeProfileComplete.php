<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\State;
use App\Models\District;
use App\Models\Tehsil;

class EnsureOfficeProfileComplete
{
    /**
     * Handle an incoming request.
     *
     * Redirects admins to complete office profile if not done.
     * This ensures institutional accountability and proper branding.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Only enforce for authenticated users
        if (!$user) {
            return $next($request);
        }
        
        // Only enforce for admin roles
        if (!$this->isAdmin($user->role)) {
            return $next($request);
        }
        
        // Get user's office profile based on role/jurisdiction
        $officeProfile = $this->getOfficeProfile($user);
        
        // If profile doesn't exist or is incomplete, redirect to profile setup
        if (!$officeProfile || !$officeProfile->is_complete) {
            // Allow access to specific routes even with incomplete profile
            $allowedRoutes = [
                '*.office-profile.*',  // All office profile routes
                'logout',              // Allow logout
                '*.profile.*',         // User profile routes
            ];
            
            // Check if current route matches allowed patterns
            foreach ($allowedRoutes as $pattern) {
                if ($request->routeIs($pattern)) {
                    return $next($request);
                }
            }
            
            // Build completion message
            $completionPercentage = $officeProfile ? $officeProfile->completion_percentage : 0;
            $message = $officeProfile 
                ? "Your office profile is {$completionPercentage}% complete. Please complete it to access all features."
                : "Please set up your office profile to continue.";
            
            // Redirect to office profile edit page
            $rolePrefix = $this->getRolePrefix($user->role);
            
            return redirect()
                ->route("{$rolePrefix}.office-profile.edit")
                ->with('warning', $message);
        }
        
        return $next($request);
    }
    
    /**
     * Check if user role is an admin
     */
    private function isAdmin(string $role): bool
    {
        return $role === 'super_admin' ||
               str_contains($role, '_admin') ||
               str_contains($role, 'admin');
    }
    
    /**
     * Get office profile for the user based on their role and jurisdiction
     */
    private function getOfficeProfile($user)
    {
        // State level admin
        if ($user->role === 'super_admin' || str_contains($user->role, 'state')) {
            $state = State::first(); // Assuming single state (J&K)
            return $state?->officeProfile;
        }
        
        // District level admin
        if (str_contains($user->role, 'district') && $user->district_id) {
            $district = District::find($user->district_id);
            return $district?->officeProfile;
        }
        
        // Zone level admin
        if (str_contains($user->role, 'tehsil') && $user->tehsil_id) {
            $tehsil = Tehsil::find($user->tehsil_id);
            return $tehsil?->officeProfile;
        }
        
        return null;
    }
    
    /**
     * Get route prefix based on user role
     */
    private function getRolePrefix(string $role): string
    {
        // Super admin always uses state routes
        if ($role === 'super_admin') {
            return 'state';
        }
        
        if (str_contains($role, 'district')) {
            return 'district';
        }
        
        if (str_contains($role, 'tehsil')) {
            return 'tehsil';
        }
        
        return 'state';
    }
}


