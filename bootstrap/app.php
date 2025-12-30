<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Configure Rate Limiters
            RateLimiter::for('auth', function (Request $request) {
                return Limit::perMinute(5)->by($request->ip())
                    ->response(function () {
                        return response('Too many login attempts. Please try again later.', 429);
                    });
            });
            
            RateLimiter::for('api', function (Request $request) {
                return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
            });
            
            Route::middleware('web')
                ->group(base_path('routes/portfolio.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Enforce office profile completion for admins
        $middleware->web(append: [
            \App\Http\Middleware\EnsureOfficeProfileComplete::class,
        ]);

        // Enhanced CSRF Protection for critical operations
        $middleware->web(append: [
            \App\Http\Middleware\EnhancedCsrfProtection::class,
        ]);

        // Security Headers
        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'portfolio' => \App\Http\Middleware\PortfolioAuth::class,
            'portfolio.context' => \App\Http\Middleware\PortfolioContext::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
