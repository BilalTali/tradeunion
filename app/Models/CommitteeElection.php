<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeElection extends Model
{
    protected $fillable = [
        'committee_id',
        'title',
        'description',
        'election_type',
        'nomination_start',
        'nomination_end',
        'voting_start',
        'voting_end',
        'status',
        'allow_portfolio_holders',
        'allowed_portfolio_ids',
        'restrict_to_same_level',
        'eligible_voters_count',
        'eligible_candidates_count',
        'total_votes_cast',
        'created_by',
    ];

    protected $casts = [
        'nomination_start' => 'datetime',
        'nomination_end' => 'datetime',
        'voting_start' => 'datetime',
        'voting_end' => 'datetime',
        'allowed_portfolio_ids' => 'array',
        'allow_portfolio_holders' => 'boolean',
        'restrict_to_same_level' => 'boolean',
    ];

    /**
     * Get the committee this election belongs to
     */
    public function committee()
    {
        return $this->belongsTo(Committee::class);
    }

    /**
     * Get all candidates for this election
     */
    public function candidates()
    {
        return $this->hasMany(CommitteeCandidate::class);
    }

    /**
     * Get approved candidates only
     */
    public function approvedCandidates()
    {
        return $this->candidates()->where('status', 'approved');
    }

    /**
     * Get pending candidates
     */
    public function pendingCandidates()
    {
        return $this->candidates()->where('status', 'pending');
    }

    /**
     * Get all votes for this election
     */
    public function votes()
    {
        return $this->hasMany(CommitteeVote::class);
    }

    /**
     * Get the user who created this election
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Check if nominations are open
     */
    public function isNominationsOpen()
    {
        return $this->status === 'nominations_open' 
            && now()->between($this->nomination_start, $this->nomination_end);
    }

    /**
     * Check if voting is open
     */
    public function isVotingOpen()
    {
        return $this->status === 'voting_open'
            && now()->between($this->voting_start, $this->voting_end);
    }

    /**
     * Check if a member can vote in this election
     */
    public function memberCanVote(Member $member): bool
    {
        // Check if member is a committee member
        $isCommitteeMember = $this->committee
            ->activeMembers()
            ->where('member_id', $member->id)
            ->exists();

        if ($isCommitteeMember) {
            return true;
        }

        // Check if portfolio holders are allowed
        if (!$this->allow_portfolio_holders) {
            return false;
        }

        // Check if member has an active portfolio
        $portfolioQuery = $member->leadershipPositions()
            ->where('is_current', true)
            ->whereNotNull('portfolio_id');

        // If specific portfolios are allowed, filter by those
        if ($this->allowed_portfolio_ids) {
            $portfolioQuery->whereIn('portfolio_id', $this->allowed_portfolio_ids);
        }

        // If restricted to same level, filter by committee level
        if ($this->restrict_to_same_level) {
            $portfolioQuery->whereHas('portfolio', function($q) {
                $q->where('level', $this->committee->level);
            });
        }

        return $portfolioQuery->exists();
    }

    /**
     * Get voter type for a member (committee_member or portfolio_holder)
     */
    public function getVoterType(Member $member): ?string
    {
        // Check committee membership first
        $isCommitteeMember = $this->committee
            ->activeMembers()
            ->where('member_id', $member->id)
            ->exists();

        if ($isCommitteeMember) {
            return 'committee_member';
        }

        // Check portfolio holder
        if ($this->allow_portfolio_holders) {
            $portfolioQuery = $member->leadershipPositions()
                ->where('is_current', true)
                ->whereNotNull('portfolio_id');

            if ($this->allowed_portfolio_ids) {
                $portfolioQuery->whereIn('portfolio_id', $this->allowed_portfolio_ids);
            }

            if ($this->restrict_to_same_level) {
                $portfolioQuery->whereHas('portfolio', function($q) {
                    $q->where('level', $this->committee->level);
                });
            }

            if ($portfolioQuery->exists()) {
                return 'portfolio_holder';
            }
        }

        return null;
    }

    /**
     * Get portfolio ID if member is voting as portfolio holder
     */
    public function getVoterPortfolioId(Member $member): ?int
    {
        if ($this->getVoterType($member) !== 'portfolio_holder') {
            return null;
        }

        $portfolioQuery = $member->leadershipPositions()
            ->where('is_current', true)
            ->whereNotNull('portfolio_id');

        if ($this->allowed_portfolio_ids) {
            $portfolioQuery->whereIn('portfolio_id', $this->allowed_portfolio_ids);
        }

        if ($this->restrict_to_same_level) {
            $portfolioQuery->whereHas('portfolio', function($q) {
                $q->where('level', $this->committee->level);
            });
        }

        $position = $portfolioQuery->first();
        return $position?->portfolio_id;
    }

    /**
     * Get all eligible voters for this election
     */
    public function getEligibleVoters()
    {
        $eligibleMemberIds = collect();

        // Get committee members
        $committeeMemberIds = $this->committee
            ->activeMembers()
            ->pluck('member_id');

        $eligibleMemberIds = $eligibleMemberIds->merge($committeeMemberIds);

        // Get portfolio holders if allowed
        if ($this->allow_portfolio_holders) {
            $portfolioQuery = LeadershipPosition::query()
                ->where('is_current', true)
                ->whereNotNull('portfolio_id');

            if ($this->allowed_portfolio_ids) {
                $portfolioQuery->whereIn('portfolio_id', $this->allowed_portfolio_ids);
            }

            if ($this->restrict_to_same_level) {
                $portfolioQuery->whereHas('portfolio', function($q) {
                    $q->where('level', $this->committee->level);
                });
            }

            $portfolioMemberIds = $portfolioQuery->pluck('member_id');
            $eligibleMemberIds = $eligibleMemberIds->merge($portfolioMemberIds);
        }

        // Return unique members
        return Member::whereIn('id', $eligibleMemberIds->unique())->get();
    }
}
