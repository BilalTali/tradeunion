<?php

namespace App\Http\Controllers;

use App\Models\Committee;
use App\Models\LeadershipPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommitteeController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of committees
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Committee::class);
        
        $user = auth()->user();
        
        // Build query based on user role
        $query = Committee::with(['creator', 'activeMembers.leadershipPosition.member'])
            ->orderBy('created_at', 'desc');
        
        // Filter by level if user is not super_admin
        if ($user->role !== 'super_admin') {
            $level = match($user->role) {
                'state_admin', 'state_president' => 'state',
                'district_admin', 'district_president' => 'district',
                'tehsil_admin', 'tehsil_president' => 'tehsil',
                default => null,
            };
            
            if ($level) {
                $query->where('level', $level);
                
                // Further filter by entity_id if applicable
                if ($user->entity_id) {
                    $query->where('entity_id', $user->entity_id);
                }
            }
        }
        
        $committees = $query->paginate(15);
        
        return Inertia::render('Committees/Index', [
            'committees' => $committees,
        ]);
    }

    /**
     * Show the form for creating a new committee
     */
    public function create()
    {
        $this->authorize('create', Committee::class);
        
        return Inertia::render('Committees/Create', [
            'committeeTypes' => $this->getCommitteeTypes(),
            'levels' => $this->getLevels(),
        ]);
    }

    /**
     * Store a newly created committee
     */
    public function store(Request $request)
    {
        $this->authorize('create', Committee::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:executive,election_commission,disciplinary,finance,audit,custom',
            'level' => 'required|in:tehsil,district,state',
            'entity_id' => 'required|integer|min:1',
            'min_members' => 'required|integer|min:3|max:50',
            'max_members' => 'required|integer|min:3|max:50',
            'quorum_percentage' => 'required|numeric|min:30|max:100',
            'voting_threshold' => 'required|numeric|min:50|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'description' => 'nullable|string|max:1000',
            'constitutional_basis' => 'nullable|string|max:500',
        ]);
        
        // Generate slug
        $validated['slug'] = \Str::slug($validated['name'] . '-' . $validated['level'] . '-' . $validated['entity_id']);
        $validated['created_by'] = auth()->id();
        $validated['is_active'] = true;
        
        $committee = Committee::create($validated);
        
        return redirect()
            ->route($this->getRoutePrefix() . '.committees.show', $committee)
            ->with('success', 'Committee created successfully.');
    }

    /**
     * Display the specified committee
     */
    public function show(Committee $committee)
    {
        $this->authorize('view', $committee);
        
        $committee->load([
            'creator',
            'activeMembers.member.tehsil', // Load member directly with tehsil info
            'activeMembers.leadershipPosition.member',
            'resolutions' => fn($q) => $q->latest()->limit(10),
            'meetings' => fn($q) => $q->latest()->limit(5),
        ]);

        // Get available members from the same level for adding to committee
        $user = auth()->user();
        $availableMembers = \App\Models\Member::with('user', 'tehsil', 'district')
            ->where('status', 'active');
        
        // Filter by level
        if ($committee->level === 'district') {
            // Only show transferred district members from the USER's district
            $availableMembers->where('district_id', $user->district_id)
                ->where('member_level', 'district');
        } elseif ($committee->level === 'tehsil') {
            $availableMembers->where('tehsil_id', $user->tehsil_id);
        }
        // For state level, get all active members
        
        $availableMembers = $availableMembers->get();
        
        // Get list of roles that are already occupied
        $occupiedRoles = $committee->activeMembers()
            ->pluck('role')
            ->unique()
            ->values()
            ->toArray();
        
        return Inertia::render('Committees/Show', [
            'committee' => $committee,
            'availableMembers' => $availableMembers,
            'occupiedRoles' => $occupiedRoles,
        ]);
    }

    /**
     * Show the form for editing the specified committee
     */
    public function edit(Committee $committee)
    {
        $this->authorize('update', $committee);
        
        return Inertia::render('Committees/Edit', [
            'committee' => $committee,
            'committeeTypes' => $this->getCommitteeTypes(),
            'levels' => $this->getLevels(),
        ]);
    }

    /**
     * Update the specified committee
     */
    public function update(Request $request, Committee $committee)
    {
        $this->authorize('update', $committee);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:executive,election_commission,disciplinary,finance,audit,custom',
            'min_members' => 'required|integer|min:3|max:50',
            'max_members' => 'required|integer|min:3|max:50',
            'quorum_percentage' => 'required|numeric|min:30|max:100',
            'voting_threshold' => 'required|numeric|min:50|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'required|boolean',
            'description' => 'nullable|string|max:1000',
            'constitutional_basis' => 'nullable|string|max:500',
        ]);
        
        $committee->update($validated);
        
        return redirect()
            ->route($this->getRoutePrefix() . '.committees.show', $committee)
            ->with('success', 'Committee updated successfully.');
    }

    /**
     * Remove the specified committee
     */
    public function destroy(Committee $committee)
    {
        $this->authorize('delete', $committee);
        
        // Only allow deletion if no resolutions exist
        if ($committee->resolutions()->exists()) {
            return back()->with('error', 'Cannot delete committee with existing resolutions.');
        }
        
        $committee->delete();
        
        return redirect()
            ->route($this->getRoutePrefix() . '.committees.index')
            ->with('success', 'Committee deleted successfully.');
    }

    /**
     * Add a member to the committee
     */
    public function addMember(Request $request, Committee $committee)
    {
        $this->authorize('manageMembers', $committee);
        
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'role' => 'required|in:chair,vice_chair,secretary,convener,member',
        ]);

        // Check if member already exists in committee
        $exists = $committee->activeMembers()
            ->where('member_id', $validated['member_id'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'This member is already on the committee.');
        }

        // Check if max members reached
        if ($committee->activeMembers()->count() >= $committee->max_members) {
            return back()->with('error', 'Committee has reached maximum members.');
        }

        // Add the member
        $committee->members()->create([
            'member_id' => $validated['member_id'],
            'leadership_position_id' => null, // Not using leadership positions
            'role' => $validated['role'],
            'appointed_date' => now(),
            'term_end_date' => $committee->end_date,
            'is_active' => true,
        ]);

        return back()->with('success', 'Member added to committee successfully.');
    }

    /**
     * Remove a member from the committee
     */
    public function removeMember(Committee $committee, $membershipId)
    {
        $membership = $committee->members()->findOrFail($membershipId);
        $membership->update(['is_active' => false]);

        return back()->with('success', 'Member removed from committee.');
    }

    /**
     * Get route prefix based on user role
     */
    private function getRoutePrefix(): string
    {
        $user = auth()->user();
        
        return match($user->role) {
            'state_admin', 'state_president' => 'state',
            'district_admin', 'district_president' => 'district',
            'tehsil_admin', 'tehsil_president' => 'tehsil',
            default => 'state',
        };
    }

    /**
     * Get committee types for dropdown        
     */
    private function getCommitteeTypes(): array
    {
        return [
            'executive' => 'Executive Committee',
            'election_commission' => 'Election Commission',
            'disciplinary' => 'Disciplinary Committee',
            'finance' => 'Finance Committee',
            'audit' => 'Audit Committee',
            'custom' => 'Custom Committee',
        ];
    }

    /**
     * Get levels for dropdown
     */
    private function getLevels(): array
    {
        $user = auth()->user();
        
        if ($user->role === 'super_admin') {
            return [
                'tehsil' => 'Tehsil Level',
                'district' => 'District Level',
                'state' => 'State Level',
            ];
        }
        
        return match($user->role) {
            'state_admin', 'state_president' => ['state' => 'State Level'],
            'district_admin', 'district_president' => ['district' => 'District Level'],
            'tehsil_admin', 'tehsil_president' => ['tehsil' => 'Tehsil Level'],
            default => [],
        };
    }
}

