<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Register observers
        \App\Models\LeadershipPosition::observe(\App\Observers\LeadershipPositionObserver::class);
        
        // Register policies
        \Illuminate\Support\Facades\Gate::policy(
            \App\Models\LeadershipPosition::class,
            \App\Policies\PortfolioHolderPolicy::class
        );
    }
}
