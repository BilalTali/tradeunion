<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use App\Models\State;
use App\Models\District;
use App\Models\Tehsil;
use App\Models\Resolution;
use App\Services\MembershipService;
use App\Http\Controllers\Traits\HasPortfolioAuthorization;
use App\Traits\RequiresResolution;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    use HasPortfolioAuthorization, RequiresResolution;
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    
    protected $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
    }

    /**
     * Get role-based route prefix
     */
    private function getRolePrefix($request)
    {
        $role = $request->user()->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        return 'member';
    }

    /**
     * Display a listing of members
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Member::class);
        
        $user = $request->user();
        $role = $user->role;
        
        $query = Member::with(['tehsil.district.state', 'user']);

        // Auto-scope based on user role
        if (str_contains($role, 'tehsil')) {
            // Tehsil admins/members see only their tehsil members
            $query->where('tehsil_id', $user->tehsil_id);
        } elseif (str_contains($role, 'district')) {
            // District admins/members see only members from THEIR district
            $query->where('district_id', $user->district_id);
        } elseif ($role === 'member') {
            // Regular members see only their tehsil members
            $query->where('tehsil_id', $user->tehsil_id);
        }
        // Super admins see all members (no filter)

        // Additional filters (only for super_admin and district_admin)
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by district (only for super admin)
        if ($role === 'super_admin' && $request->has('district_id')) {
            $query->where('district_id', $request->district_id);
        }

        // Filter by tehsil (only for super admin and district admin)
        if (($role === 'super_admin' || str_contains($role, 'district')) && $request->has('tehsil_id')) {
            $query->where('tehsil_id', $request->tehsil_id);
        }

        // Search by name or membership ID
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('membership_id', 'like', "%{$search}%");
            });
        }

        $members = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Members/Index', [
            'members' => $members,
            'filters' => $request->only(['status', 'district_id', 'tehsil_id', 'search']),
            'districts' => District::with('tehsils')->get(),
            'statuses' => ['pending', 'active', 'suspended', 'resigned', 'deceased'],
            // Only Tehsil Admins (and obviously not regular members) can create members
            // Strict check: Must contain 'tehsil' and NOT 'member'
            'canCreate' => str_contains($role, 'tehsil') && !str_contains($role, 'member'),
            'userRole' => $role,
        ]);
    }

    /**
     * Display district-level transferred members only
     */
    public function districtMembers(Request $request)
    {
        $user = $request->user();
        $role = $user->role;
        
        // Only district admins can access this
        if (!str_contains($role, 'district')) {
            abort(403, 'Only district admins can view district members.');
        }
        
        $query = Member::with(['tehsil.district.state', 'user'])
            ->where('district_id', $user->district_id)
            ->where('member_level', 'district'); // Only transferred members

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by tehsil
        if ($request->has('tehsil_id')) {
            $query->where('tehsil_id', $request->tehsil_id);
        }

        // Search by name or membership ID
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('membership_id', 'like', "%{$search}%");
            });
        }

        $members = $query->latest()->paginate(15)->withQueryString();

        // Get tehsils for this district for filtering
        $tehsils = \App\Models\Tehsil::where('district_id', $user->district_id)->get();

        return Inertia::render('Members/DistrictMembers', [
            'members' => $members,
            'filters' => $request->only(['status', 'tehsil_id', 'search']),
            'tehsils' => $tehsils,
            'statuses' => ['pending', 'active', 'suspended', 'resigned', 'deceased'],
            'userRole' => $role,
        ]);
    }

    /**
     * Show the form for creating a new member
     */
    public function create(Request $request)
    {
        $this->authorize('create', Member::class);
        
        // Enforce Tehsil Admin ONLY
        // State (super_admin) and District admins are NOT allowed
        $role = $request->user()->role;
        
        // Check if role is strictly a tehsil admin role (contains 'tehsil' and NOT 'member')
        $isTehsilAdmin = str_contains($role, 'tehsil') && !str_contains($role, 'member');

        if (!$isTehsilAdmin) {
            abort(403, 'Only Tehsil Admins can create members.');
        }

        return Inertia::render('Members/Create', [
            'states' => State::with('districts.tehsils')->get(),
            'districts' => District::with('tehsils')->get(),
            'tehsils' => Tehsil::with('district')->get(),
            'departments' => \App\Models\Department::where('is_active', true)->orderBy('name')->get(),
            'authScope' => [
                'district_id' => $request->user()->district_id,
                'tehsil_id' => $request->user()->tehsil_id,
                'role' => $request->user()->role,
            ],
        ]);
    }

    /**
     * Store a newly created member
     */
    public function store(StoreMemberRequest $request)
    {
        $this->authorize('create', Member::class);
        
        // Enforce Tehsil Admin ONLY
        $role = $request->user()->role;
        $isTehsilAdmin = str_contains($role, 'tehsil') && !str_contains($role, 'member');

        if (!$isTehsilAdmin) {
            abort(403, 'Only Tehsil Admins can create members.');
        }

        $validated = $request->validated();

        // Map Member Status to Role
        $roleMap = [
            'Member' => 'member',
            'Tehsil Member' => 'tehsil_member',
            'District Member' => 'district_member',
            'State Member' => 'state_member',
        ];

        $userRole = $roleMap[$validated['member_status']] ?? 'member';

        // Create Member in Transaction
        $member = DB::transaction(function () use ($validated, $request, $userRole) {
            
            // Create User
            $user = \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $validated['contact_email'],
                'password' => \Illuminate\Support\Facades\Hash::make('Password@123'),
                'role' => $userRole,
                'district_id' => \App\Models\Tehsil::find($validated['tehsil_id'])->district_id,
                'tehsil_id' => $validated['tehsil_id'],
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            // Get tehsil for membership ID generation
            $tehsil = Tehsil::findOrFail($validated['tehsil_id']);
            
            $membershipId = $this->membershipService->generateMembershipId($tehsil);
            
            // Handle photo upload
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('members/photos', 'public');
            }

            // Create Member
            return Member::create([
                'user_id' => $user->id,
                'membership_id' => $membershipId,
                'tehsil_id' => $validated['tehsil_id'],
                'district_id' => $tehsil->district_id,
                'department_id' => $validated['department_id'] ?? null,
                'employee_category_id' => $validated['employee_category_id'] ?? null,
                'designation_id' => $validated['designation_id'] ?? null,
                'name' => $validated['name'],
                'parentage' => $validated['parentage'],
                'photo_path' => $photoPath,
                'dob' => $validated['dob'],
                'contact_email' => $validated['contact_email'],
                'contact_phone' => $validated['contact_phone'],
                'school_name' => $validated['school_name'],
                'designation' => 'Member', // Default designation to satisfy DB constraint if not nullable
                // 'subject' => null, // removed
                // 'service_join_year' => null, // removed
                'union_join_date' => $validated['union_join_date'],
                'status' => 'pending',
            ]);
        });
        
        // Redirect using prefixed route
        return redirect()->route($this->getRolePrefix($request) . '.members.show', $member)
            ->with('success', 'Member created successfully. Membership ID: ' . $member->membership_id);
    }

    /**
     * Display the specified member
     */
    public function show(Member $member)
    {
        $this->authorize('view', $member);
        
        \Illuminate\Support\Facades\Log::info("Entering show method for member {$member->id}");
        $member->load(['tehsil.district.state', 'user', 'leadershipPositions', 'currentPositions']);

        return Inertia::render('Members/Show', [
            'member' => $member,
        ]);
    }

    /**
     * Show the form for editing the specified member
     */
    public function edit(Request $request, Member $member)
    {
        $this->authorize('update', $member);
        
        // Restrict editing to Admins/Presidents (block tehsil_member)
        $role = $request->user()->role;
        if (str_contains($role, 'member')) {
             abort(403, 'Members cannot edit other members.');
        }

        $member->load(['tehsil.district', 'user']);

        return Inertia::render('Members/Edit', [
            'member' => $member,
            'states' => State::with('districts.tehsils')->get(),
            'districts' => District::with('tehsils')->get(),
            'tehsils' => Tehsil::with('district')->get(),
            'departments' => \App\Models\Department::where('is_active', true)->orderBy('name')->get(),
            'authScope' => [
                'district_id' => $request->user()->district_id,
                'tehsil_id' => $request->user()->tehsil_id,
                'role' => $request->user()->role,
            ],
        ]);
    }

    /**
     * Update the specified member
     */
    public function update(UpdateMemberRequest $request, Member $member)
    {
        $this->authorize('update', $member);
        
        // Restrict updating to Admins/Presidents (block tehsil_member)
        $role = $request->user()->role;
        if (str_contains($role, 'member')) {
             abort(403, 'Members cannot update other members.');
        }

        $validated = $request->validated();

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($member->photo_path) {
                Storage::disk('public')->delete($member->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('members/photos', 'public');
        }

        // Map Member Status to Role if provided
        if (isset($validated['member_status'])) {
            $roleMap = [
                'Member' => 'member',
                'Tehsil Member' => 'tehsil_member',
                'District Member' => 'district_member',
                'State Member' => 'state_member',
            ];
            $userRole = $roleMap[$validated['member_status']] ?? 'member';
            
            // Update User Role
            $member->user->update(['role' => $userRole]);
        }

        // Sync Email to User Model (Login Credentials)
        $member->user->update([
            'email' => $validated['contact_email'] ?? $member->user->email,
        ]);

        $member->update($validated);

        return redirect()->route($this->getRolePrefix($request) . '.members.show', $member)
            ->with('success', 'Member updated successfully.');
    }

    /**
     * Remove the specified member
     */
    public function destroy(Request $request, Member $member)
    {
        $this->authorize('delete', $member);
        
        // Restrict deletion to Admins/Presidents (block tehsil_member)
        $role = $request->user()->role;
        if (str_contains($role, 'member')) {
             abort(403, 'Members cannot delete other members.');
        }

        // Soft delete the member
        $member->delete();

        return redirect()->route($this->getRolePrefix($request) . '.members.index')
            ->with('success', 'Member deleted successfully.');
    }

    /**
     * Approve a pending member
     */
    public function approve(Member $member)
    {
        // Determine member's level for permission check
        $level = $member->tehsil_id ? 'tehsil' : ($member->district_id ? 'district' : 'state');
        
        // Check portfolio permission: member.approve + hierarchical authority
        $this->authorizePortfolio(
            'member.approve',
            'execute',
            $level,
            $member,
            'President action - member approval'
        );
        
        if ($this->membershipService->approveMember($member)) {
            return back()->with('success', 'Member approved successfully.');
        }

        return back()->with('error', 'Member cannot be approved.');
    }

    /**
     * Reject a pending member
     */
    public function reject(Request $request, Member $member)
    {
        // Determine member's level for permission check
        $level = $member->tehsil_id ? 'tehsil' : ($member->district_id ? 'district' : 'state');
        
        // Check portfolio permission
        $this->authorizePortfolio(
            'member.reject',
            'execute',
            $level,
            $member,
            'President action - member rejection'
        );
        
        $reason = $request->input('reason');
        
        if ($this->membershipService->rejectMember($member, $reason)) {
            return redirect()->route($this->getRolePrefix($request) . '.members.index')
                ->with('success', 'Member rejected successfully.');
        }

        return back()->with('error', 'Member cannot be rejected.');
    }

    /**
     * Update star grade
     */
    public function updateStarGrade(Request $request, Member $member)
    {
        $request->validate([
            'star_grade' => 'required|integer|between:0,5',
        ]);

        $member->update(['star_grade' => $request->star_grade]);

        return back()->with('success', 'Star grade updated successfully.');
    }

    /**
     * Update member status manually
     */
    public function updateStatus(Request $request, Member $member)
    {
        \Illuminate\Support\Facades\Log::info("Entering updateStatus method for member {$member->id}");
        $request->validate([
            'status' => 'required|in:pending,active,suspended,resigned,deceased',
        ]);

        $member->update(['status' => $request->status]);

        return back()->with('success', "Member status updated to {$request->status}.");
    }

    /**
     * Suspend a member (REQUIRES DISCIPLINARY RESOLUTION)
     */
    public function suspend(Request $request, Member $member)
    {
        $this->authorize('suspend', $member);
        
        // Validate input
        $validated = $request->validate([
            'resolution_id' => 'required|exists:resolutions,id',
            'execution_notes' => 'nullable|string|max:1000',
        ]);
        
        // Get the resolution
        $resolution = Resolution::findOrFail($validated['resolution_id']);
        
        // Validate resolution can be executed (9-step validation)
        $validation = $this->validateResolutionForExecution(
            $resolution,
            'disciplinary',
            'member_suspension',
            ['member_id' => $member->id]
        );
        
        if (!$validation['valid']) {
            return back()->with('error', $validation['error']);
        }
        
        // Execute with resolution tracking
        try {
            $this->executeWithResolution(
                $resolution,
                function() use ($member, $resolution) {
                    $member->update([
                        'status' => 'suspended',
                        'suspension_resolution_id' => $resolution->id,
                        'suspended_at' => now(),
                        'suspension_reason' => $resolution->title,
                    ]);
                },
                $validated['execution_notes'] ?? null
            );
            
            return redirect()
                ->route($this->getRolePrefix($request) . '.members.index')
                ->with('success', 'Member suspended successfully via Resolution ' . $resolution->resolution_number);
                
        } catch (\Exception $e) {
            return back()->with('error', 'Suspension failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Terminate a member (REQUIRES DISCIPLINARY RESOLUTION)
     */
    public function terminate(Request $request, Member $member)
    {
        $this->authorize('delete', $member); // Using delete policy for terminate
        
        // Validate input
        $validated = $request->validate([
            'resolution_id' => 'required|exists:resolutions,id',
            'execution_notes' => 'nullable|string|max:1000',
        ]);
        
        // Get the resolution
        $resolution = Resolution::findOrFail($validated['resolution_id']);
        
        // Validate resolution can be executed (9-step validation)
        $validation = $this->validateResolutionForExecution(
            $resolution,
            'disciplinary',
            'member_termination',
            ['member_id' => $member->id]
        );
        
        if (!$validation['valid']) {
            return back()->with('error', $validation['error']);
        }
        
        // Execute with resolution tracking
        try {
            $this->executeWithResolution(
                $resolution,
                function() use ($member, $resolution) {
                    $member->update([
                        'status' => 'terminated',
                        'termination_resolution_id' => $resolution->id,
                        'terminated_at' => now(),
                        'termination_reason' => $resolution->title,
                    ]);
                },
                $validated['execution_notes'] ?? null
            );
            
            return redirect()
                ->route($this->getRolePrefix($request) . '.members.index')
                ->with('success', 'Member terminated successfully via Resolution ' . $resolution->resolution_number);
                
        } catch (\Exception $e) {
            return back()->with('error', 'Termination failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Reinstate a suspended or terminated member (REQUIRES DISCIPLINARY RESOLUTION)
     */
    public function reinstate(Request $request, Member $member)
    {
        // Check current status
        if (!in_array($member->status, ['suspended', 'terminated'])) {
            return back()->with('error', 'Member is not currently suspended or terminated.');
        }
        
        // Validate input
        $validated = $request->validate([
            'resolution_id' => 'required|exists:resolutions,id',
            'execution_notes' => 'nullable|string|max:1000',
        ]);
        
        // Get the resolution
        $resolution = Resolution::findOrFail($validated['resolution_id']);
        
        // Validate resolution can be executed
        $validation = $this->validateResolutionForExecution(
            $resolution,
            'disciplinary',
            'member_reinstatement',
            ['member_id' => $member->id]
        );
        
        if (!$validation['valid']) {
            return back()->with('error', $validation['error']);
        }
        
        // Execute with resolution tracking
        try {
            $this->executeWithResolution(
                $resolution,
                function() use ($member) {
                    $member->update([
                        'status' => 'active',
                        'suspension_resolution_id' => null,
                        'suspended_at' => null,
                        'suspension_reason' => null,
                        'termination_resolution_id' => null,
                        'terminated_at' => null,
                        'termination_reason' => null,
                    ]);
                },
                $validated['execution_notes'] ?? null
            );
            
            return redirect()
                ->route($this->getRolePrefix($request) . '.members.index')
                ->with('success', 'Member reinstated successfully via Resolution ' . $resolution->resolution_number);
                
        } catch (\Exception $e) {
            return back()->with('error', 'Reinstatement failed: ' . $e->getMessage());
        }
    }


    /**
     * Get employee categories for a specific department (API for dependent dropdown)
     */
    public function getDepartmentCategories($departmentId)
    {
        try {
            $department = \App\Models\Department::findOrFail($departmentId);
            $categories = $department->employeeCategories()
                ->where('employee_categories.is_active', true)
                ->orderBy('employee_categories.name')
                ->get(['employee_categories.id', 'employee_categories.code', 'employee_categories.name']);
            
            return response()->json($categories);
        } catch (\Exception $e) {
            \Log::error('Error fetching department categories: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get designations for a specific employee category (API for dependent dropdown)
     */
    public function getCategoryDesignations($categoryId)
    {
        try {
            $category = \App\Models\EmployeeCategory::findOrFail($categoryId);
            $designations = $category->designations()
                ->where('designations.is_active', true)
                ->orderBy('designations.name')
                ->get(['designations.id', 'designations.name', 'designations.short_code']);
            
            return response()->json($designations);
        } catch (\Exception $e) {
            \Log::error('Error fetching category designations: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
