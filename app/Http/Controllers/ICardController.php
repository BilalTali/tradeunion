<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ICardController extends Controller
{
    /**
     * View I-Card in browser
     */
    public function view(Member $member)
    {
        $member->load('tehsil.district.state', 'user');

        return Inertia::render('Members/ICard', [
            'member' => $member,
            'qrData' => route('member.verify', $member->membership_id),
        ]);
    }

    /**
     * Download I-Card as PDF
     */
    public function download(Member $member)
    {
        $member->load(['tehsil.district.state', 'user', 'currentPositions.portfolio', 'leadershipPositions.portfolio']);
        
        // Get appropriate office profile based on member level
        $officeProfile = null;
        if ($member->tehsil_id) {
            // Zone level member
            $officeProfile = $member->tehsil->officeProfile;
        } elseif ($member->district_id) {
            // District level member
            $district = \App\Models\District::find($member->district_id);
            $officeProfile = $district?->officeProfile;
        } else {
            // State level member
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        }

        // Fallback to State Profile if specific level profile is missing
        if (!$officeProfile) {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        }
        
        // Get current active portfolios
        $portfolios = $member->currentPositions->map(function($position) {
            return $position->portfolio->name ?? 'Member';
        })->take(2)->toArray(); // Limit to 2 for space
        
        // Generate QR code URL for verification
        $qrData = route('member.verify', $member->membership_id);
        
        $pdf = Pdf::loadView('pdf.icard', [
            'member' => $member,
            'qrData' => $qrData,
            'officeProfile' => $officeProfile,
            'portfolios' => $portfolios,
        ]);
        
        // Set paper size for I-Card (56mm x 86mm = 158.74pt x 243.78pt)
        $pdf->setPaper([0, 0, 158.74, 243.78]); 
        
        // Enable high quality rendering and remote images (for barcode/logo)
        $pdf->setOption([
            'dpi' => 300, 
            'defaultFont' => 'sans-serif',
            'isRemoteEnabled' => true
        ]);
        
        return $pdf->download("icard-{$member->membership_id}.pdf");
    }

    /**
     * Download Admin I-Card as PDF
     */
    public function downloadAdmin(\App\Models\User $admin)
    {
        $admin->load('district', 'tehsil');

        // Get office profile based on admin role
        $officeProfile = null;
        if ($admin->tehsil_id) {
            $tehsil = \App\Models\Tehsil::find($admin->tehsil_id);
            $officeProfile = $tehsil?->officeProfile;
        } elseif ($admin->district_id) {
            $district = \App\Models\District::find($admin->district_id);
            $officeProfile = $district?->officeProfile;
        } else {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        }

        // Fallback to State Profile if specific level profile is missing
        if (!$officeProfile) {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        }

        // Mock a "Member" object based on Admin data
        $mockMember = (object) [
            'membership_id' => $admin->membership_id ?? ('ADM-' . str_pad($admin->id, 4, '0', STR_PAD_LEFT)),
            'name' => $admin->name,
            'photo_path' => $admin->photo_path,
            'union_join_date' => $admin->created_at,
            'designation' => ucwords(str_replace('_', ' ', $admin->role)),
            'star_grade' => 5, // Admins get 5 stars
            'tehsil' => (object) [
                'name' => $admin->tehsil ? $admin->tehsil->name : ($admin->district ? 'DISTRICT LEVEL' : 'STATE LEVEL'),
                'district' => (object) [
                    'name' => $admin->district ? $admin->district->name : ($admin->role === 'super_admin' ? 'JAMMU & KASHMIR' : 'N/A'),
                ],
            ],
        ];

        // QR Code data
        $qrData = route('login'); 
        
        $pdf = Pdf::loadView('pdf.icard', [
            'member' => $mockMember,
            'qrData' => $qrData,
            'officeProfile' => $officeProfile,
            'portfolios' => [], // Admins don't have portfolios
        ]);
        
        $pdf->setPaper([0, 0, 158.74, 243.78]); 
        
        $pdf->setOption([
            'dpi' => 300, 
            'defaultFont' => 'sans-serif',
            'isRemoteEnabled' => true
        ]);
        
        return $pdf->download("admin-icard-{$admin->id}.pdf");
    }

    /**
     * Verify member by membership ID (public route)
     */
    public function verify($membershipId)
    {
        $member = Member::where('membership_id', $membershipId)
            ->with('tehsil.district.state', 'currentPositions')
            ->first();

        if (!$member) {
            abort(404, 'Member not found');
        }

        return Inertia::render('Public/MemberVerification', [
            'member' => $member,
            'verified' => true,
        ]);
    }
}

