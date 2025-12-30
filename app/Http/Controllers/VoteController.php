<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\Member;
use App\Models\VoterSlip;
use App\Models\VoteOtp;
use App\Models\ElectionDelegate;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class VoteController extends Controller
{
    use AuthorizesRequests;

    /**
     * Request OTP for voting
     */
    public function requestOtp(Request $request, Election $election)
    {
        $this->authorize('view', $election);
        
        // Check if voting is open
        if ($election->status !== 'voting_open') {
            return response()->json(['error' => 'Voting is not open'], 403);
        }

        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return response()->json(['error' => 'Member record not found'], 404);
        }

        // Check if eligible delegate
        $isDelegate = ElectionDelegate::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        if (!$isDelegate) {
            // Also check if they meet voting criteria (in case delegates haven't been populated)
            if (!$election->voting_eligibility_criteria || !$election->memberMeetsVotingCriteria($member)) {
                return response()->json(['error' => 'Not eligible to vote'], 403);
            }
        }

        // Check if already voted
        $hasVoted = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        if ($hasVoted) {
            return response()->json(['error' => 'Already voted'], 403);
        }

        // Generate 6-digit OTP
        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Save OTP
        VoteOtp::create([
            'election_id' => $election->id,
            'member_id' => $member->id,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);

        // Send Email OTP
        try {
            \Illuminate\Support\Facades\Log::info("Sending OTP to: " . $user->email);
            \Illuminate\Support\Facades\Log::info("Mail Config: " . config('mail.default'));
            
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\VotingOtpMail($otp));
            \Illuminate\Support\Facades\Log::info("OTP Email sent successfully to " . $user->email);
            $sent = true;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('OTP Email failed: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            $sent = false;
        }

        if (!$sent) {
            return response()->json(['error' => 'Failed to send OTP: ' . (isset($e) ? $e->getMessage() : 'Unknown error')], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your registered email address',
            'expires_in' => 300, // 5 minutes in seconds
            'debug_otp' => config('app.debug') ? $otp : null, // expose OTP in dev mode
        ]);
    }

    /**
     * Verify OTP before showing voting page
     */
    public function verifyOtp(Request $request, Election $election)
    {
        $this->authorize('view', $election);
        
        $validated = $request->validate([
            'otp' => 'required|digits:6',
        ]);

        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return response()->json(['error' => 'Member not found'], 404);
        }

        // Find OTP record
        $voteOtp = VoteOtp::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->where('otp', $validated['otp'])
            ->where('is_verified', false)
            ->latest()
            ->first();

        if (!$voteOtp) {
            return response()->json(['error' => 'Invalid OTP'], 400);
        }

        // Check if expired
        if ($voteOtp->expires_at < now()) {
            return response()->json(['error' => 'OTP expired'], 400);
        }

        // Check attempts
        if ($voteOtp->attempts >= 3) {
            return response()->json(['error' => 'Maximum attempts exceeded'], 400);
        }

        // Increment attempts
        $voteOtp->increment('attempts');

        // Verify OTP matches
        if ($voteOtp->otp !== $validated['otp']) {
            return response()->json(['error' => 'Invalid OTP'], 400);
        }

        // Mark as verified
        $voteOtp->update(['is_verified' => true]);

        return response()->json([
            'success' => true,
            'verified' => true,
            'message' => 'OTP verified successfully',
        ]);
    }


    /**
     * Display voting interface
     */
    public function show(Election $election)
    {
        $this->authorize('view', $election);
        
        // Check if voting is open
        if ($election->status !== 'voting_open') {
            return back()->withErrors(['error' => 'Voting is not currently open for this election.']);
        }

        if (!$election->isVotingOpen()) {
            return back()->withErrors(['error' => 'Voting period has ended.']);
        }

        // Get current user's member record
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return back()->withErrors(['error' => 'Member profile not found.']);
        }

        // Check if user is eligible to vote (delegates OR criteria check)
        $isDelegate = ElectionDelegate::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        if (!$isDelegate) {
            // Also check if they meet voting criteria (in case delegates haven't been populated)
            if (!$election->voting_eligibility_criteria || !$election->memberMeetsVotingCriteria($member)) {
                return back()->withErrors(['error' => 'You are not eligible to vote in this election.']);
            }
        }

        // Check if already voted
        $hasVoted = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        if ($hasVoted) {
            return redirect()->route('elections.show', $election)
                ->with('info', 'You have already cast your vote in this election.');
        }

        // Get approved candidates
        $candidates = $election->approvedCandidates()
            ->with('member')
            ->get();

        // Get voter slip for this member
        $voterSlip = VoterSlip::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->where('is_used', false)
            ->first();

        // Check if member has already voted
        $hasVoted = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        return Inertia::render('Elections/Vote', [
            'election' => $election,
            'candidates' => $candidates,
            'voterSlip' => $voterSlip,
            'hasVoted' => $hasVoted,
        ]);
    }

    /**
     * Submit vote
     */
    public function vote(Request $request, Election $election)
    {
        $this->authorize('view', $election);
        
        // Validate request
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'live_photo' => 'required|image|max:5120', // 5MB max
        ]);

        // Check if voting is open
        if ($election->status !== 'voting_open' || !$election->isVotingOpen()) {
            return back()->withErrors(['error' => 'Voting is closed.']);
        }

        // Get current user's member record
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return back()->withErrors(['error' => 'Member profile not found.']);
        }

        // Check if OTP was verified recently (within last 10 minutes)
        $otpVerified = VoteOtp::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->where('is_verified', true)
            ->where('created_at', '>', now()->subMinutes(10))
            ->exists();

        if (!$otpVerified) {
            return back()->withErrors(['error' => 'OTP verification required or expired.']);
        }

        // Verify candidate belongs to this election
        $candidate = Candidate::findOrFail($validated['candidate_id']);
        if ($candidate->election_id !== $election->id) {
            return back()->withErrors(['error' => 'Invalid candidate selection.']);
        }

        if ($candidate->status !== 'approved') {
            return back()->withErrors(['error' => 'Cannot vote for unapproved candidate.']);
        }

        // Check if already voted (double check)
        $existingVote = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->first();

        if ($existingVote) {
            return back()->withErrors(['error' => 'You have already voted in this election.']);
        }

        try {
            // Store live photo
            if (!$request->hasFile('live_photo')) {
                throw new \Exception('Live photo not found in request');
            }
            $photoPath = $request->file('live_photo')->store('election-votes', 'public');

            // Record vote with PENDING verification status
            $vote = Vote::create([
                'election_id' => $election->id,
                'member_id' => $member->id,
                'candidate_id' => $candidate->id,
                'live_photo_path' => $photoPath,
                'verification_status' => 'pending',
                'vote_hash' => hash('sha256', $election->id . $member->id . $candidate->id . now()),
                'ip_address' => $request->ip(),
            ]);

            \Illuminate\Support\Facades\Log::info("Vote Created: " . $vote->id);

            // DO NOT increment vote_count yet - wait for EC verification

            return redirect()->route('elections.show', $election)
                ->with('success', 'Vote submitted successfully! Pending Election Commission verification.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Vote submission failed: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Vote submission failed: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            // Return JSON so axios knows it failed
            return response()->json([
                'message' => 'Vote failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if member has voted
     */
    public function hasVoted(Election $election)
    {
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return response()->json(['has_voted' => false]);
        }

        $hasVoted = Vote::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->exists();

        return response()->json(['has_voted' => $hasVoted]);
    }
}
