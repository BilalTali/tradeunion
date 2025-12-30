<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display a listing of portfolios.
     * Portfolios are read-only (seeded data).
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $role = $user->role;

        // Determine level based on role
        if (str_contains($role, 'tehsil')) {
            $level = 'tehsil';
        } elseif (str_contains($role, 'district')) {
            $level = 'district';
        } else {
            // State/Super Admin can filter, default to State
            $level = $request->get('level', 'state');
        }
        
        $portfolios = Portfolio::active()
            ->byLevel($level)
            ->orderBy('authority_rank')
            ->get()
            ->groupBy('type');

        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'currentLevel' => $level,
            'stats' => [
                'tehsil' => Portfolio::active()->byLevel('tehsil')->count(),
                'district' => Portfolio::active()->byLevel('district')->count(),
                'state' => Portfolio::active()->byLevel('state')->count(),
            ],
        ]);
    }

    /**
     * Display the specified portfolio.
     */
    public function show(Portfolio $portfolio)
    {
        $portfolio->load(['reportsTo', 'subordinates', 'leadershipPositions' => function ($query) {
            $query->where('is_current', true)->with('member');
        }]);

        return Inertia::render('Portfolios/Show', [
            'portfolio' => $portfolio,
        ]);
    }

    /**
     * API endpoint: Get portfolios for dropdown (used in assignment forms)
     */
    public function list(Request $request)
    {
        $user = auth()->user();
        $role = $user->role;

        // Determine level based on role (Override request level if restricted)
        if (str_contains($role, 'tehsil')) {
            $level = 'tehsil';
        } elseif (str_contains($role, 'district')) {
            $level = 'district';
        } else {
            $level = $request->get('level');
        }

        $type = $request->get('type');

        $query = Portfolio::active()->orderBy('authority_rank');

        if ($level) {
            $query->byLevel($level);
        }

        if ($type === 'executive') {
            $query->executive();
        } elseif ($type === 'election_commission') {
            $query->electionCommission();
        }

        return response()->json($query->get());
    }
}

