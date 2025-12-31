<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $portfolios = Portfolio::with(['reportsTo', 'permissions'])
            ->orderBy('authority_rank', 'asc')
            ->get();

        return Inertia::render('Admin/MasterData/PortfolioManager', [
            'portfolios' => $portfolios,
            'allPortfolios' => Portfolio::select('id', 'name', 'level')->get(), // For 'reports_to' dropdown
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:portfolios,code',
            'name' => 'required|string|max:255',
            'level' => 'required|in:state,district,tehsil,zone',
            'type' => 'required|in:executive,administrative,financial,legal,election_commission',
            'authority_rank' => 'required|integer',
            'reports_to_portfolio_id' => 'nullable|exists:portfolios,id',
            'description' => 'nullable|string',
            // Booleans
            'can_assign_portfolios' => 'boolean',
            'can_initiate_transfers' => 'boolean',
            'can_approve_transfers' => 'boolean',
            'can_conduct_elections' => 'boolean',
            'can_resolve_disputes' => 'boolean',
            'is_financial_role' => 'boolean',
            'is_active' => 'boolean',
        ]);

        Portfolio::create($validated);

        return back()->with('success', 'Portfolio created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:portfolios,code,' . $portfolio->id,
            'name' => 'required|string|max:255',
            'level' => 'required|in:state,district,tehsil,zone',
            'type' => 'required|in:executive,administrative,financial,legal,election_commission',
            'authority_rank' => 'required|integer',
            'reports_to_portfolio_id' => 'nullable|exists:portfolios,id',
            'description' => 'nullable|string',
            // Booleans
            'can_assign_portfolios' => 'boolean',
            'can_initiate_transfers' => 'boolean',
            'can_approve_transfers' => 'boolean',
            'can_conduct_elections' => 'boolean',
            'can_resolve_disputes' => 'boolean',
            'is_financial_role' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $portfolio->update($validated);

        return back()->with('success', 'Portfolio updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->subordinates()->exists()) {
            return back()->with('error', 'Cannot delete portfolio that has subordinates reporting to it.');
        }

        if ($portfolio->leadershipPositions()->exists()) {
            return back()->with('error', 'Cannot delete portfolio active leadership assignments.');
        }

        $portfolio->delete();

        return back()->with('success', 'Portfolio deleted successfully.');
    }
}
