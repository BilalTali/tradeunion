<?php

namespace App\Http\Controllers;

use App\Models\CommitteeElection;
use App\Models\CommitteeCandidate;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommitteeCandidateController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Show the nomination form
     */
    public function create(CommitteeElection $election)
    {
        $this->authorize('view', $election);
        
        // Check if nominations are open
        if (!$election->isNominationsOpen()) {
            return back()->withErrors(['error' => 'Nominations are not currently open.']);
        }
        
        // Get current user's member record
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();
        
        if (!$member) {
            return back()->withErrors(['error' => 'Member profile not found.']);
        }
        
        // Check if already nominated
        $existingNomination = CommitteeCandidate::where('committee_election_id', $election->id)
            ->where('member_id', $member->id)
            ->first();
        
        if ($existingNomination) {
            return back()->with('info', 'You have already submitted a nomination for this election.');
        }
        
        return Inertia::render('CommitteeCandidates/Nominate', [
            'election' => $election->load('committee'),
            'positions' => $this->getPositions($election),
        ]);
    }

    /**
     * Store a new nomination
     */
    public function store(Request $request, CommitteeElection $election)
    {
        $this->authorize('view', $election);
        
        // Check if nominations are open
        if (!$election->isNominationsOpen()) {
            return back()->withErrors(['error' => 'Nominations are not currently open.']);
        }
        
        $validated = $request->validate([
            'position_sought' => 'required|in:chair,vice_chair,secretary,treasurer,member',
            'nomination_statement' => 'required|string|max:2000',
            'manifesto_file' => 'nullable|file|mimes:pdf|max:5120', // 5MB max
        ]);
        
        // Get current user's member record
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();
        
        if (!$member) {
            return back()->withErrors(['error' => 'Member profile not found.']);
        }
        
        // Check if already nominated
        $existingNomination = CommitteeCandidate::where('committee_election_id', $election->id)
            ->where('member_id', $member->id)
            ->first();
        
        if ($existingNomination) {
            return back()->with('error', 'You have already submitted a nomination for this election.');
        }
        
        // Store manifesto file if provided
        $manifestoPath = null;
        if ($request->hasFile('manifesto_file')) {
            $manifestoPath = $request->file('manifesto_file')->store('committee-manifestos', 'public');
        }
        
        // Create nomination
        CommitteeCandidate::create([
            'committee_election_id' => $election->id,
            'member_id' => $member->id,
            'position_sought' => $validated['position_sought'],
            'nomination_statement' => $validated['nomination_statement'],
            'manifesto_file_path' => $manifestoPath,
            'status' => 'pending',
        ]);
        
        return redirect()
            ->route('committee-elections.show', $election)
            ->with('success', 'Nomination submitted successfully!');
    }

    /**
     * List pending candidates for approval
     */
    public function pending(CommitteeElection $election)
    {
        $this->authorize('manageStatus', $election);
        
        $pendingCandidates = $election->pendingCandidates()
            ->with('member')
            ->get();
        
        return Inertia::render('CommitteeCandidates/Pending', [
            'election' => $election->load('committee'),
            'candidates' => $pendingCandidates,
        ]);
    }

    /**
     * Approve a candidate
     */
    public function approve(CommitteeCandidate $candidate)
    {
        $this->authorize('manageStatus', $candidate->election);
        
        if ($candidate->status !== 'pending') {
            return back()->with('error', 'Can only approve pending candidates.');
        }
        
        $candidate->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);
        
        return back()->with('success', 'Candidate approved successfully.');
    }

    /**
     * Reject a candidate
     */
    public function reject(Request $request, CommitteeCandidate $candidate)
    {
        $this->authorize('manageStatus', $candidate->election);
        
        if ($candidate->status !== 'pending') {
            return back()->with('error', 'Can only reject pending candidates.');
        }
        
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);
        
        $candidate->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);
        
        return back()->with('success', 'Candidate rejected.');
    }

    /**
     * Get available positions
     */
    private function getPositions(CommitteeElection $election): array
    {
        if ($election->election_type === 'leadership') {
            return [
                'chair' => 'Chairperson',
                'vice_chair' => 'Vice Chairperson',
                'secretary' => 'Secretary',
                'treasurer' => 'Treasurer',
            ];
        }
        
        return [
            'member' => 'Committee Member',
        ];
    }
}

