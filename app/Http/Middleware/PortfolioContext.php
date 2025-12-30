<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\PortfolioPermissionService;
use Symfony\Component\HttpFoundation\Response;

class PortfolioContext
{
    protected $permissionService;

    public function __construct(PortfolioPermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Handle an incoming request.
     * 
     * Injects active portfolio context into the request for use by controllers
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->member) {
            $activePosition = $this->permissionService->getActivePosition($user->member);
            
            if ($activePosition) {
                // Inject portfolio data into request attributes
                $request->attributes->set('activePortfolio', $activePosition->portfolio);
                $request->attributes->set('activePosition', $activePosition);
                $request->attributes->set('portfolioLevel', $activePosition->level);
                
                // Also make it available as a request property for easier access
                $request->merge([
                    '_portfolio' => $activePosition->portfolio,
                    '_position' => $activePosition,
                    '_level' => $activePosition->level,
                ]);

                // Track portfolio usage
                $this->permissionService->recordAction($activePosition);
            }
        }

        return $next($request);
    }
}
