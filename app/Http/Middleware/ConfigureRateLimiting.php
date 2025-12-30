<?php

namespace App\Http\Middleware;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class ConfigureRateLimiting
{
    /**
     * Configure rate limiters for the application.
     */
    public static function configure(): void
    {
        // OTP Request Rate Limiting - 5 requests per 10 minutes
        RateLimiter::for('otp', function (Request $request) {
            return Limit::perMinutes(10, 5)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    $retryAfter = $headers['Retry-After'] ?? 600;
                    return response()->json([
                        'message' => 'Too many OTP requests. Please wait before trying again.',
                        'retry_after' => $retryAfter,
                        'retry_after_minutes' => ceil($retryAfter / 60),
                    ], 429, $headers);
                });
        });
        
        // Vote Submission - 1 vote per minute per election (prevents spam)
        RateLimiter::for('vote', function (Request $request) {
            $election = $request->route('election');
            $key = $request->user()->id . ':election:' . ($election?->id ?? 'unknown');
            
            return Limit::perMinute(1)
                ->by($key)
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message' => 'Please wait before submitting another vote.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });
        
        // Candidate Nomination - 3 nominations per hour
        RateLimiter::for('nominate', function (Request $request) {
            return Limit::perHour(3)
                ->by($request->user()?->id)
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message' => 'Too many nomination attempts. Please wait before trying again.',
                        'retry_after_minutes' => ceil(($headers['Retry-After'] ?? 3600) / 60),
                    ], 429, $headers);
                });
        });
        
        // File Upload Rate Limiting - 10 uploads per hour
        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perHour(10)
                ->by($request->user()?->id)
                ->response(function () {
                    return response()->json([
                        'message' => 'Too many file uploads. Please try again later.',
                    ], 429);
                });
        });
        
        // Login Attempts - 5 per minute per email
        RateLimiter::for('login', function (Request $request) {
            $email = $request->input('email');
            
            return Limit::perMinute(5)
                ->by($email . ':' . $request->ip())
                ->response(function (Request $request, array $headers) {
                    $seconds = $headers['Retry-After'] ?? 60;
                    return back()->withErrors([
                        'email' => "Too many login attempts. Please try again in {$seconds} seconds.",
                    ]);
                });
        });
        
        // General API Rate Limiting - 60 requests per minute
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip());
        });
        
        // Global Web Rate Limiting - 1000 requests per minute (DDoS protection)
        RateLimiter::for('global', function (Request $request) {
            return Limit::perMinute(1000)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function () {
                    return response('Too Many Requests', 429);
                });
        });
        
        // Admin Actions - 30 per minute
        RateLimiter::for('admin', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->user()?->id);
        });
    }
}
