<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\Candidate;
use App\Models\ElectionResult;
use App\Models\LeadershipPosition;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResultsController extends Controller
{
    /**
     * Display election results
     */
    public function show(Election $election)
    {
        // Check if voting has ended
        if ($election->status !== 'voting_closed' && $election->status !== 'completed') {
            return back()->with('error', 'Results are not yet available.');
        }

        $results = $election->results()
            ->with('winner')
            ->get()
            ->groupBy('position_title');

        $totalVotes = Vote::where('election_id', $election->id)->count();
        $uniqueVoters = Vote::where('election_id', $election->id)
            ->distinct('member_id')
            ->count('member_id');

        return Inertia::render('Elections/Results', [
            'election' => $election,
            'results' => $results,
            'totalVotes' => $totalVotes,
            'uniqueVoters' => $uniqueVoters,
        ]);
    }

    /**
     * Tally votes and generate results
     */
    public function tally(Election $election)
    {
        // Check if voting period has ended
        if (now()->lt($election->voting_end)) {
            return back()->with('error', 'Voting period has not ended yet.');
        }

        DB::transaction(function () use ($election) {
            // Get all approved candidates grouped by position
            $candidates = $election->approvedCandidates()
                ->get()
                ->groupBy('position_title');

            foreach ($candidates as $positionTitle => $positionCandidates) {
                // Get vote counts for this position
                $voteData = Vote::where('election_id', $election->id)
                    ->whereIn('candidate_id', $positionCandidates->pluck('id'))
                    ->select('candidate_id', DB::raw('count(*) as vote_count'))
                    ->groupBy('candidate_id')
                    ->get()
                    ->keyBy('candidate_id');

                // Find winner (highest votes)
                $winner = null;
                $maxVotes = 0;

                foreach ($positionCandidates as $candidate) {
                    $votes = $voteData->get($candidate->id)?->vote_count ?? 0;
                    
                    if ($votes > $maxVotes) {
                        $maxVotes = $votes;
                        $winner = $candidate;
                    }
                }

                // Get total voters for this position
                $totalVoters = Vote::where('election_id', $election->id)
                    ->whereIn('candidate_id', $positionCandidates->pluck('id'))
                    ->distinct('member_id')
                    ->count('member_id');

                // Create result record
                ElectionResult::updateOrCreate(
                    [
                        'election_id' => $election->id,
                        'position_title' => $positionTitle,
                    ],
                    [
                        'winner_id' => $winner?->member_id,
                        'total_votes' => $maxVotes,
                        'total_voters' => $totalVoters,
                        'vote_percentage' => $totalVoters > 0 
                            ? round(($maxVotes / $totalVoters) * 100, 2) 
                            : 0,
                    ]
                );
            }

            // Update election status
            $election->update(['status' => 'voting_closed']);
        });

        return redirect()->route('elections.results', $election)
            ->with('success', 'Results have been tallied successfully.');
    }

    /**
     * Certify election results
     */
    public function certify(Election $election)
    {
        if ($election->status !== 'voting_closed') {
            return back()->with('error', 'Results must be tallied before certification.');
        }

        DB::transaction(function () use ($election) {
            // Mark all results as certified
            $election->results()->update([
                'is_certified' => true,
                'certified_by' => auth()->id(),
                'certified_at' => now(),
            ]);

            // Update leadership positions
            $this->updateLeadershipPositions($election);

            // Mark election as completed
            $election->update(['status' => 'completed']);
        });

        return redirect()->route($this->getRoutePrefix(auth()->user()) . '.elections.show', $election)
            ->with('success', 'Election results have been certified and leadership positions updated.');
    }

    /**
     * Get route prefix based on user role
     */
    private function getRoutePrefix($user): string
    {
        $role = $user->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district') && !str_contains($role, 'member')) return 'district';
        if (str_contains($role, 'zone') && !str_contains($role, 'member')) return 'zone';
        return 'member';
    }

    /**
     * Update leadership positions based on election results
     */
    protected function updateLeadershipPositions(Election $election)
    {
        $results = $election->results()->where('is_certified', true)->get();

        foreach ($results as $result) {
            if (!$result->winner_id) {
                continue;
            }

            // Mark previous positions as not current
            LeadershipPosition::where('level', $election->level)
                ->where('entity_id', $election->entity_id)
                ->where('position_title', $result->position_title)
                ->where('is_current', true)
                ->update([
                    'is_current' => false,
                    'end_date' => now(),
                ]);

            // Create new leadership position
            LeadershipPosition::create([
                'level' => $election->level,
                'entity_id' => $election->entity_id,
                'position_title' => $result->position_title,
                'member_id' => $result->winner_id,
                'start_date' => now(),
                'end_date' => null,
                'is_current' => true,
            ]);
        }
    }

    /**
     * Download results as PDF
     */
    public function downloadPdf(Election $election)
    {
        if ($election->status !== 'completed') {
            return back()->with('error', 'Only completed elections can be downloaded.');
        }

        $results = $election->results()
            ->with('winner')
            ->where('is_certified', true)
            ->get();

        $pdf = \PDF::loadView('pdf.election-results', [
            'election' => $election,
            'results' => $results,
        ]);

        return $pdf->download("election-results-{$election->id}.pdf");
    }
}
