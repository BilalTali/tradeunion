<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Http\Controllers\Traits\HasPortfolioAuthorization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElectionController extends Controller
{
    use HasPortfolioAuthorization;
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Get user's management level and entity
     */
    private function getUserLevel($user): array
    {
        // Use new trait method that checks portfolio first
        return $this->getUserEffectiveLevel($user);
    }

    /**
     * Get route prefix based on user role or portfolio
     */
    private function getRoutePrefix($user): string
    {
        // Check for active portfolio first
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            $activePosition = $service->getActivePosition($user->member);
            
            if ($activePosition && $activePosition->portfolio) {
                $level = $activePosition->level;
                $portfolioType = $activePosition->portfolio->type;
                
                // If it's an election commission portfolio, use EC routes
                if ($portfolioType === 'election_commission') {
                    return "{$level}.ec";
                }
                
                // If it's a president portfolio, use president routes  
                if (str_contains($activePosition->portfolio->name, 'President')) {
                    return "{$level}.president";
                }
                
                // Default to level for other portfolios
                return $level;
            }
        }
        
        // Fall back to role-based routing
        $info = $this->getUserEffectiveLevel($user);
        return $info['level'];
    }

    /**
     * Display a listing of elections (role-filtered).
     */
    public function index()
    {
        $this->authorize('viewAny', Election::class);
        
        $user = auth()->user();
        
        // Auto-update statuses for convenience (since cron main not be running)
        Election::whereIn('status', ['scheduled', 'draft'])
            ->where('nomination_start', '<=', now())
            ->where('nomination_end', '>', now())
            ->update(['status' => 'nominations_open']);

        Election::where('status', 'nominations_open')
            ->where('nomination_end', '<=', now())
            ->update(['status' => 'nominations_closed']);

        $info = $this->getUserEffectiveLevel($user);
        
        $query = Election::latest();
        
        // Check if user has EC portfolio (takes precedence over role)
        $hasECPortfolio = false;
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            $activePosition = $service->getActivePosition($user->member);
            if ($activePosition && $activePosition->portfolio->isElectionCommission()) {
                $hasECPortfolio = true;
            }
        }
        
        // Filter by user's level/authority
        if ($info['level'] === 'tehsil' && ($info['via'] === 'portfolio' || $hasECPortfolio)) {
            // Tehsil EC or admin sees tehsil elections
            $query->where('level', 'tehsil')->where('entity_id', $info['entity_id']);
        } elseif ($info['level'] === 'district' && ($info['via'] === 'portfolio' || str_contains($user->role, 'district'))) {
            // District EC/admin sees district + tehsil elections in their district
            $query->where(function($q) use ($info) {
                $q->where(function($sub) use ($info) {
                    $sub->where('level', 'district')->where('entity_id', $info['entity_id']);
                })->orWhere(function($sub) use ($info) {
                    $tehsilIds = \App\Models\Tehsil::where('district_id', $info['entity_id'])->pluck('id');
                    $sub->where('level', 'tehsil')->whereIn('entity_id', $tehsilIds);
                });
            });
        } elseif ($info['level'] === 'state' || $user->role === 'super_admin') {
            // State EC/admin sees all elections - no filter
        } elseif ($user->role === 'member' && !$hasECPortfolio) {
             // Regular members see elections relevant to their location
             $member = \App\Models\Member::where('user_id', $user->id)->first();
             if ($member) {
                $query->where(function($q) use ($member) {
                    $q->where('level', 'state')
                      ->orWhere(function($sub) use ($member) {
                          $sub->where('level', 'district')->where('entity_id', $member->district_id);
                      })
                      ->orWhere(function($sub) use ($member) {
                          $sub->where('level', 'tehsil')->where('entity_id', $member->tehsil_id);
                      });
                });
             }
        }

        $elections = $query->paginate(15);

        return Inertia::render('Elections/Index', [
            'elections' => $elections,
            'hasECPortfolio' => $hasECPortfolio, // Pass to frontend for UI changes
            'userLevel' => $info['level'],
        ]);
    }

    /**
     * Show the form for creating a new election (role-filtered).
     */
    public function create()
    {
        $this->authorize('create', Election::class);
        
        $user = auth()->user();
        $info = $this->getUserLevel($user);
        
        // Only show options appropriate for user's level
        if ($info['level'] === 'tehsil') {
            // Tehsil admin can only create tehsil elections for their tehsil
            $tehsil = \App\Models\Tehsil::with('district')->find($info['entity_id']);
            return Inertia::render('Elections/Create', [
                'userLevel' => 'tehsil',
                'tehsils' => [$tehsil],
                'districts' => [],
                'states' => [],
                'preSelected' => [
                    'level' => 'tehsil',
                    'entity_id' => $info['entity_id'],
                    'tehsilName' => $tehsil->name,
                    'districtName' => $tehsil->district->name ?? 'N/A',
                    'stateName' => 'Jammu & Kashmir',
                ],
            ]);
        } elseif ($info['level'] === 'district') {
            // District admin can create district elections or zone elections within their district
            $district = \App\Models\District::find($info['entity_id']);
            return Inertia::render('Elections/Create', [
                'userLevel' => 'district',
                'districts' => [$district],
                'tehsils' => \App\Models\Tehsil::where('district_id', $info['entity_id'])->get(),
                'states' => [],
                'preSelected' => [
                    'districtId' => $info['entity_id'],
                    'districtName' => $district->name ?? 'N/A',
                    'stateName' => 'Jammu & Kashmir',
                ],
            ]);
        }
        
        // State admin can create any election
        return Inertia::render('Elections/Create', [
            'userLevel' => 'state',
            'states' => \App\Models\State::all(),
            'districts' => \App\Models\District::all(),
            'tehsils' => \App\Models\Tehsil::all(),
            'preSelected' => null,
        ]);
    }

    /**
     * Store a newly created election.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Election::class);
        
        $validated = $request->validate([
            'level' => 'required|in:state,district,tehsil',
            'entity_id' => 'required|integer',
            'election_type' => 'required|in:tehsil_president,district_president,state_president',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'nomination_start' => 'required|date',
            'nomination_end' => 'required|date|after:nomination_start',
            'voting_start' => 'required|date|after:nomination_end',
            'voting_end' => 'required|date|after:voting_start',
        ]);
        
        // Additional security check: Ensure user isn't creating election outside their scope
        $user = auth()->user();
        $info = $this->getUserLevel($user);
        
        if ($info['level'] === 'tehsil') {
            if ($validated['level'] !== 'tehsil' || (int)$validated['entity_id'] !== (int)$info['entity_id']) {
                abort(403, 'You can only create elections for your assigned Tehsil.');
            }
        } elseif ($info['level'] === 'district') {
            // District can create district elections OR tehsil elections within their district
            // (We allow them to create any tehsil election in their district, assume UI provides correct ID)
        }

        $election = Election::create($validated);
        $prefix = $this->getRoutePrefix(auth()->user());

        return redirect()->route($prefix . '.elections.show', $election)
            ->with('success', 'Election created successfully.');
    }

    /**
     * Display the specified election.
     */
    public function show(Election $election)
    {
        $this->authorize('view', $election);
        
        $user = auth()->user();
        $member = \App\Models\Member::where('user_id', $user->id)->first();
        
        // Check if user has nominated for this election
        $hasNominated = false;
        if ($member) {
            $hasNominated = $election->candidates()->where('member_id', $member->id)->exists();
        }
        
        // Check if user has EC portfolio (portfolio-based system)
        $hasECPortfolio = false;
        $userLevel = null;
        $isCommissionMember = false;
        
        if ($member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            $activePosition = $service->getActivePosition($member);
            
            if ($activePosition && $activePosition->portfolio) {
                // Check if it's an EC portfolio
                if ($activePosition->portfolio->type === 'election_commission') {
                    $hasECPortfolio = true;
                    $isCommissionMember = true; // EC portfolio = commission member
                    $userLevel = $activePosition->level;
                }
            }
        }
        
        // Legacy: Also check old election_commission table for backward compatibility
        if (!$isCommissionMember && $member) {
            $isCommissionMember = $election->commission()->where('member_id', $member->id)->exists();
        }
        
        $commissionExists = $election->commission()->exists() || $isCommissionMember;
        
        return Inertia::render('Elections/Show', [
            'election' => $election->load('candidates.member'),
            'hasNominated' => $hasNominated,
            'isCommissionMember' => $isCommissionMember,
            'commissionExists' => $commissionExists,
            'hasECPortfolio' => $hasECPortfolio,
            'userLevel' => $userLevel,
        ]);
    }

    /**
     * Show the form for editing the specified election.
     */
    public function edit(Election $election)
    {
        $this->authorize('update', $election);
        
        // Prevent editing if votes have been cast
        if ($election->votes()->count() > 0) {
            return back()->with('error', 'Cannot edit election - votes have already been cast.');
        }

        $user = auth()->user();
        $hasECPortfolio = false;
        $level = 'member';

        // Check if user has an active EC portfolio
        if ($user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            $activePosition = $service->getActivePosition($user->member);
            
            if ($activePosition && $activePosition->portfolio) {
                $level = $activePosition->level;
                $hasECPortfolio = $activePosition->portfolio->type === 'election_commission';
            }
        }

        return Inertia::render('Elections/Edit', [
            'election' => $election,
            'hasECPortfolio' => $hasECPortfolio,
            'userLevel' => $level,
        ]);
    }

    /**
     * Update the specified election.
     */
    public function update(Request $request, Election $election)
    {
        $this->authorize('update', $election);
        
        // Prevent updating if votes have been cast
        if ($election->votes()->count() > 0) {
            return back()->with('error', 'Cannot update election - votes have already been cast.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'nomination_start' => 'required|date',
            'nomination_end' => 'required|date|after:nomination_start',
            'voting_start' => 'required|date|after:nomination_end',
            'voting_end' => 'required|date|after:voting_start',
        ]);

        $election->update($validated);
        $prefix = $this->getRoutePrefix(auth()->user());

        return redirect()->route($prefix . '.elections.show', $election)
            ->with('success', 'Election updated successfully.');
    }

    /**
     * Remove the specified election.
     */
    public function destroy(Election $election)
    {
        $this->authorize('delete', $election);
        
        // Prevent deletion if votes have been cast
        if ($election->votes()->count() > 0) {
            return back()->with('error', 'Cannot delete election - votes have already been cast.');
        }

        // Prevent deletion if candidates exist
        if ($election->candidates()->count() > 0) {
            return back()->with('error', 'Cannot delete election - candidates exist. Please reject all candidates first.');
        }

        $election->delete();
        $prefix = $this->getRoutePrefix(auth()->user());

        return redirect()->route($prefix . '.elections.index')
            ->with('success', 'Election deleted successfully.');
    }

    /**
     * Open nominations for the election
     */
    public function openNominations(Election $election)
    {
        $this->authorize('manageStatus', $election);
        $this->authorizeCommissionAction($election, 'election.open_nominations');

        if ($election->status !== 'draft') {
            return back()->withErrors(['error' => 'Nominations can only be opened from draft status.']);
        }

        $election->update(['status' => 'nominations_open']);

        return back()->with('success', 'Nominations opened successfully.');
    }

    /**
     * Close nominations for the election
     */
    public function closeNominations(Election $election)
    {
        $this->authorize('manageStatus', $election);
        $this->authorizeCommissionAction($election, 'election.close_nominations');

        if ($election->status !== 'nominations_open') {
            return back()->withErrors(['error' => 'Nominations are not currently open.']);
        }

        $election->update(['status' => 'nominations_closed']);

        return back()->with('success', 'Nominations closed successfully.');
    }

    /**
     * Open voting for the election
     */
    public function openVoting(Election $election)
    {
        $this->authorize('manageStatus', $election);
        $this->authorizeCommissionAction($election, 'election.open_voting');

        if ($election->status !== 'nominations_closed') {
            return back()->withErrors(['error' => 'Nominations must be closed before opening voting.']);
        }

        $election->update(['status' => 'voting_open']);

        return back()->with('success', 'Voting opened successfully.');
    }

    /**
     * Close voting for the election
     */
    public function closeVoting(Election $election)
    {
        $this->authorize('manageStatus', $election);
        $this->authorizeCommissionAction($election, 'election.close_voting');

        if ($election->status !== 'voting_open') {
            return back()->withErrors(['error' => 'Voting is not currently open.']);
        }

        $election->update(['status' => 'voting_closed']);

        return back()->with('success', 'Voting closed successfully.');
    }

    /**
     * Complete the election
     */
    public function complete(Election $election)
    {
        $this->authorize('manageStatus', $election);
        $this->authorizeCommissionAction($election, 'election.complete');

        if (!in_array($election->status, ['voting_closed', 'completed'])) {
            return back()->withErrors(['error' => 'Voting must be closed before completing election.']);
        }

        $election->update(['status' => 'completed']);

        return back()->with('success', 'Election completed successfully.');
    }

    /**
     * Authorize that the current user is an Election Commission member for this election
     */
    /**
     * DEPRECATED: Old EC authorization - replaced with portfolio-based system
     * Keeping for backward compatibility during transition
     */
    private function authorizeCommissionAction(Election $election, string $permission = null)
    {
        if ($permission) {
            // NEW: Use portfolio-based authorization
            $this->authorizePortfolio(
                $permission,
                'execute',
                $election->level,
                $election,
                'Election Commission action'
            );
        } else {
            // OLD: Fallback to legacy EC table check
            $user = auth()->user();
            $memberId = \App\Models\Member::where('user_id', $user->id)->value('id');
            
            if (!$memberId) {
                abort(403, 'Unauthorized. You must be a member to access this action.');
            }

            $isCommission = $election->commission()->where('member_id', $memberId)->exists();

            if (!$isCommission) {
                abort(403, 'Unauthorized. Only Election Commission members can perform this action.');
            }
        }
    }
}
