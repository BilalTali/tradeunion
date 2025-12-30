<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\ElectionDelegate;
use App\Models\Member;
use App\Models\LeadershipPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElectionDelegateController extends Controller
{
    /**
     * Display delegates for an election
     */
    public function index(Election $election)
    {
        $delegates = $election->delegates()
            ->with('member.zone.district', 'nominatedBy')
            ->get()
            ->groupBy('delegate_type');

        return Inertia::render('Elections/Delegates/Index', [
            'election' => $election,
            'delegates' => $delegates,
        ]);
    }

    /**
     * Auto-populate delegates for all election levels
     */
    public function populate(Election $election)
    {
        $added = 0;

        // NEW: Use criteria-based population if criteria are set
        if ($election->voting_eligibility_criteria) {
            $eligibleMembers = $election->getEligibleVoters();
            
            foreach ($eligibleMembers as $member) {
                if (!$election->delegates()->where('member_id', $member->id)->exists()) {
                    ElectionDelegate::create([
                        'election_id' => $election->id,
                        'member_id' => $member->id,
                        'delegate_type' => 'criteria_based',
                    ]);
                    $added++;
                }
            }
            
            // Update count
            $election->update(['eligible_voters_count' => $added]);
            
            return back()->with('success', "Added {$added} delegates based on eligibility criteria.");
        }

        // FALLBACK: Old hardcoded logic for elections without criteria
        // ZONE ELECTION: Add all members in that zone
        if ($election->election_type === 'zonal_president') {
            $zoneMembers = Member::where('tehsil_id', $election->entity_id)
                ->where('status', 'approved') // Only approved members
                ->get();

            foreach ($zoneMembers as $member) {
                if (!$election->delegates()->where('member_id', $member->id)->exists()) {
                    ElectionDelegate::create([
                        'election_id' => $election->id,
                        'member_id' => $member->id,
                        'delegate_type' => 'zonal_president',
                    ]);
                    $added++;
                }
            }
        }

        // DISTRICT ELECTION: Add all Zone Presidents from tehsils in this district
        if ($election->election_type === 'district_president') {
            $zonalPresidents = LeadershipPosition::where('level', 'tehsil')
                ->where('position_title', 'President')
                ->where('is_current', true)
                ->whereHas('member.zone', fn($q) => $q->where('district_id', $election->entity_id))
                ->get();

            foreach ($zonalPresidents as $position) {
                if (!$election->delegates()->where('member_id', $position->member_id)->exists()) {
                    ElectionDelegate::create([
                        'election_id' => $election->id,
                        'member_id' => $position->member_id,
                        'delegate_type' => 'zonal_president',
                    ]);
                    $added++;
                }
            }
        }

        // STATE ELECTION: Add all District/Zone Presidents + Portfolio Holders
        if ($election->election_type === 'state_president') {
            // Add all Zonal Presidents
            $zonalPresidents = LeadershipPosition::where('level', 'tehsil')
                ->where('position_title', 'President')
                ->where('is_current', true)
                ->whereHas('member.zone.district', fn($q) => $q->where('state_id', $election->entity_id))
                ->get();

            foreach ($zonalPresidents as $position) {
                if (!$election->delegates()->where('member_id', $position->member_id)->exists()) {
                    ElectionDelegate::create([
                        'election_id' => $election->id,
                        'member_id' => $position->member_id,
                        'delegate_type' => 'zonal_president',
                    ]);
                    $added++;
                }
            }

            // Add all District Presidents
            $districtPresidents = LeadershipPosition::where('level', 'district')
                ->where('position_title', 'President')
                ->where('is_current', true)
                ->whereHas('member.zone.district', fn($q) => $q->where('state_id', $election->entity_id))
                ->get();

            foreach ($districtPresidents as $position) {
                if (!$election->delegates()->where('member_id', $position->member_id)->exists()) {
                    ElectionDelegate::create([
                        'election_id' => $election->id,
                        'member_id' => $position->member_id,
                        'delegate_type' => 'district_president',
                    ]);
                    $added++;
                }
            }

            // Add all portfolio holders (district and state level)
            $portfolioHolders = LeadershipPosition::whereIn('level', ['district', 'state'])
                ->where('position_title', '!=', 'President')
                ->where('is_current', true)
                ->get();

            foreach ($portfolioHolders as $position) {
                if (!$election->delegates()->where('member_id', $position->member_id)->exists()) {
                    ElectionDelegate::create([
                        'election_id' => $election->id,
                        'member_id' => $position->member_id,
                        'delegate_type' => 'portfolio_holder',
                    ]);
                    $added++;
                }
            }
        }

        return back()->with('success', "Added {$added} delegates to the election.");
    }

    /**
     * Nominate a delegate (for zone/district presidents to nominate members)
     */
    public function store(Request $request, Election $election)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'delegate_type' => 'required|in:zone_nominated,district_nominated',
        ]);

        // Check if already a delegate
        if ($election->delegates()->where('member_id', $validated['member_id'])->exists()) {
            return back()->with('error', 'This member is already a delegate.');
        }

        ElectionDelegate::create([
            'election_id' => $election->id,
            'member_id' => $validated['member_id'],
            'delegate_type' => $validated['delegate_type'],
            'nominated_by' => auth()->user()->member?->id,
        ]);

        return back()->with('success', 'Delegate nominated successfully.');
    }

    /**
     * Remove a delegate
     */
    public function destroy(Election $election, ElectionDelegate $delegate)
    {
        $delegate->delete();

        return back()->with('success', 'Delegate removed.');
    }
}

