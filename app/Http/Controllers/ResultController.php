<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\ElectionResult;
use App\Models\Candidate;
use App\Http\Controllers\Traits\HasPortfolioAuthorization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ResultController extends Controller
{
    use AuthorizesRequests, HasPortfolioAuthorization;

    /**
     * Calculate and save election results
     */
    public function calculate(Election $election)
    {
        // Use portfolio authorization
        $this->authorizePortfolio(
            'result.calculate',
            'execute',
            $election->level,
            $election,
            'EC action - result calculation'
        );

        // Check if voting is closed
        if ($election->status !== 'voting_closed') {
            return back()->withErrors(['error' => 'Voting must be closed before calculating results.']);
        }

        // Get all candidates with their vote counts
        $candidates = $election->candidates()
            ->where('status', 'approved')
            ->orderBy('vote_count', 'desc')
            ->get();

        // Get total number of voters
        $totalVoters = $election->votes()->distinct('member_id')->count();

        // Clear existing results for this election
        ElectionResult::where('election_id', $election->id)->delete();

        // Group candidates by position
        $positionGroups = $candidates->groupBy('position_title');

        foreach ($positionGroups as $position => $positionCandidates) {
            // Find winner (highest vote count)
            $winner = $positionCandidates->first();
            $totalVotes = $positionCandidates->sum('vote_count');

            $votePercentage = $totalVoters > 0 
                ? round(($winner->vote_count / $totalVoters) * 100, 2) 
                : 0;

            // Create result record
            ElectionResult::create([
                'election_id' => $election->id,
                'position_title' => $position,
                'winner_id' => $winner->member_id,
                'total_votes' => $totalVotes,
                'total_voters' => $totalVoters,
                'vote_percentage' => $votePercentage,
                'is_certified' => false,
            ]);
        }

        // Update election status
        $election->update(['status' => 'completed']);

        return back()->with('success', 'Results calculated successfully.');
    }

    /**
     * Certify results (Election Commission only)
     */
    public function certify(Request $request, Election $election)
    {
        // Use portfolio authorization
        $this->authorizePortfolio(
            'result.certify',
            'execute',
            $election->level,
            $election,
            'EC action - result certification'
        );

        // Check if results exist
        $resultsCount = ElectionResult::where('election_id', $election->id)->count();
        if ($resultsCount === 0) {
            return back()->withErrors(['error' => 'No results to certify. Please calculate results first.']);
        }

        // Certify all results
        ElectionResult::where('election_id', $election->id)
            ->update([
                'is_certified' => true,
                'certified_by' => auth()->id(),
                'certified_at' => now(),
            ]);

        return back()->with('success', 'Results certified successfully. Winners can now be installed from the admin dashboard.');
    }

    /**
     * Display election results
     */
    public function show(Election $election)
    {
        // Check if results are available
        if (!in_array($election->status, ['completed', 'voting_closed'])) {
            return back()->withErrors(['error' => 'Results are not yet available.']);
        }

        // Get results with winner details
        $results = ElectionResult::where('election_id', $election->id)
            ->with('winner')
            ->get();

        // Get all candidates with their vote counts
        $candidates = $election->candidates()
            ->where('status', 'approved')
            ->with('member')
            ->orderBy('vote_count', 'desc')
            ->get();

        return Inertia::render('Elections/Results', [
            'election' => $election,
            'results' => $results,
            'candidates' => $candidates,
        ]);
    }

    /**
     * Download results as PDF
     */
    public function downloadPdf(Election $election)
    {
        // Check if results are available
        if ($election->status !== 'completed') {
            return back()->withErrors(['error' => 'Results are not yet available.']);
        }

        $results = ElectionResult::where('election_id', $election->id)
            ->with('winner')
            ->get();

        $candidates = $election->candidates()
            ->where('status', 'approved')
            ->with('member')
            ->orderBy('vote_count', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('elections.results-pdf', [
            'election' => $election,
            'results' => $results,
            'candidates' => $candidates,
        ]);

        return $pdf->download('election-results-' . $election->id . '.pdf');
    }

    /**
     * Download winner certificate
     */
    public function downloadCertificate(Election $election, $resultId)
    {
        // Get the specific result
        $result = ElectionResult::with('winner')->findOrFail($resultId);
        
        // Verify this result belongs to the election
        if ($result->election_id !== $election->id) {
            abort(404);
        }
        
        // Check if results are certified
        if (!$result->is_certified) {
            return back()->withErrors(['error' => 'Certificate can only be downloaded after results are certified.']);
        }

        $winner = $result->winner;

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('elections.winner-certificate', [
            'election' => $election,
            'result' => $result,
            'winner' => $winner,
        ])->setPaper('a4', 'portrait');

        $filename = 'certificate-' . str_replace(' ', '-', strtolower($winner->name)) . '-' . $election->id . '.pdf';
        
        return $pdf->download($filename);
    }
}
