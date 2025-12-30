<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Election extends Model
{
    protected $fillable = [
        'level',
        'entity_id',
        'title',
        'description',
        'nomination_start',
        'nomination_end',
        'voting_start',
        'voting_end',
        'status',
        'election_type',
        'voting_eligibility_criteria',
        'candidacy_eligibility_criteria',
        'eligible_voters_count',
        'eligible_candidates_count',
    ];

    protected $casts = [
        'nomination_start' => 'datetime',
        'nomination_end' => 'datetime',
        'voting_start' => 'datetime',
        'voting_end' => 'datetime',
        'voting_eligibility_criteria' => 'array',
        'candidacy_eligibility_criteria' => 'array',
    ];

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function results()
    {
        return $this->hasMany(ElectionResult::class);
    }

    public function commission()
    {
        return $this->hasMany(ElectionCommission::class);
    }

    public function delegates()
    {
        return $this->hasMany(ElectionDelegate::class);
    }

    public function voterSlips()
    {
        return $this->hasMany(VoterSlip::class);
    }

    public function approvedCandidates()
    {
        return $this->candidates()->where('status', 'approved');
    }

    public function pendingCandidates()
    {
        return $this->candidates()->where('status', 'pending');
    }

    /**
     * Check if nominations are open
     */
    public function isNominationsOpen()
    {
        return $this->status === 'nominations_open';
    }

    /**
     * Check if voting is open
     */
    public function isVotingOpen()
    {
        return $this->status === 'voting_open';
    }

    /**
     * Get the entity (Tehsil, District, or State) for this election
     */
    public function entity()
    {
        return match($this->level) {
            'tehsil' => Tehsil::find($this->entity_id),
            'district' => District::find($this->entity_id),
            'state' => State::find($this->entity_id),
            default => null,
        };
    }

    /**
     * Get all members who meet voting eligibility criteria
     */
    public function getEligibleVoters()
    {
        if (!$this->voting_eligibility_criteria) {
            // No criteria set  - use old delegate logic fallback
            return collect();
        }

        return $this->filterMembersByCriteria($this->voting_eligibility_criteria);
    }

    /**
     * Get all members who meet candidacy eligibility criteria
     */
    public function getEligibleCandidates()
    {
        if (!$this->candidacy_eligibility_criteria) {
            // No criteria set - return empty
            return collect();
        }

        return $this->filterMembersByCriteria($this->candidacy_eligibility_criteria);
    }

    /**
     * Check if a specific member meets voting criteria
     */
    public function memberMeetsVotingCriteria(Member $member): bool
    {
        if (!$this->voting_eligibility_criteria) {
            return false;
        }

        return $this->memberMeetsCriteria($member, $this->voting_eligibility_criteria);
    }

    /**
     * Check if a specific member meets candidacy criteria
     */
    public function memberMeetsCandidacyCriteria(Member $member): bool
    {
        if (!$this->candidacy_eligibility_criteria) {
            return false;
        }

        return $this->memberMeetsCriteria($member, $this->candidacy_eligibility_criteria);
    }

    /**
     * Filter members by given criteria
     */
    private function filterMembersByCriteria(array $criteria)
    {
        $query = Member::query();

        // Filter by election level
        switch ($this->level) {
            case 'tehsil':
                $query->where('tehsil_id', $this->entity_id);
                break;
            case 'district':
                $query->whereHas('tehsil', fn($q) => $q->where('district_id', $this->entity_id));
                break;
            case 'state':
                $query->whereHas('tehsil.district', fn($q) => $q->where('state_id', $this->entity_id));
                break;
        }

        // Apply criteria filters
        $query = $this->applyCriteriaToQuery($query, $criteria);

        return $query->with('tehsil.district')->get();
    }

    /**
     * Check if individual member meets criteria
     */
    private function memberMeetsCriteria(Member $member, array $criteria): bool
    {
        // Check status - only if explicitly required
        if (isset($criteria['required_status']) && !empty($criteria['required_status'])) {
            // If member has no status or doesn't match required, reject
            if (!$member->status || !in_array($member->status, (array)$criteria['required_status'])) {
                return false;
            }
        }

        // Check age
        if (isset($criteria['min_age']) && $criteria['min_age']) {
            $age = $this->calculateAge($member->dob);
            if ($age < $criteria['min_age']) {
                return false;
            }
        }

        if (isset($criteria['max_age']) && $criteria['max_age']) {
            $age = $this->calculateAge($member->dob);
            if ($age > $criteria['max_age']) {
                return false;
            }
        }

        // Check service years - only if member has data
        if (isset($criteria['min_service_years']) && $criteria['min_service_years']) {
            // Skip check if member doesn't have service join year
            if ($member->service_join_year) {
                $serviceYears = $this->calculateServiceYears($member->service_join_year);
                if ($serviceYears < $criteria['min_service_years']) {
                    return false;
                }
            }
            // If no service data, pass this check (treat as N/A)
        }

        // Check union years - only if member has data
        if (isset($criteria['min_union_years']) && $criteria['min_union_years']) {
            // Skip check if member doesn't have union join date
            if ($member->union_join_date) {
                $unionYears = $this->calculateUnionYears($member->union_join_date);
                if ($unionYears < $criteria['min_union_years']) {
                    return false;
                }
            }
            // If no union data, pass this check (treat as N/A)
        }

        // Check star grade
        if (isset($criteria['star_grade_min']) && $criteria['star_grade_min']) {
            if ($member->star_grade < $criteria['star_grade_min']) {
                return false;
            }
        }

        if (isset($criteria['star_grade_max']) && $criteria['star_grade_max']) {
            if ($member->star_grade > $criteria['star_grade_max']) {
                return false;
            }
        }

        // Check designation
        if (isset($criteria['required_designations']) && !empty($criteria['required_designations'])) {
            if (!in_array($member->designation, $criteria['required_designations'])) {
                return false;
            }
        }

        if (isset($criteria['excluded_designations']) && !empty($criteria['excluded_designations'])) {
            if (in_array($member->designation, $criteria['excluded_designations'])) {
                return false;
            }
        }

        // Check leadership position
        if (isset($criteria['require_leadership_position']) && $criteria['require_leadership_position']) {
            $hasLeadership = $member->leadershipPositions()->where('is_current', true)->exists();
            if (!$hasLeadership) {
                return false;
            }
        }

        // Check identity verification
        if (isset($criteria['identity_verified_required']) && $criteria['identity_verified_required']) {
            if (!$member->isIdentityVerified()) {
                return false;
            }
        }

        // All checks passed
        return true;
    }

    /**
     * Apply criteria to query builder
     */
    private function applyCriteriaToQuery($query, array $criteria)
    {
        // Status filter
        if (isset($criteria['required_status']) && !empty($criteria['required_status'])) {
            $query->whereIn('status', (array)$criteria['required_status']);
        }

        // Age filter
        if (isset($criteria['min_age']) && $criteria['min_age']) {
            $maxDob = now()->subYears($criteria['min_age'])->format('Y-m-d');
            $query->where('dob', '<=', $maxDob);
        }

        if (isset($criteria['max_age']) && $criteria['max_age']) {
            $minDob = now()->subYears($criteria['max_age'] + 1)->format('Y-m-d');
            $query->where('dob', '>=', $minDob);
        }

        // Service years filter - allow NULL (members without data pass)
        if (isset($criteria['min_service_years']) && $criteria['min_service_years']) {
            $maxServiceYear = now()->year - $criteria['min_service_years'];
            $query->where(function($q) use ($maxServiceYear) {
                $q->where('service_join_year', '<=', $maxServiceYear)
                ->orWhereNull('service_join_year');
            });
        }

        // Union years filter - allow NULL (members without data pass)
        if (isset($criteria['min_union_years']) && $criteria['min_union_years']) {
            $maxUnionDate = now()->subYears($criteria['min_union_years'])->format('Y-m-d');
            $query->where(function($q) use ($maxUnionDate) {
                $q->where('union_join_date', '<=', $maxUnionDate)
                ->orWhereNull('union_join_date');
            });
        }

        // Star grade filter
        if (isset($criteria['star_grade_min']) && $criteria['star_grade_min']) {
            $query->where('star_grade', '>=', $criteria['star_grade_min']);
        }

        if (isset($criteria['star_grade_max']) && $criteria['star_grade_max']) {
            $query->where('star_grade', '<=', $criteria['star_grade_max']);
        }

        // Designation filter
        if (isset($criteria['required_designations']) && !empty($criteria['required_designations'])) {
            $query->whereIn('designation', $criteria['required_designations']);
        }

        if (isset($criteria['excluded_designations']) && !empty($criteria['excluded_designations'])) {
            $query->whereNotIn('designation', $criteria['excluded_designations']);
        }

        // Leadership position requirement
        if (isset($criteria['require_leadership_position']) && $criteria['require_leadership_position']) {
            $query->whereHas('leadershipPositions', function($q) {
                $q->where('is_current', true);
            });
        }

        // Identity verification requirement
        if (isset($criteria['identity_verified_required']) && $criteria['identity_verified_required']) {
            $query->whereNotNull('identity_verified_at');
        }

        // Specific tehsils/districts filter
        if (isset($criteria['specific_tehsils']) && !empty($criteria['specific_tehsils'])) {
            $query->whereIn('tehsil_id', $criteria['specific_tehsils']);
        }

        if (isset($criteria['specific_districts']) && !empty($criteria['specific_districts'])) {
            $query->whereHas('tehsil', fn($q) => $q->whereIn('district_id', $criteria['specific_districts']));
        }

        return $query;
    }

    /**
     * Calculate age from date of birth
     */
    private function calculateAge($dob)
    {
        if (!$dob) return 0;
        return \Carbon\Carbon::parse($dob)->age;
    }

    /**
     * Calculate service years from join year
     */
    private function calculateServiceYears($joinYear)
    {
        if (!$joinYear) return 0;
        // For service years (just year integer), simple subtraction is fine
        return now()->year - $joinYear;
    }

    /**
     * Calculate union years from join date
     */
    private function calculateUnionYears($joinDate)
    {
        if (!$joinDate) return 0;
        // Use round() to handle cases close to anniversary (e.g. 1.9 years -> 2 years)
        return (int) round(\Carbon\Carbon::parse($joinDate)->diffInYears(now()));
    }
}
