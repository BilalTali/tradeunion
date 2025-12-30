<?php

namespace App\Http\Controllers;

use App\Models\CommitteeElection;
use App\Models\CommitteeCandidate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class CommitteeElectionResultController extends Controller
{
    /**
     * Calculate and display results
     */
    public function show(CommitteeElection $election)
    {
        if ($election->status !== 'completed') {
            return back()->withErrors(['error' => 'Results not available yet. Election must be completed.']);
        }

        // Get candidates with vote counts
        $candidates = $election->approvedCandidates()
            ->with('member')
            ->withCount(['votes as vote_count' => function($query) {
                $query->where('verification_status', 'approved');
            }])
            ->get();

        // Group by position
        $resultsByPosition = $candidates->groupBy('position_sought')
            ->map(function($group) {
                return $group->sortByDesc('vote_count')->values();
            });

        // Get role prefix for navigation
        $rolePrefix = $this->getRolePrefix();

        return Inertia::render('CommitteeElections/Results', [
            'election' => $election->load('committee'),
            'resultsByPosition' => $resultsByPosition,
            'rolePrefix' => $rolePrefix,
        ]);
    }

    /**
     * Download results as PDF
     */
    public function downloadPdf(CommitteeElection $election)
    {
        if ($election->status !== 'completed') {
            return back()->withErrors(['error' => 'Results not available yet. Election must be completed.']);
        }

        $candidates = $election->approvedCandidates()
            ->with('member')
            ->withCount(['votes as vote_count' => function($query) {
                $query->where('verification_status', 'approved');
            }])
            ->get();

        $resultsByPosition = $candidates->groupBy('position_sought')
            ->map(function($group) {
                return $group->sortByDesc('vote_count')->values();
            });

        $pdf = Pdf::loadView('pdf.committee-election-results', [
            'election' => $election->load('committee'),
            'resultsByPosition' => $resultsByPosition,
        ]);

        return $pdf->download("committee-election-results-{$election->id}.pdf");
    }

    /**
     * Download winner certificate
     */
    public function downloadCertificate(CommitteeElection $election, $resultId)
    {
        $candidate = CommitteeCandidate::with('member')->findOrFail($resultId);

        if ($candidate->committee_election_id !== $election->id) {
            abort(403, 'Invalid candidate for this election.');
        }

        if ($election->status !== 'completed') {
            return back()->withErrors(['error' => 'Certificates are only available after election completion.']);
        }

        // Verify candidate won (has highest votes for their position)
        $winnersForPosition = CommitteeCandidate::where('committee_election_id', $election->id)
            ->where('position_sought', $candidate->position_sought)
            ->withCount(['votes as vote_count' => function($query) {
                $query->where('verification_status', 'approved');
            }])
            ->orderBy('vote_count', 'desc')
            ->first();

        if ($winnersForPosition->id !== $candidate->id) {
            return back()->withErrors(['error' => 'Certificate only available for winners.']);
        }

        $pdf = Pdf::loadView('pdf.committee-winner-certificate', [
            'election' => $election->load('committee'),
            'candidate' => $candidate,
            'position' => $candidate->position_sought,
            'voteCount' => $winnersForPosition->vote_count,
        ]);

        $filename = 'certificate-' . str_replace(' ', '-', strtolower($candidate->member->name)) . '.pdf';
        return $pdf->download($filename);
    }

    /**
     * Get role prefix based on user
     */
    private function getRolePrefix()
    {
        $role = auth()->user()->role;
        
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        
        return 'state';
    }
}

