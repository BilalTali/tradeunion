<?php

namespace App\Http\Controllers;

use App\Models\CommitteeElection;
use App\Models\Committee;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommitteeElectionController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of committee elections
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', CommitteeElection::class);
        
        $user = auth()->user();
        
        // Build query based on user role
        $query = CommitteeElection::with(['committee', 'creator'])
            ->orderBy('created_at', 'desc');
        
        // Filter by level if user is not super_admin
        if ($user->role !== 'super_admin') {
            $level = match($user->role) {
                'state_admin', 'state_president' => 'state',
                'district_admin', 'district_president' => 'district',
                'tehsil_admin', 'tehsil_president' => 'tehsil',
                default => null,
            };
            
            if ($level) {
                $query->whereHas('committee', function($q) use ($level, $user) {
                    $q->where('level', $level);
                    
                    // Further filter by entity_id if applicable
                    if ($user->entity_id) {
                        $q->where('entity_id', $user->entity_id);
                    }
                });
            }
        }
        
        $elections = $query->paginate(15);
        
        return Inertia::render('CommitteeElections/Index', [
            'elections' => $elections,
        ]);
    }

    /**
     * Show the form for creating a new committee election
     */
    public function create(Request $request)
    {
        $this->authorize('create', CommitteeElection::class);
        
        $user = auth()->user();
        
        // Get committees based on user's level
        $committeesQuery = Committee::where('is_active', true);
        
        if ($user->role !== 'super_admin') {
            $level = match($user->role) {
                'state_admin', 'state_president' => 'state',
                'district_admin', 'district_president' => 'district',
                'tehsil_admin', 'tehsil_president' => 'tehsil',
                default => null,
            };
            
            if ($level) {
                $committeesQuery->where('level', $level);
                
                if ($user->entity_id) {
                    $committeesQuery->where('entity_id', $user->entity_id);
                }
            }
        }
        
        $committees = $committeesQuery->get();
        
        // Get all portfolios for selection
        $portfolios = Portfolio::where('is_active', true)->get();
        
        return Inertia::render('CommitteeElections/Create', [
            'committees' => $committees,
            'portfolios' => $portfolios,
            'electionTypes' => $this->getElectionTypes(),
        ]);
    }

    /**
     * Store a newly created committee election
     */
    public function store(Request $request)
    {
        $this->authorize('create', CommitteeElection::class);
        
        $validated = $request->validate([
            'committee_id' => 'required|exists:committees,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'election_type' => 'required|in:leadership,membership,custom',
            'nomination_start' => 'required|date',
            'nomination_end' => 'required|date|after:nomination_start',
            'voting_start' => 'required|date|after:nomination_end',
            'voting_end' => 'required|date|after:voting_start',
            'allow_portfolio_holders' => 'required|boolean',
            'allowed_portfolio_ids' => 'nullable|array',
            'allowed_portfolio_ids.*' => 'exists:portfolios,id',
            'restrict_to_same_level' => 'required|boolean',
        ]);
        
        $validated['created_by'] = auth()->id();
        $validated['status'] = 'draft';
        
        $election = CommitteeElection::create($validated);
        
        return redirect()
            ->route($this->getRoutePrefix() . '.committee-elections.show', $election)
            ->with('success', 'Committee election created successfully.');
    }

    /**
     * Display the specified committee election
     */
    public function show(CommitteeElection $election)
    {
        $this->authorize('view', $election);
        
        $election->load([
            'committee',
            'creator',
            'approvedCandidates.member',
            'pendingCandidates.member',
        ]);
        
        // Check if current user can vote
        $user = auth()->user();
        $member = \App\Models\Member::where('user_id', $user->id)->first();
        
        $canVote = false;
        $hasVoted = false;
        $voterType = null;
        
        if ($member) {
            $canVote = $election->memberCanVote($member);
            $hasVoted = $election->votes()->where('member_id', $member->id)->exists();
            $voterType = $election->getVoterType($member);
        }
        
        // Get vote statistics
        $voteStats = [
            'total_votes' => $election->votes()->count(),
            'approved_votes' => $election->votes()->where('verification_status', 'approved')->count(),
            'pending_votes' => $election->votes()->where('verification_status', 'pending')->count(),
        ];
        
        return Inertia::render('CommitteeElections/Show', [
            'election' => $election,
            'canVote' => $canVote,
            'hasVoted' => $hasVoted,
            'voterType' => $voterType,
            'voteStats' => $voteStats,
        ]);
    }

    /**
     * Show the form for editing the specified committee election
     */
    public function edit(CommitteeElection $election)
    {
        $this->authorize('update', $election);
        
        $user = auth()->user();
        
        // Get committees based on user's level
        $committeesQuery = Committee::where('is_active', true);
        
        if ($user->role !== 'super_admin') {
            $level = match($user->role) {
                'state_admin', 'state_president' => 'state',
                'district_admin', 'district_president' => 'district',
                'tehsil_admin', 'tehsil_president' => 'tehsil',
                default => null,
            };
            
            if ($level) {
                $committeesQuery->where('level', $level);
                
                if ($user->entity_id) {
                    $committeesQuery->where('entity_id', $user->entity_id);
                }
            }
        }
        
        $committees = $committeesQuery->get();
        $portfolios = Portfolio::where('is_active', true)->get();
        
        return Inertia::render('CommitteeElections/Edit', [
            'election' => $election,
            'committees' => $committees,
            'portfolios' => $portfolios,
            'electionTypes' => $this->getElectionTypes(),
        ]);
    }

    /**
     * Update the specified committee election
     */
    public function update(Request $request, CommitteeElection $election)
    {
        $this->authorize('update', $election);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'election_type' => 'required|in:leadership,membership,custom',
            'nomination_start' => 'required|date',
            'nomination_end' => 'required|date|after:nomination_start',
            'voting_start' => 'required|date|after:nomination_end',
            'voting_end' => 'required|date|after:voting_start',
            'allow_portfolio_holders' => 'required|boolean',
            'allowed_portfolio_ids' => 'nullable|array',
            'allowed_portfolio_ids.*' => 'exists:portfolios,id',
            'restrict_to_same_level' => 'required|boolean',
        ]);
        
        $election->update($validated);
        
        return redirect()
            ->route($this->getRoutePrefix() . '.committee-elections.show', $election)
            ->with('success', 'Committee election updated successfully.');
    }

    /**
     * Remove the specified committee election
     */
    public function destroy(CommitteeElection $election)
    {
        $this->authorize('delete', $election);
        
        // Only allow deletion if no votes exist
        if ($election->votes()->exists()) {
            return back()->with('error', 'Cannot delete election with existing votes.');
        }
        
        $election->delete();
        
        return redirect()
            ->route($this->getRoutePrefix() . '.committee-elections.index')
            ->with('success', 'Committee election deleted successfully.');
    }

    /**
     * Open nominations for the election
     */
    public function openNominations(CommitteeElection $election)
    {
        $this->authorize('manageStatus', $election);
        
        if ($election->status !== 'draft') {
            return back()->with('error', 'Can only open nominations from draft status.');
        }
        
        $election->update(['status' => 'nominations_open']);
        
        return back()->with('success', 'Nominations opened successfully.');
    }

    /**
     * Close nominations for the election
     */
    public function closeNominations(CommitteeElection $election)
    {
        $this->authorize('manageStatus', $election);
        
        if ($election->status !== 'nominations_open') {
            return back()->with('error', 'Can only close nominations when they are open.');
        }
        
        $election->update(['status' => 'nominations_closed']);
        
        return back()->with('success', 'Nominations closed successfully.');
    }

    /**
     * Open voting for the election
     */
    public function openVoting(CommitteeElection $election)
    {
        $this->authorize('manageStatus', $election);
        
        if ($election->status !== 'nominations_closed') {
            return back()->with('error', 'Can only open voting after nominations are closed.');
        }
        
        // Check if there are approved candidates
        if ($election->approvedCandidates()->count() === 0) {
            return back()->with('error', 'Cannot open voting without approved candidates.');
        }
        
        // Count eligible voters
        $eligibleVoters = $election->getEligibleVoters();
        $election->update([
            'status' => 'voting_open',
            'eligible_voters_count' => $eligibleVoters->count(),
        ]);
        
        return back()->with('success', 'Voting opened successfully.');
    }

    /**
     * Close voting for the election
     */
    public function closeVoting(CommitteeElection $election)
    {
        $this->authorize('manageStatus', $election);
        
        if ($election->status !== 'voting_open') {
            return back()->with('error', 'Can only close voting when it is open.');
        }
        
        $election->update(['status' => 'voting_closed']);
        
        return back()->with('success', 'Voting closed successfully.');
    }

    /**
     * Complete the election
     */
    public function complete(CommitteeElection $election)
    {
        $this->authorize('manageStatus', $election);
        
        if ($election->status !== 'voting_closed') {
            return back()->with('error', 'Can only complete election after voting is closed.');
        }
        
        $election->update(['status' => 'completed']);
        
        return back()->with('success', 'Election completed successfully.');
    }

    /**
     * Get route prefix based on user role
     */
    private function getRoutePrefix(): string
    {
        $user = auth()->user();
        
        return match($user->role) {
            'state_admin', 'state_president' => 'state',
            'district_admin', 'district_president' => 'district',
            'tehsil_admin', 'tehsil_president' => 'tehsil',
            default => 'state',
        };
    }

    /**
     * Get election types for dropdown
     */
    private function getElectionTypes(): array
    {
        return [
            'leadership' => 'Leadership Election',
            'membership' => 'Membership Election',
            'custom' => 'Custom Election',
        ];
    }
}


