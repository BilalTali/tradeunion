<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VotingController extends Controller
{
    /**
     * Display ballot for election
     */
    public function ballot(Election $election)
    {
        $member = auth()->user()->member;

        // Check if election is in voting period
        if ($election->status !== 'voting_open') {
            return back()->with('error', 'Voting is not currently open for this election.');
        }

        // Check if voting period is active
        if (now()->lt($election->voting_start) || now()->gt($election->voting_end)) {
            return back()->with('error', 'Voting period has not started or has ended.');
        }

        // Check eligibility based on election level
        if (!$this->isEligibleVoter($election, $member)) {
            return back()->with('error', 'You are not eligible to vote in this election.');
        }

        // Check if already voted
        $hasVoted = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        if ($hasVoted) {
            return back()->with('error', 'You have already cast your vote in this election.');
        }

        // Get approved candidates
        $candidates = $election->approvedCandidates()
            ->with('member.zone.district')
            ->get()
            ->groupBy('position_title');

        return Inertia::render('Elections/Ballot', [
            'election' => $election,
            'candidates' => $candidates,
            'member' => $member,
        ]);
    }

    /**
     * Submit votes
     */
    public function vote(Request $request, Election $election)
    {
        $member = auth()->user()->member;

        // Validate voting period and eligibility
        if ($election->status !== 'voting_open') {
            return back()->with('error', 'Voting is not currently open.');
        }

        if (!$this->isEligibleVoter($election, $member)) {
            return back()->with('error', 'You are not eligible to vote in this election.');
        }

        // Check if already voted
        if (Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists()) {
            return back()->with('error', 'You have already voted in this election.');
        }

        // Validate votes
        $validated = $request->validate([
            'votes' => 'required|array|min:1',
            'votes.*' => 'required|exists:candidates,id',
        ]);

        DB::transaction(function () use ($election, $member, $validated) {
            foreach ($validated['votes'] as $candidateId) {
                $candidate = Candidate::findOrFail($candidateId);

                // Ensure candidate belongs to this election
                if ($candidate->election_id !== $election->id) {
                    throw new \Exception('Invalid candidate for this election');
                }

                // Create vote with hash
                $voteHash = $this->generateVoteHash($election->id, $member->id, $candidateId);

                Vote::create([
                    'election_id' => $election->id,
                    'member_id' => $member->id,
                    'candidate_id' => $candidateId,
                    'vote_hash' => $voteHash,
                    'ip_address' => request()->ip(),
                ]);

                // Increment candidate vote count
                $candidate->increment('vote_count');
            }
        });

        return redirect()->route('elections.show', $election)
            ->with('success', 'Your vote has been successfully recorded. Thank you for participating!');
    }

    /**
     * Check if member is eligible to vote in election
     * Based on election_type:
     * - zonal_president: All active members in that zone
     * - district_president: Zonal Presidents + Zone-nominated delegates
     * - state_president: All Zonal/District Presidents + Portfolio Holders
     */
    protected function isEligibleVoter(Election $election, $member)
    {
        // Must be active member
        if (!$member || $member->status !== 'active') {
            return false;
        }

        switch ($election->election_type) {
            case 'zonal_president':
                // All active members in the zone can vote
                return $member->tehsil_id == $election->entity_id;

            case 'district_president':
            case 'state_president':
                // Only delegates registered for this election can vote
                return $election->delegates()
                    ->where('member_id', $member->id)
                    ->exists();

            default:
                return false;
        }
    }

    /**
     * Generate vote hash for verification
     */
    protected function generateVoteHash($electionId, $memberId, $candidateId)
    {
        $data = implode('|', [$electionId, $memberId, $candidateId, now()->timestamp]);
        return hash('sha256', $data);
    }

    /**
     * Show voting status/results
     */
    public function status(Election $election)
    {
        $member = auth()->user()->member;

        $hasVoted = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        $totalVotes = Vote::where('election_id', $election->id)->count();
        
        $eligibleVotersCount = $this->getEligibleVotersCount($election);

        return Inertia::render('Elections/VotingStatus', [
            'election' => $election,
            'hasVoted' => $hasVoted,
            'totalVotes' => $totalVotes,
            'eligibleVoters' => $eligibleVotersCount,
            'turnoutPercentage' => $eligibleVotersCount > 0 
                ? round(($totalVotes / $eligibleVotersCount) * 100, 2) 
                : 0,
        ]);
    }

    /**
     * Get count of eligible voters for an election
     */
    protected function getEligibleVotersCount(Election $election)
    {
        $query = \App\Models\Member::where('status', 'active');

        switch ($election->level) {
            case 'tehsil':
                $query->where('tehsil_id', $election->entity_id);
                break;
            case 'district':
                $query->whereHas('tehsil', fn($q) => $q->where('district_id', $election->entity_id));
                break;
            case 'state':
                $query->whereHas('zone.district', fn($q) => $q->where('state_id', $election->entity_id));
                break;
        }

        return $query->count();
    }
}

