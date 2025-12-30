<?php

namespace App\Http\Controllers;

use App\Models\Resolution;
use App\Models\ResolutionVote;
use App\Models\CommitteeMember;
use App\Models\LeadershipPosition;
use Illuminate\Http\Request;

class ResolutionVoteController extends Controller
{
    /**
     * Cast a vote on a resolution
     */
    public function store(Request $request, Resolution $resolution)
    {
        $validated = $request->validate([
            'vote' => 'required|in:for,against,abstain',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check resolution is in voting status
        if ($resolution->status !== 'voting') {
            return back()->with('error', 'Resolution is not open for voting.');
        }

        // Get user's leadership position
        $leadershipPosition = LeadershipPosition::where('member_id', auth()->user()->member->id ?? null)
            ->where('is_current', true)
            ->first();

        if (!$leadershipPosition) {
            return back()->with('error', 'You must hold an active portfolio to vote.');
        }

        // Check if user is a committee member
        $committeeMember = CommitteeMember::where('committee_id', $resolution->committee_id)
            ->where('leadership_position_id', $leadershipPosition->id)
            ->where('is_active', true)
            ->first();

        if (!$committeeMember) {
            return back()->with('error', 'You are not a member of this committee.');
        }

        // Check if already voted
        $existingVote = ResolutionVote::where('resolution_id', $resolution->id)
            ->where('committee_member_id', $committeeMember->id)
            ->first();

        if ($existingVote) {
            return back()->with('error', 'You have already cast your vote on this resolution.');
        }

        // Cast vote
        ResolutionVote::create([
            'resolution_id' => $resolution->id,
            'committee_member_id' => $committeeMember->id,
            'vote' => $validated['vote'],
            'vote_cast_at' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update vote tallies
        $this->updateVoteTallies($resolution);

        return back()->with('success', 'Your vote has been recorded.');
    }

    /**
     * Get voting statistics for a resolution
     */
    public function stats(Resolution $resolution)
    {
        $committee = $resolution->committee;
        $totalMembers = $committee->activeMembers()->count();
        $votesReceived = $resolution->votes()->count();
        
        $quorumRequired = ceil($totalMembers * ($committee->quorum_percentage / 100));
        $quorumMet = $votesReceived >= $quorumRequired;

        $totalVotes = $resolution->votes_for + $resolution->votes_against + $resolution->votes_abstain;
        $percentageFor = $totalVotes > 0 ? ($resolution->votes_for / $totalVotes) * 100 : 0;
        $percentageAgainst = $totalVotes > 0 ? ($resolution->votes_against / $totalVotes) * 100 : 0;

        return response()->json([
            'total_members' => $totalMembers,
            'votes_received' => $votesReceived,
            'quorum_required' => $quorumRequired,
            'quorum_met' => $quorumMet,
            'votes_for' => $resolution->votes_for,
            'votes_against' => $resolution->votes_against,
            'votes_abstain' => $resolution->votes_abstain,
            'percentage_for' => round($percentageFor, 2),
            'percentage_against' => round($percentageAgainst, 2),
            'voting_threshold' => $committee->voting_threshold,
        ]);
    }

    /**
     * Update vote tallies on resolution
     */
    private function updateVoteTallies(Resolution $resolution)
    {
        $votes = $resolution->votes;
        
        $votesFor = $votes->where('vote', 'for')->count();
        $votesAgainst = $votes->where('vote', 'against')->count();
        $votesAbstain = $votes->where('vote', 'abstain')->count();

        $resolution->update([
            'votes_for' => $votesFor,
            'votes_against' => $votesAgainst,
            'votes_abstain' => $votesAbstain,
        ]);
    }
}
