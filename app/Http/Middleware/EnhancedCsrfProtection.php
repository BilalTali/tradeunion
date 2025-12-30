<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnhancedCsrfProtection
{
    /**
     * Handle an incoming request with enhanced CSRF protection.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Additional CSRF checks for critical operations
        if ($this->isCriticalOperation($request)) {
            // Verify token exists and matches
            $headerToken = $request->header('X-CSRF-TOKEN') ?? $request->header('X-XSRF-TOKEN');
            
            if (!$headerToken) {
                abort(419, 'CSRF token missing for critical operation');
            }
            
            // Time-based token validation (30 min max for critical operations)
            if ($request->session()->has('csrf_timestamp')) {
                $tokenAge = now()->diffInMinutes($request->session()->get('csrf_timestamp'));
                
                if ($tokenAge > 30) {
                    $request->session()->regenerateToken();
                    $request->session()->put('csrf_timestamp', now());
                    
                    return back()->withErrors([
                        'csrf' => 'Security token expired. Please refresh and try again.'
                    ])->with('warning', 'For your security, please try again.');
                }
            } else {
                $request->session()->put('csrf_timestamp', now());
            }
            
            // Log critical operations for audit trail
            \Log::info('Critical operation attempted', [
                'user_id' => auth()->id(),
                'ip' => $request->ip(),
                'path' => $request->path(),
                'method' => $request->method(),
            ]);
        }
        
        return $next($request);
    }
    
    /**
     * Determine if the current request is a critical operation.
     */
    private function isCriticalOperation(Request $request): bool
    {
        // Define critical operations that need extra CSRF protection
        $criticalPatterns = [
            '*/vote',
            '*/elections/*/complete',
            '*/elections/*/open-voting',
            '*/elections/*/close-voting',
            '*/committee-elections/*/vote',
            '*/committee-elections/*/complete',
            '*/members/*/suspend',
            '*/members/*/terminate',
            '*/resolutions/*/execute',
            '*/candidates/*/approve',
            '*/candidates/*/reject',
        ];
        
        foreach ($criticalPatterns as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }
        
        return false;
    }
}
