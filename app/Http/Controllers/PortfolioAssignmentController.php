<?php

namespace App\Http\Controllers;

use App\Models\LeadershipPosition;
use App\Models\Member;
use App\Models\Portfolio;
use App\Http\Controllers\Traits\HasPortfolioAuthorization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioAssignmentController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    use HasPortfolioAuthorization;
    /**
     * Display portfolio assignments for the current level
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $level = $this->getUserLevel($user);

        $assignments = LeadershipPosition::with(['member', 'portfolio', 'assignedBy'])
            ->where('level', $level)
            ->where('is_current', true)
            ->latest()
            ->get();

        $portfolios = Portfolio::active()->byLevel($level)->orderBy('authority_rank')->get();

        return Inertia::render('PortfolioAssignments/Index', [
            'assignments' => $assignments,
            'portfolios' => $portfolios,
            'level' => $level,
        ]);
    }

    /**
     * Show form to assign a portfolio to a member
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $level = $this->getUserLevel($user);

        $portfolios = Portfolio::active()->byLevel($level)->orderBy('authority_rank')->get();
        
        // Get available members (from the appropriate scope)
        $members = $this->getMembersForLevel($user, $level);

        // Get already assigned portfolio IDs at this level
        $assignedPortfolioIds = LeadershipPosition::where('level', $level)
            ->where('is_current', true)
            ->pluck('portfolio_id')
            ->toArray();

        return Inertia::render('PortfolioAssignments/Create', [
            'portfolios' => $portfolios,
            'members' => $members,
            'level' => $level,
            'assignedPortfolioIds' => $assignedPortfolioIds,
            'preselectedMemberId' => $request->member_id,
            'preselectedPositionTitle' => $request->position_title,
        ]);
    }

    /**
     * Store a new portfolio assignment
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $level = $this->getUserLevel($user);

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'portfolio_id' => 'required|exists:portfolios,id',
        ]);

        $portfolio = Portfolio::findOrFail($validated['portfolio_id']);

        // Validate portfolio is at correct level
        if ($portfolio->level !== $level) {
            return back()->withErrors(['portfolio_id' => 'This portfolio is not available at your level.']);
        }
        
        // Use portfolio authorization (President permission)
        $this->authorizePortfolio(
            'portfolio.assign',
            'write',
            $level,
            $portfolio,
            'President action - portfolio assignment'
        );

        // Check if portfolio is already assigned
        $existing = LeadershipPosition::where('portfolio_id', $validated['portfolio_id'])
            ->where('level', $level)
            ->where('is_current', true)
            ->first();

        if ($existing) {
            return back()->withErrors(['portfolio_id' => 'This portfolio is already assigned to someone else.']);
        }

        // Check if member already has an EC role (conflict check)
        $member = Member::findOrFail($validated['member_id']);
        if ($portfolio->isElectionCommission()) {
            $hasExecutiveRole = LeadershipPosition::where('member_id', $member->id)
                ->where('is_current', true)
                ->whereHas('portfolio', fn($q) => $q->whereIn('type', ['executive', 'administrative', 'financial']))
                ->exists();
            
            if ($hasExecutiveRole) {
                return back()->withErrors(['member_id' => 'This member already holds an executive role and cannot be assigned an Election Commission portfolio.']);
            }
        }

        // Get entity_id based on level
        $entityId = $this->getEntityId($user, $level);

        $newPosition = LeadershipPosition::create([
            'level' => $level,
            'entity_id' => $entityId,
            'position_title' => $portfolio->name,
            'portfolio_id' => $validated['portfolio_id'],
            'member_id' => $validated['member_id'],
            'assigned_by' => $user->id,
            'start_date' => now(),
            'is_current' => true,
            'is_elected' => $this->checkIfElected($portfolio, $validated['member_id']),
            'status' => 'active',
        ]);

        // Redirect to edit form to fill in authority details
        return redirect()->route($this->getRoutePrefix($user) . '.portfolio-holders.edit', $newPosition)
            ->with('success', 'Portfolio assigned successfully. Please complete the authority details below.');
    }

    /**
     * Remove a portfolio assignment
     */
    public function destroy(Request $request, LeadershipPosition $portfolioAssignment)
    {
        $user = $request->user();
        $level = $this->getUserLevel($user);

        // Verify user can manage this assignment
        if ($portfolioAssignment->level !== $level) {
            abort(403, 'You cannot manage assignments at this level.');
        }

        $portfolioAssignment->update([
            'is_current' => false,
            'end_date' => now(),
        ]);

        return back()->with('success', 'Portfolio assignment removed.');
    }

    /**
     * Get user's management level
     */
    private function getUserLevel($user): string
    {
        $role = $user->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        return 'tehsil';
    }

    /**
     * Get route prefix for current user
     */
    private function getRoutePrefix($user): string
    {
        $role = $user->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        return 'tehsil';
    }

    /**
     * Get entity ID for the current level
     */
    private function getEntityId($user, $level): ?int
    {
        switch ($level) {
            case 'tehsil':
            case 'zone': // Fallback for safety
                return $user->tehsil_id;
            case 'district':
                return $user->district_id;
            case 'state':
                return 1; // Assuming single state
            default:
                return null;
        }
    }

    /**
     * Get members available for assignment at this level
     */
    private function getMembersForLevel($user, $level)
    {
        $query = Member::where('status', 'active');
        $lowerLevel = strtolower($level);

        switch ($lowerLevel) {
            case 'tehsil':
            case 'zone':
                $query->where('tehsil_id', $user->tehsil_id);
                break;
            case 'district':
                $query->where('district_id', $user->district_id)
                      ->where('member_level', 'district');
                break;
            case 'state':
                // All active members for state level
                break;
        }

        return $query->with('tehsil.district')->limit(100)->get();
    }

    /**
     * Check if the member is an elected winner for this portfolio
     */
    protected function checkIfElected($portfolio, $memberId)
    {
        return \App\Models\ElectionResult::where('winner_id', $memberId)
            ->where('position_title', $portfolio->name)
            ->where('is_certified', true)
            ->exists();
    }
}

