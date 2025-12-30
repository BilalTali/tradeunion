<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\ElectionDelegate;
use App\Models\Member;
use App\Models\VoterSlip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class VoterSlipController extends Controller
{
    /**
     * Display voter slips for an election
     */
    public function index(Election $election)
    {
        $voterSlips = $election->voterSlips()
            ->with('member.zone.district')
            ->paginate(50);

        return Inertia::render('Elections/VoterSlips/Index', [
            'election' => $election,
            'voterSlips' => $voterSlips,
            'totalSlips' => $election->voterSlips()->count(),
            'usedSlips' => $election->voterSlips()->where('is_used', true)->count(),
        ]);
    }

    /**
     * Generate voter slips for all eligible voters
     */
    public function generate(Election $election)
    {
        // Get eligible voters based on election type
        $eligibleVoters = $this->getEligibleVoters($election);

        if ($eligibleVoters->isEmpty()) {
            return back()->with('error', 'No eligible voters found for this election.');
        }

        DB::transaction(function () use ($election, $eligibleVoters) {
            foreach ($eligibleVoters as $member) {
                // Check if slip already exists
                if (!$election->voterSlips()->where('member_id', $member->id)->exists()) {
                    VoterSlip::create([
                        'election_id' => $election->id,
                        'member_id' => $member->id,
                        'slip_number' => VoterSlip::generateSlipNumber($election->id, $member->id),
                        'verification_code' => VoterSlip::generateVerificationCode(),
                    ]);
                }
            }
        });

        return back()->with('success', 'Voter slips generated successfully for ' . $eligibleVoters->count() . ' voters.');
    }

    /**
     * Download voter slip PDF for current user
     */
    public function download(Election $election)
    {
        $member = auth()->user()->member;
        
        if (!$member) {
            return back()->with('error', 'You must be a member to download voter slip.');
        }

        $voterSlip = $election->voterSlips()->where('member_id', $member->id)->first();

        if (!$voterSlip) {
            return back()->with('error', 'No voter slip found for you in this election.');
        }

        // Load member with zone and district for PDF view
        $member = Member::with('zone.district')->findOrFail($voterSlip->member_id);
        
        // Get office profile based on election level
        $officeProfile = null;
        if ($election->election_type === 'zonal_president') { // Corrected from 'tehsil' to 'zonal_president'
            $officeProfile = $member->tehsil?->officeProfile;
        } elseif ($election->election_type === 'district_president') { // Corrected from 'district' to 'district_president'
            $district = \App\Models\District::find($member->tehsil?->district_id);
            $officeProfile = $district?->officeProfile;
        } else { // Assuming 'state_president' or other state-level elections
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        }

        $pdf = Pdf::loadView('pdf.voter-slip', [
            'voterSlip' => $voterSlip,
            'member' => $member,
            'election' => $election,
            'officeProfile' => $officeProfile,
        ]);

        return $pdf->download("voter-slip-{$voterSlip->slip_number}.pdf");
    }

    /**
     * Download all voter slips as PDF (admin only)
     */
    public function downloadAll(Election $election)
    {
        $voterSlips = $election->voterSlips()
            ->with('member.zone.district')
            ->get();

        $pdf = Pdf::loadView('pdf.voter-slips-all', [
            'election' => $election,
            'voterSlips' => $voterSlips,
        ]);

        return $pdf->download("all-voter-slips-election-{$election->id}.pdf");
    }

    /**
     * Get eligible voters based on election type
     */
    private function getEligibleVoters(Election $election)
    {
        switch ($election->election_type) {
            case 'zonal_president':
                // All active members in the zone can vote
                return Member::where('status', 'active')
                    ->where('tehsil_id', $election->entity_id)
                    ->get();

            case 'district_president':
                // Zonal Presidents from this district + Zone-nominated delegates
                $delegates = $election->delegates()->pluck('member_id');
                return Member::whereIn('id', $delegates)->get();

            case 'state_president':
                // All eligible delegates (zonal/district presidents + portfolio holders)
                $delegates = $election->delegates()->pluck('member_id');
                return Member::whereIn('id', $delegates)->get();

            default:
                return collect();
        }
    }

    /**
     * Voter list view
     */
    public function voterList(Election $election)
    {
        $voters = $this->getEligibleVoters($election);

        return Inertia::render('Elections/VoterList', [
            'election' => $election->load('entity'),
            'voters' => $voters->load('zone.district'),
            'totalVoters' => $voters->count(),
        ]);
    }
}

