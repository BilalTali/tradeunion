<?php

namespace App\Http\Controllers;

use App\Models\Resolution;
use App\Models\Committee;
use App\Models\LeadershipPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResolutionController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of resolutions
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Resolution::class);
        
        $user = auth()->user();
        
        $query = Resolution::with(['committee', 'proposer.member', 'votes'])
            ->orderBy('created_at', 'desc');
        
        // Filter by status if provided
        if ($request->filled('status')) {
            $query->withStatus($request->status);
        }
        
        // Role-based filtering (similar to committees)
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
                    if ($user->entity_id) {
                        $q->where('entity_id', $user->entity_id);
                    }
                });
            }
        }
        
        $resolutions = $query->paginate(20);
        
        return Inertia::render('Resolutions/Index', [
            'resolutions' => $resolutions,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Show the form for creating a new resolution
     */
    public function create(Request $request)
    {
        $this->authorize('create', Resolution::class);
        
        $committeeId = $request->query('committee_id');
        $committee = $committeeId ? Committee::findOrFail($committeeId) : null;
        
        $committees = Committee::active()->get();
        
        return Inertia::render('Resolutions/Create', [
            'committees' => $committees,
            'preselectedCommittee' => $committee,
            'resolutionTypes' => $this->getResolutionTypes(),
            'categories' => $this->getCategories(),
        ]);
    }

    /**
     * Store a newly created resolution
     */
    public function store(Request $request)
    {
        $this->authorize('create', Resolution::class);
        
        $validated = $request->validate([
            'committee_id' => 'required|exists:committees,id',
            'type' => 'required|in:disciplinary,administrative,election,financial,constitutional,general',
            'category' => 'nullable|in:member_suspension,member_termination,transfer_approval,election_annulment,portfolio_removal,budget_approval,policy_change,other',
            'title' => 'required|string|max:500',
            'proposal_text' => 'required|string',
            'rationale' => 'nullable|string',
            'proposed_action' => 'nullable|json',
            'effective_date' => 'nullable|date',
            'expires_date' => 'nullable|date|after:effective_date',
        ]);
        
        // Get proposer's leadership position
        $leadershipPosition = LeadershipPosition::where('member_id', auth()->user()->member->id ?? null)
            ->where('is_current', true)
            ->first();
        
        if (!$leadershipPosition) {
            return back()->with('error', 'You must hold an active portfolio to propose resolutions.');
        }
        
        // Generate resolution number
        $committee = Committee::findOrFail($validated['committee_id']);
        $count = Resolution::where('committee_id', $committee->id)->count() + 1;
        $resolutionNumber = strtoupper($committee->slug) . '-' . date('Y') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
        
        $validated['resolution_number'] = $resolutionNumber;
        $validated['proposed_by'] = $leadershipPosition->id;
        $validated['proposed_date'] = now();
        $validated['status'] = 'draft';
        
        $resolution = Resolution::create($validated);
        
        return redirect()
            ->route($this->getRoutePrefix() . '.resolutions.show', $resolution)
            ->with('success', 'Resolution created successfully.');
    }

    /**
     * Display the specified resolution
     */
    public function show(Resolution $resolution)
    {
        $this->authorize('view', $resolution);
        
        $resolution->load([
            'committee.activeMembers.leadershipPosition.member',
            'proposer.member',
            'executor.member',
            'votes.committeeMember.leadershipPosition.member',
        ]);
        
        return Inertia::render('Resolutions/Show', [
            'resolution' => $resolution,
            'canVote' => $this->userCanVote($resolution),
            'hasVoted' => $this->userHasVoted($resolution),
        ]);
    }

    /**
     * Check if user can vote on this resolution
     */
    private function userCanVote(Resolution $resolution): bool
    {
        if ($resolution->status !== 'voting') {
            return false;
        }
        
        $user = auth()->user();
        $leadershipPosition = LeadershipPosition::where('member_id', $user->member->id ?? null)
            ->where('is_current', true)
            ->first();
        
        if (!$leadershipPosition) {
            return false;
        }
        
        return $resolution->committee->activeMembers()->where('leadership_position_id', $leadershipPosition->id)->exists();
    }

    /**
     * Check if user has already voted
     */
    private function userHasVoted(Resolution $resolution): bool
    {
        $user = auth()->user();
        $leadershipPosition = LeadershipPosition::where('member_id', $user->member->id ?? null)
            ->where('is_current', true)
            ->first();
        
        if (!$leadershipPosition) {
            return false;
        }
        
        $committeeMember = $resolution->committee->activeMembers()->where('leadership_position_id', $leadershipPosition->id)->first();
        
        if (!$committeeMember) {
            return false;
        }
        
        return $resolution->votes()->where('committee_member_id', $committeeMember->id)->exists();
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
     * Get resolution types for dropdown
     */
    private function getResolutionTypes(): array
    {
        return [
            'disciplinary' => 'Disciplinary',
            'administrative' => 'Administrative',
            'election' => 'Election',
            'financial' => 'Financial',
            'constitutional' => 'Constitutional',
            'general' => 'General',
        ];
    }

    /**
     * Get categories for dropdown
     */
    private function getCategories(): array
    {
        return [
            'member_suspension' => 'Member Suspension',
            'member_termination' => 'Member Termination',
            'transfer_approval' => 'Transfer Approval',
            'election_annulment' => 'Election Annulment',
            'portfolio_removal' => 'Portfolio Removal',
            'budget_approval' => 'Budget Approval',
            'policy_change' => 'Policy Change',
            'other' => 'Other',
        ];
    }

    /**
     * Open resolution for voting
     */
    public function openVoting(Resolution $resolution)
    {
        $this->authorize('update', $resolution);
        
        if ($resolution->status !== 'draft') {
            return back()->with('error', 'Only draft resolutions can be opened for voting.');
        }

        // Check authorization (proposer or committee chair)
        $user = auth()->user();
        $leadershipPosition = LeadershipPosition::where('member_id', $user->member->id ?? null)
            ->where('is_current', true)
            ->first();

        $isProposer = $leadershipPosition && $resolution->proposed_by === $leadershipPosition->id;
        $isChair = $leadershipPosition && $resolution->committee->activeMembers()
            ->where('leadership_position_id', $leadershipPosition->id)
            ->where('role', 'chair')
            ->exists();

        if (!$isProposer && !$isChair && $user->role !== 'super_admin') {
            return back()->with('error', 'Only the proposer or committee chair can open voting.');
        }

        $resolution->update([
            'status' => 'voting',
            'vote_scheduled_date' => now(),
        ]);

        return back()->with('success', 'Resolution ' . $resolution->resolution_number . ' is now open for voting.');
    }

    /**
     * Close voting and calculate results
     */
    public function closeVoting(Resolution $resolution)
    {
        $this->authorize('update', $resolution);
        
        if ($resolution->status !== 'voting') {
            return back()->with('error', 'Resolution is not currently in voting status.');
        }

        // Calculate quorum
        $committee = $resolution->committee;
        $totalMembers = $committee->activeMembers()->count();
        $votesReceived = $resolution->votes()->count();
        $quorumRequired = ceil($totalMembers * ($committee->quorum_percentage / 100));
        $quorumMet = $votesReceived >= $quorumRequired;

        if (!$quorumMet) {
            return back()->with('error', "Quorum not met. Required: {$quorumRequired}, Received: {$votesReceived}");
        }

        // Calculate result
        $totalVotes = $resolution->votes_for + $resolution->votes_against + $resolution->votes_abstain;
        $percentageFor = $totalVotes > 0 ? ($resolution->votes_for / $totalVotes) * 100 : 0;
        $passed = $percentageFor >= $committee->voting_threshold;

        $resolution->update([
            'status' => $passed ? 'passed' : 'rejected',
            'vote_conducted_date' => now(),
            'quorum_met' => $quorumMet,
        ]);

        $message = $passed 
            ? "Resolution {$resolution->resolution_number} has passed with {$percentageFor}% approval."
            : "Resolution {$resolution->resolution_number} has been rejected.";

        return back()->with('success', $message);
    }

    /**
     * Execute a passed resolution
     */
    public function execute(Request $request, Resolution $resolution)
    {
        $this->authorize('update', $resolution);
        
        $validated = $request->validate([
            'execution_notes' => 'required|string|max:1000',
        ]);

        if ($resolution->status !== 'passed') {
            return back()->with('error', 'Only passed resolutions can be executed.');
        }

        if ($resolution->executed_at) {
            return back()->with('error', 'Resolution has already been executed.');
        }

        // Check for active appeals
        if ($resolution->hasActiveAppeal()) {
            return back()->with('error', 'Execution is frozen due to an active appeal.');
        }

        // Get executor's leadership position
        $leadershipPosition = LeadershipPosition::where('member_id', auth()->user()->member->id ?? null)
            ->where('is_current', true)
            ->first();

        if (!$leadershipPosition) {
            return back()->with('error', 'You must hold an active portfolio to execute resolutions.');
        }

        $resolution->update([
            'executed_by' => $leadershipPosition->id,
            'executed_at' => now(),
            'execution_notes' => $validated['execution_notes'],
            'status' => 'executed',
        ]);

        return back()->with('success', 'Resolution ' . $resolution->resolution_number . ' has been executed.');
    }

    /**
     * Cancel a draft resolution
     */
    public function cancel(Resolution $resolution)
    {
        $this->authorize('delete', $resolution);
        
        if ($resolution->status !== 'draft') {
            return back()->with('error', 'Only draft resolutions can be cancelled.');
        }

        // Check authorization (only proposer can cancel)
        $user = auth()->user();
        $leadershipPosition = LeadershipPosition::where('member_id', $user->member->id ?? null)
            ->where('is_current', true)
            ->first();

        if (!$leadershipPosition || $resolution->proposed_by !== $leadershipPosition->id) {
            if ($user->role !== 'super_admin') {
                return back()->with('error', 'Only the proposer can cancel this resolution.');
            }
        }

        $resolution->delete();

        return redirect()
            ->route($this->getRoutePrefix() . '.resolutions.index')
            ->with('success', 'Resolution cancelled.');
    }
}

