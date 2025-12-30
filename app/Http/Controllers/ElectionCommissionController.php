<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\ElectionCommission;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElectionCommissionController extends Controller
{
    /**
     * Display the election commission members
     */
    public function index(Election $election)
    {
        $commission = $election->commission()
            ->with('member.tehsil.district', 'assignedBy')
            ->get();

        // Get available members to add (from same level)
        $availableMembers = $this->getAvailableMembers($election);

        return Inertia::render('Elections/Commission/Index', [
            'election' => $election,
            'commission' => $commission,
            'availableMembers' => $availableMembers,
        ]);
    }

    /**
     * Store a new commission member
     */
    public function store(Request $request, Election $election)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'role' => 'required|in:chief,member',
        ]);

        // Check if already in commission
        if ($election->commission()->where('member_id', $validated['member_id'])->exists()) {
            return back()->with('error', 'This member is already in the Election Commission.');
        }

        // If adding chief, ensure only one chief exists
        if ($validated['role'] === 'chief') {
            $existingChief = $election->commission()->where('role', 'chief')->first();
            if ($existingChief) {
                return back()->with('error', 'There is already a Chief Election Commissioner.');
            }
        }

        ElectionCommission::create([
            'election_id' => $election->id,
            'member_id' => $validated['member_id'],
            'role' => $validated['role'],
            'assigned_by' => auth()->id(),
        ]);

        return back()->with('success', 'Commission member added successfully.');
    }

    /**
     * Remove a commission member
     */
    public function destroy(Election $election, ElectionCommission $commission)
    {
        $commission->delete();

        return back()->with('success', 'Commission member removed.');
    }

    /**
     * Get available members based on election level
     */
    private function getAvailableMembers(Election $election)
    {
        $query = Member::where('status', 'active');

        switch ($election->level) {
            case 'tehsil':
                // For tehsil election, get members from the tehsil
                $query->where('tehsil_id', $election->entity_id);
                break;
            case 'district':
                // For district election, get members from tehsils in that district
                $query->whereHas('tehsil', fn($q) => $q->where('district_id', $election->entity_id));
                break;
            case 'state':
                // For state election, get members from districts in that state
                $query->whereHas('tehsil.district', fn($q) => $q->where('state_id', $election->entity_id));
                break;
        }

        // Exclude members already in commission
        $existingMemberIds = $election->commission()->pluck('member_id');
        $query->whereNotIn('id', $existingMemberIds);

        return $query->with('tehsil.district')->limit(50)->get();
    }
}

