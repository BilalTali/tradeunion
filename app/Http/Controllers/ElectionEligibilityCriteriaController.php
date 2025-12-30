<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\Member;
use App\Models\Tehsil;
use App\Models\District;
use App\Models\ElectionDelegate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElectionEligibilityCriteriaController extends Controller
{
    /**
     * Show eligibility criteria configuration page
     */
    public function index(Election $election)
    {
        // Get all tehsils and districts for filters
        $allTehsils = Tehsil::with('district')->get();
        $allDistricts = District::all();
        
        // Get unique designations from members
        $allDesignations = Member::distinct()->pluck('designation')->filter()->values();
        
        // Calculate preview counts
        $eligibleVotersPreview = $election->voting_eligibility_criteria 
            ? $election->getEligibleVoters()->count() 
            : 0;
            
        $eligibleCandidatesPreview = $election->candidacy_eligibility_criteria 
            ? $election->getEligibleCandidates()->count() 
            : 0;

        return Inertia::render('Elections/EligibilityCriteria/Index', [
            'election' => $election,
            'currentVotingCriteria' => $election->voting_eligibility_criteria ?? $this->getDefaultCriteria(),
            'currentCandidacyCriteria' => $election->candidacy_eligibility_criteria ?? $this->getDefaultCriteria(),
            'allTehsils' => $allTehsils,
            'allDistricts' => $allDistricts,
            'allDesignations' => $allDesignations,
            'eligibleVotersPreview' => $eligibleVotersPreview,
            'eligibleCandidatesPreview' => $eligibleCandidatesPreview,
        ]);
    }

    /**
     * Update voting eligibility criteria
     */
    public function updateVotingCriteria(Request $request, Election $election)
    {
        $validated = $request->validate([
            'criteria' => 'required|array',
            'criteria.min_age' => 'nullable|integer|min:18|max:100',
            'criteria.max_age' => 'nullable|integer|min:18|max:100',
            'criteria.min_service_years' => 'nullable|integer|min:0|max:50',
            'criteria.min_union_years' => 'nullable|integer|min:0|max:50',
            'criteria.star_grade_min' => 'nullable|integer|min:1|max:5',
            'criteria.star_grade_max' => 'nullable|integer|min:1|max:5',
            'criteria.required_designations' => 'nullable|array',
            'criteria.excluded_designations' => 'nullable|array',
            'criteria.require_leadership_position' => 'nullable|boolean',
            'criteria.identity_verified_required' => 'nullable|boolean',
            'criteria.specific_tehsils' => 'nullable|array',
            'criteria.specific_districts' => 'nullable|array',
        ]);

        $election->update([
            'voting_eligibility_criteria' => $validated['criteria'],
            'eligible_voters_count' => $election->getEligibleVoters()->count(),
        ]);

        return back()->with('success', 'Voting eligibility criteria updated successfully.');
    }

    /**
     * Update candidacy eligibility criteria
     */
    public function updateCandidacyCriteria(Request $request, Election $election)
    {
        $validated = $request->validate([
            'criteria' => 'required|array',
            'criteria.min_age' => 'nullable|integer|min:18|max:100',
            'criteria.max_age' => 'nullable|integer|min:18|max:100',
            'criteria.min_service_years' => 'nullable|integer|min:0|max:50',
            'criteria.min_union_years' => 'nullable|integer|min:0|max:50',
            'criteria.star_grade_min' => 'nullable|integer|min:1|max:5',
            'criteria.star_grade_max' => 'nullable|integer|min:1|max:5',
            'criteria.required_designations' => 'nullable|array',
            'criteria.excluded_designations' => 'nullable|array',
            'criteria.require_leadership_position' => 'nullable|boolean',
            'criteria.identity_verified_required' => 'nullable|boolean',
            'criteria.specific_tehsils' => 'nullable|array',
            'criteria.specific_districts' => 'nullable|array',
        ]);

        $election->update([
            'candidacy_eligibility_criteria' => $validated['criteria'],
            'eligible_candidates_count' => $election->getEligibleCandidates()->count(),
        ]);

        return back()->with('success', 'Candidacy eligibility criteria updated successfully.');
    }

    /**
     * Auto-populate delegates based on voting criteria
     */
    public function applyCriteria(Election $election)
    {
        if (!$election->voting_eligibility_criteria) {
            return back()->withErrors(['error' => 'Please set voting eligibility criteria first.']);
        }

        $added = 0;
        $skipped = 0;
        
        // Get eligible voters based on criteria
        $eligibleMembers = $election->getEligibleVoters();
        
        foreach ($eligibleMembers as $member) {
            // Check if already a delegate
            if ($election->delegates()->where('member_id', $member->id)->exists()) {
                $skipped++;
                continue;
            }
            
            // Add as delegate
            ElectionDelegate::create([
                'election_id' => $election->id,
                'member_id' => $member->id,
                'delegate_type' => 'criteria_based',
            ]);
            $added++;
        }
        
        // Update count
        $election->update(['eligible_voters_count' => $election->delegates()->count()]);
        
        return back()->with('success', "Added {$added} new delegates. {$skipped} were already delegates.");
    }

    /**
     * List eligible members with pagination and filters
     */
    public function listEligibleMembers(Request $request, Election $election)
    {
        $search = $request->input('search');
        $tehsilFilter = $request->input('tehsil_id');
        $eligibilityFilter = $request->input('eligibility'); // 'vote', 'contest', 'both', 'neither'
        
        // Start with members query
        $query = Member::query()->with(['tehsil.district', 'user']);
        
        // Filter by election level
        switch ($election->level) {
            case 'tehsil':
                $query->where('tehsil_id', $election->entity_id);
                break;
            case 'district':
                $query->whereHas('tehsil', fn($q) => $q->where('district_id', $election->entity_id));
                break;
            case 'state':
                $query->whereHas('tehsil.district', fn($q) => $q->where('state_id', $election->entity_id));
                break;
        }
        
        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('membership_id', 'like', "%{$search}%");
            });
        }
        
        // Tehsil filter
        if ($tehsilFilter) {
            $query->where('tehsil_id', $tehsilFilter);
        }
        
        $members = $query->paginate(50)->through(function($member) use ($election) {
            $canVote = $election->memberMeetsVotingCriteria($member);
            $canContest = $election->memberMeetsCandidacyCriteria($member);
            
            // Calculate dynamic fields
            $age = $member->dob ? \Carbon\Carbon::parse($member->dob)->age : null;
            $serviceYears = $member->service_join_year ? (now()->year - $member->service_join_year) : null;
            $unionYears = $member->union_join_date ? (int)round(\Carbon\Carbon::parse($member->union_join_date)->diffInYears(now())) : null;
            
            return [
                'id' => $member->id,
                'name' => $member->name,
                'membership_id' => $member->membership_id,
                'photo_path' => $member->photo_path,
                'tehsil' => $member->tehsil?->name,
                'district' => $member->tehsil?->district?->name,
                'age' => $age,
                'service_years' => $serviceYears,
                'union_years' => $unionYears,
                'star_grade' => $member->star_grade,
                'designation' => $member->designation,
                'can_vote' => $canVote,
                'can_contest' => $canContest,
                'status' => $member->status,
            ];
        });
        
        // Apply eligibility filter after mapping
        if ($eligibilityFilter) {
            $members->getCollection()->filter(function($member) use ($eligibilityFilter) {
                return match($eligibilityFilter) {
                    'vote' => $member['can_vote'],
                    'contest' => $member['can_contest'],
                    'both' => $member['can_vote'] && $member['can_contest'],
                    'neither' => !$member['can_vote'] && !$member['can_contest'],
                    default => true,
                };
            });
        }

        return Inertia::render('Elections/EligibilityCriteria/MembersList', [
            'election' => $election,
            'members' => $members,
            'filters' => [
                'search' => $search,
                'tehsil_id' => $tehsilFilter,
                'eligibility' => $eligibilityFilter,
            ],
            'tehsils' => Tehsil::all(),
        ]);
    }

    /**
     * Get default criteria structure
     */
    private function getDefaultCriteria()
    {
        return [
            'min_age' => null,
            'max_age' => null,
            'min_service_years' => null,
            'min_union_years' => null,
            'star_grade_min' => null,
            'star_grade_max' => null,
            'required_status' => [], // Empty by default - EC can specify if needed
            'required_designations' => [],
            'excluded_designations' => [],
            'require_leadership_position' => false,
            'identity_verified_required' => false,
            'specific_tehsils' => [],
            'specific_districts' => [],
        ];
    }
}
