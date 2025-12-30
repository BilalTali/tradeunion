<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Election;
use App\Http\Controllers\Traits\HasPortfolioAuthorization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class VoteVerificationController extends Controller
{
    use AuthorizesRequests, HasPortfolioAuthorization;

    /**
     * Display pending votes for verification
     */
    public function pending(Election $election)
    {
        // $this->authorizePortfolio(
        //     'vote.verify',
        //     'read',
        //     $election->level,
        //     $election,
        //     'View pending votes'
        // );

        // Get pending votes with member and candidate details
        $pendingVotes = Vote::where('election_id', $election->id)
            ->where('verification_status', 'pending')
            ->with(['member', 'candidate.member'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Elections/Votes/Verify', [
            'election' => $election,
            'pendingVotes' => $pendingVotes,
        ]);
    }

    /**
     * Approve a vote after photo verification
     */
    public function approve(Vote $vote)
    {
        // Use portfolio authorization
        $this->authorizePortfolio(
            'vote.approve',
            'execute',
            $vote->election->level,
            $vote,
            'EC action - vote approval'
        );

        // Check if already verified
        if ($vote->verification_status !== 'pending') {
            return back()->withErrors(['error' => 'Vote already processed.']);
        }

        // Approve vote
        $vote->update([
            'verification_status' => 'verified',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        // NOW increment candidate vote count
        $vote->candidate->increment('vote_count');

        return back()->with('success', 'Vote approved and counted.');
    }

    /**
     * Reject a vote with reason
     */
    public function reject(Request $request, Vote $vote)
    {
        // Use portfolio authorization
        $this->authorizePortfolio(
            'vote.reject',
            'execute',
            $vote->election->level,
            $vote,
            'EC action - vote rejection'
        );

        $validated = $request->validate([
            'reason' => 'required|string|min:10',
        ]);

        // Check if already verified
        if ($vote->verification_status !== 'pending') {
            return back()->withErrors(['error' => 'Vote already processed.']);
        }

        // Reject vote
        $vote->update([
            'verification_status' => 'rejected',
            'rejection_reason' => $validated['reason'],
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        // Do NOT increment vote count for rejected votes

        return back()->with('success', 'Vote rejected.');
    }
}
