<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Election;
use App\Models\Member;
use App\Http\Controllers\Traits\HasPortfolioAuthorization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CandidateController extends Controller
{
    use AuthorizesRequests, HasPortfolioAuthorization;

    /**
     * Show nomination form
     */
    public function create(Election $election)
    {
        $this->authorize('view', $election);
        
        // Check if nominations are open
        if ($election->status !== 'nominations_open') {
            return redirect()->route($this->getRoutePrefix(auth()->user()) . '.elections.show', $election)
                ->withErrors(['error' => 'Nominations are not currently open.']);
        }

        return Inertia::render('Elections/Nominate', [
            'election' => $election,
        ]);
    }

    /**
     * File nomination for election (Member action)
     */
    public function store(Request $request, Election $election)
    {
        $this->authorize('view', $election);
        
        \Illuminate\Support\Facades\Log::info('Nomination attempt started', ['user_id' => auth()->id(), 'election_id' => $election->id]);

        // 1. Check if nominations are open
        if ($election->status !== 'nominations_open') {
            \Illuminate\Support\Facades\Log::warning('Nominations not open status check failed', ['status' => $election->status]);
            return back()->withErrors(['error' => 'Nominations are not currently open for this election.']);
        }

        if (!$election->isNominationsOpen()) {
            \Illuminate\Support\Facades\Log::warning('Nominations period check failed', ['start' => $election->nomination_start, 'end' => $election->nomination_end]);
            return back()->withErrors(['error' => 'Nomination period has ended.']);
        }

        // 2. Get current user's member record
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            \Illuminate\Support\Facades\Log::error('Member profile not found for user', ['user_id' => $user->id]);
            return back()->withErrors(['error' => 'Member profile not found.']);
        }

        // 3. Check eligibility based on election level
        if (!$this->isEligibleToNominate($member, $election)) {
            \Illuminate\Support\Facades\Log::warning('Member not eligible to nominate', ['member_id' => $member->id]);
            return back()->withErrors(['error' => 'You are not eligible to nominate for this election.']);
        }

        // 4. Validate request
        try {
            $validated = $request->validate([
                'position_title' => 'required|string|max:255',
                'vision_statement' => 'required|string|min:50',
                'qualifications' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
             \Illuminate\Support\Facades\Log::warning('Nomination validation failed', ['errors' => $e->errors()]);
             throw $e;
        }

        // 5. Check for duplicate nomination
        $existing = Candidate::where('election_id', $election->id)
            ->where('member_id', $member->id)
            ->where('position_title', $validated['position_title'])
            ->first();

        if ($existing) {
             \Illuminate\Support\Facades\Log::warning('Duplicate nomination attempt', ['member_id' => $member->id]);
            return back()->withErrors(['error' => 'You have already filed a nomination for this position.']);
        }

        // 6. Create candidate record
        Candidate::create([
            'election_id' => $election->id,
            'member_id' => $member->id,
            'position_title' => $validated['position_title'],
            'vision_statement' => $validated['vision_statement'],
            'qualifications' => $validated['qualifications'],
            'status' => 'pending',
        ]);
        
        \Illuminate\Support\Facades\Log::info('Nomination created successfully');

        return redirect()->route($this->getRoutePrefix(auth()->user()) . '.elections.show', $election)
            ->with('success', 'Nomination filed successfully. Awaiting approval from Election Commission.');
    }

    /**
     * Get route prefix based on user role
     */
    private function getRoutePrefix($user): string
    {
        $role = $user->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district') && !str_contains($role, 'member')) return 'district';
        if (str_contains($role, 'tehsil') && !str_contains($role, 'member')) return 'tehsil';
        return 'member';
    }

    /**
     * List ALL pending candidates across all elections for EC review
     */
    public function allPending()
    {
        $user = auth()->user();
        
        // Get user's level and entity from portfolio
        $service = app(\App\Services\PortfolioPermissionService::class);
        $activePosition = $service->getActivePosition($user->member);
        
        if (!$activePosition) {
            abort(403, 'No active portfolio position found');
        }
        
        $level = $activePosition->level;
        $entityId = $activePosition->entity_id;
        
        // Get all elections for this level/entity
        $elections = Election::where('level', $level)
            ->where('entity_id', $entityId)
            ->get();
        
        // Get all pending candidates for these elections
        $candidates = Candidate::whereIn('election_id', $elections->pluck('id'))
            ->where('status', 'pending')
            ->with(['member', 'election'])
            ->orderBy('created_at', 'asc')
            ->get();
        
        return Inertia::render('Elections/Candidates/ReviewAll', [
            'candidates' => $candidates,
            'level' => $level,
        ]);
    }

    /**
     * List pending candidates for EC review (election-specific)
     */
    public function pending(Election $election)
    {
        // Use portfolio authorization (EC members can review candidates)
        $this->authorizePortfolio(
            'candidate.review', // EC members need this permission to review
            'read',
            $election->level,
            $election,
            'EC action - view pending candidates'
        );

        $candidates = $election->pendingCandidates()
            ->with('member')
            ->get();

        return Inertia::render('Elections/Candidates/Review', [
            'election' => $election,
            'candidates' => $candidates,
        ]);
    }

    /**
     * Approve candidate (EC action)
     */
    public function approve(Candidate $candidate)
    {
        $election = $candidate->election;
        
        // Use portfolio authorization
        $this->authorizePortfolio(
            'candidate.approve',
            'execute',
            $election->level,
            $candidate,
            'EC action - candidate approval'
        );

        if ($candidate->status !== 'pending') {
            return back()->withErrors(['error' => 'Candidate has already been processed.']);
        }

        $candidate->update(['status' => 'approved']);

        // TODO: Notify candidate of approval

        return back()->with('success', 'Candidate approved successfully.');
    }

    /**
     * Reject candidate (EC action)
     */
    public function reject(Request $request, Candidate $candidate)
    {
        $election = $candidate->election;
        
        // Use portfolio authorization
        $this->authorizePortfolio(
            'candidate.reject',
            'execute',
            $election->level,
            $candidate,
            'EC action - candidate rejection'
        );

        if ($candidate->status !== 'pending') {
            return back()->withErrors(['error' => 'Candidate has already been processed.']);
        }

        $reason = $request->input('rejection_reason', 'Not specified');
        
        $candidate->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        // TODO: Notify candidate of rejection

        return back()->with('success', 'Candidate rejected.');
    }

    /**
     * Check if member is eligible to nominate for election
     */
    private function isEligibleToNominate(Member $member, Election $election): bool
    {
        // NEW: If candidacy criteria are set, use them
        if ($election->candidacy_eligibility_criteria) {
            return $election->memberMeetsCandidacyCriteria($member);
        }

        // FALLBACK: Use old hardcoded logic for elections without criteria
        // Tehsil election: member must be from that tehsil
        if ($election->level === 'tehsil') {
            return $member->tehsil_id === $election->entity_id;
        }

        // District election: member must be a zone president in that district
        if ($election->level === 'district') {
            // Check if member is a current zone president
            $isZonePresident = \App\Models\LeadershipPosition::where('member_id', $member->id)
                ->where('is_current', true)
                ->whereHas('portfolio', function($query) {
                    $query->where('name', 'like', '%President%')
                        ->where('level', 'zone');
                })
                ->exists();

            if (!$isZonePresident) {
                return false;
            }

            // Check if their tehsil belongs to the election's district
            return $member->tehsil && $member->tehsil->district_id === $election->entity_id;
        }

        // State election: member must be a district president
        if ($election->level === 'state') {
            return \App\Models\LeadershipPosition::where('member_id', $member->id)
                ->where('is_current', true)
                ->whereHas('portfolio', function($query) {
                    $query->where('name', 'like', '%President%')
                        ->where('level', 'district');
                })
                ->exists();
        }

        return false;
    }
}
