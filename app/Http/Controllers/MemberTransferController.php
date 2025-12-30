<?php

namespace App\Http\Controllers;

use App\Models\MemberTransfer;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberTransferController extends Controller
{
    /**
     * Display a listing of transfers.
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');
        $userZoneId = auth()->user()->tehsil_id;
        
        $transfers = MemberTransfer::with(['member', 'initiatedBy', 'recommendedBy', 'approvedBy'])
            ->when($userZoneId, function ($query) use ($userZoneId) {
                return $query->whereHas('member', function ($q) use ($userZoneId) {
                    $q->where('tehsil_id', $userZoneId);
                });
            })
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(10);

        return Inertia::render('Transfers/Index', [
            'transfers' => $transfers,
            'currentStatus' => $status,
            'stats' => [
                'pending' => MemberTransfer::when($userZoneId, function ($q) use ($userZoneId) {
                    return $q->whereHas('member', fn($query) => $query->where('tehsil_id', $userZoneId));
                })->pending()->count(),
                'recommended' => MemberTransfer::when($userZoneId, function ($q) use ($userZoneId) {
                    return $q->whereHas('member', fn($query) => $query->where('tehsil_id', $userZoneId));
                })->where('status', 'recommended')->count(),
                'approved' => MemberTransfer::when($userZoneId, function ($q) use ($userZoneId) {
                    return $q->whereHas('member', fn($query) => $query->where('tehsil_id', $userZoneId));
                })->approved()->count(),
                'completed' => MemberTransfer::when($userZoneId, function ($q) use ($userZoneId) {
                    return $q->whereHas('member', fn($query) => $query->where('tehsil_id', $userZoneId));
                })->completed()->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new transfer request.
     */
    public function create()
    {
        $user = auth()->user();
        $role = $user->role;
        
        // Build query for eligible members to transfer
        $query = Member::where('status', 'active');
        
        // Scope based on user's level - show only members at that same level
        if (str_contains($role, 'tehsil')) {
            // Tehsil admin: show tehsil-level members from their tehsil
            $query->where('tehsil_id', $user->tehsil_id)
                  ->where('member_level', 'tehsil');
        } elseif (str_contains($role, 'district')) {
            // District admin: show district-level members from their district
            $query->where('district_id', $user->district_id)
                  ->where('member_level', 'district');
        } elseif ($role === 'super_admin') {
            // State admin: show state-level members
            $query->where('member_level', 'state');
        }
        
        $members = $query
            ->with([
                'tehsil.district',
                'transfers' => function ($query) {
                    // Only load pending, recommended, or approved transfers
                    $query->whereIn('status', ['pending', 'recommended', 'approved'])
                          ->latest()
                          ->limit(1);
                }
            ])
            ->get()
            ->map(function ($member) {
                // Add a flag to indicate if the member has an active transfer
                $member->has_active_transfer = $member->transfers->isNotEmpty();
                $member->active_transfer_status = $member->transfers->first()?->status ?? null;
                
                // Remove the transfers array to keep response clean
                unset($member->transfers);
                
                return $member;
            });

        return Inertia::render('Transfers/Create', [
            'members' => $members,
            'levels' => ['member', 'tehsil', 'district', 'state'],
        ]);
    }

    /**
     * Store a newly created transfer.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'to_level' => 'required|in:member,tehsil,district,state',
            'reason' => 'required|string|min:10',
        ]);

        $member = Member::findOrFail($validated['member_id']);

        // Check if member already has an active transfer
        $hasActiveTransfer = $member->transfers()
            ->whereIn('status', ['pending', 'recommended', 'approved'])
            ->exists();

        if ($hasActiveTransfer) {
            return back()->withErrors([
                'member_id' => 'This member already has an active transfer request. Please wait for it to be completed or rejected.'
            ]);
        }

        // Validate that to_level is different from current level
        if ($member->member_level === $validated['to_level']) {
            return back()->withErrors(['to_level' => 'Member is already at this level.']);
        }

        MemberTransfer::create([
            'member_id' => $validated['member_id'],
            'from_level' => $member->member_level ?? 'member',
            'from_entity_id' => $member->tehsil_id,
            'to_level' => $validated['to_level'],
            'reason' => $validated['reason'],
            'initiated_by' => auth()->id(),
            'status' => 'pending',
        ]);

        return redirect()->route($this->getRoutePrefix() . '.transfers.index')
            ->with('success', 'Transfer request submitted successfully.');
    }

    /**
     * Get the route prefix based on user role.
     */
    private function getRoutePrefix(): string
    {
        $role = auth()->user()->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        return 'member';
    }

    /**
     * Display the specified transfer.
     */
    public function show(MemberTransfer $transfer)
    {
        $transfer->load(['member.tehsil.district', 'initiatedBy', 'recommendedBy', 'approvedBy']);

        return Inertia::render('Transfers/Show', [
            'transfer' => $transfer,
        ]);
    }

    /**
     * Recommend a pending transfer (District level action)
     */
    public function recommend(MemberTransfer $transfer)
    {
        if ($transfer->status !== 'pending') {
            return back()->with('error', 'Only pending transfers can be recommended.');
        }

        $transfer->update([
            'status' => 'recommended',
            'recommended_by' => auth()->id(),
        ]);

        return back()->with('success', 'Transfer recommended successfully.');
    }

    /**
     * Approve a recommended/pending transfer (State level action)
     */
    public function approve(MemberTransfer $transfer)
    {
        if (!in_array($transfer->status, ['pending', 'recommended'])) {
            return back()->with('error', 'Only pending or recommended transfers can be approved.');
        }

        $transfer->approve(auth()->user());

        return back()->with('success', 'Transfer approved successfully.');
    }

    /**
     * Reject a transfer
     */
    public function reject(Request $request, MemberTransfer $transfer)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|min:10',
        ]);

        $transfer->reject($validated['rejection_reason'], auth()->user());

        return back()->with('success', 'Transfer rejected.');
    }

    /**
     * Complete an approved transfer
     */
    public function complete(MemberTransfer $transfer)
    {
        if ($transfer->status !== 'approved') {
            return back()->with('error', 'Only approved transfers can be completed.');
        }

        $transfer->complete();

        return back()->with('success', 'Transfer completed. Member level updated and portfolios released.');
    }
}

