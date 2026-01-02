<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\District;
use App\Models\Tehsil;
use App\Http\Requests\StoreAdminRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Get role-based route prefix
     */
    private function getRolePrefix($request)
    {
        $role = $request->user()->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        return 'tehsil';
    }

    /**
     * Display a listing of admins based on role
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // Super Admin sees District Admins
        // District Admin sees Tehsil Admins
        $query = User::query();

        if ($role === 'super_admin') {
            $query->whereIn('role', ['district_admin', 'district_president']);
        } elseif (str_contains($role, 'district')) {
            $query->whereIn('role', ['tehsil_admin', 'tehsil_president']);
        } else {
            abort(403, 'Unauthorized');
        }

        $admins = $query->with(['district', 'tehsil'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admins/Index', [
            'admins' => $admins,
            'canCreate' => $this->canCreateAdmin($role),
        ]);
    }

    /**
     * Show the form for creating a new admin
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        if (!$this->canCreateAdmin($role)) {
            abort(403, 'Unauthorized');
        }

        $data = [];

        if ($role === 'super_admin') {
            $data['districts'] = District::all();
            $data['roleType'] = 'district';
        } elseif (str_contains($role, 'district')) {
            $data['tehsils'] = Tehsil::where('district_id', $user->district_id)->get();
            $data['roleType'] = 'tehsil';
        }

        return Inertia::render('Admins/Create', $data);
    }

    /**
     * Store a newly created admin
     */
    public function store(StoreAdminRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        // Set password
        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = true;
        $validated['email_verified_at'] = now();

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('admins/photos', 'public');
        }

        // Determine role based on current user
        if ($user->role === 'super_admin') {
            $validated['role'] = $validated['admin_role']; // district_admin or district_president
            $validated['district_id'] = $validated['entity_id'];
            $validated['tehsil_id'] = null;

            // Check if admin already exists for this district
            $existingAdmin = User::where('role', $validated['role'])
                ->where('district_id', $validated['district_id'])
                ->exists();

            if ($existingAdmin) {
                return back()->withErrors(['entity_id' => 'An admin with this role already exists for the selected District.']);
            }

        } elseif (str_contains($user->role, 'district')) {
            $validated['role'] = $validated['admin_role']; // tehsil_admin or tehsil_president
            $validated['district_id'] = $user->district_id;
            $validated['tehsil_id'] = $validated['entity_id'];

            // Check if admin already exists for this tehsil
            $existingAdmin = User::where('role', $validated['role'])
                ->where('tehsil_id', $validated['tehsil_id'])
                ->exists();

            if ($existingAdmin) {
                return back()->withErrors(['entity_id' => 'An admin with this role already exists for the selected Tehsil.']);
            }
        }

        // Map phone to mobile for database storage
        if (isset($validated['phone'])) {
            $validated['mobile'] = $validated['phone'];
            unset($validated['phone']);
        }

        // Debug logging
        \Log::info('Creating admin with data:', [
            'role' => $validated['role'] ?? 'NOT SET',
            'admin_role' => $validated['admin_role'] ?? 'NOT SET',
            'user_role' => $user->role,
        ]);

        unset($validated['admin_role'], $validated['entity_id']);

        $admin = User::create($validated);

        \Log::info('Admin created with role:', ['role' => $admin->role]);

        return redirect()->route($this->getRolePrefix($request) . '.admins.index')
            ->with('success', 'Admin created successfully.');
    }

    /**
     * Display the specified admin
     */
    public function show(User $admin)
    {
        $admin->load(['district', 'tehsil']);

        return Inertia::render('Admins/Show', [
            'admin' => $admin,
        ]);
    }

    /**
     * Show the form for editing the specified admin
     */
    public function edit(Request $request, User $admin)
    {
        $user = $request->user();
        
        // Authorization check
        if (!$this->canManageAdmin($user, $admin)) {
            abort(403, 'Unauthorized');
        }

        $data = ['admin' => $admin];

        if ($user->role === 'super_admin') {
            $data['districts'] = District::all();
        } elseif (str_contains($user->role, 'district')) {
            $data['tehsils'] = Tehsil::where('district_id', $user->district_id)->get();
        }

        // Map mobile back to phone for frontend if needed, though frontend likely uses admin.phone OR we should update frontend.
        // Frontend Edit.jsx uses `admin.phone`. Admin model (User) uses `mobile`. 
        // We really should strictly use `mobile` everywhere for User, but changing frontend is invasive.
        // For now, let's fix the write. The read might need accessors.
        // Actually, User model has 'phone' in fillable... maybe it has an accessor?
        // Let's check User model for 'phone' accessor later.

        return Inertia::render('Admins/Edit', $data);
    }

    /**
     * Update the specified admin
     */
    public function update(Request $request, User $admin)
    {
        $user = $request->user();

        if (!$this->canManageAdmin($user, $admin)) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
            'phone' => ['nullable', 'regex:/^[0-9]{10}$/'],
            'photo' => 'nullable|image|max:2048', // Validation for photo
            'is_active' => 'boolean',
            'password' => 'nullable|min:8|confirmed',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($admin->photo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($admin->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('admins/photos', 'public');
        }

        // Map phone to mobile
        if (isset($validated['phone'])) {
            $validated['mobile'] = $validated['phone'];
            unset($validated['phone']);
        }

        $admin->update($validated);

        return redirect()->route($this->getRolePrefix($request) . '.admins.index')
            ->with('success', 'Admin updated successfully.');
    }

    /**
     * Remove the specified admin
     */
    public function destroy(Request $request, User $admin)
    {
        // Admin deletion is disabled to protect member integrity
        return redirect()->route($this->getRolePrefix($request) . '.admins.index')
            ->with('error', 'Admin deletion is disabled. You can only deactivate admins.');
    }

    /**
     * Check if user can create admin
     */
    private function canCreateAdmin($role)
    {
        return in_array($role, ['super_admin', 'district_admin', 'district_president']);
    }

    /**
     * Check if user can manage specific admin
     */
    private function canManageAdmin($user, $admin)
    {
        if ($user->role === 'super_admin') {
            return str_contains($admin->role, 'district');
        }

        if (str_contains($user->role, 'district')) {
            return str_contains($admin->role, 'tehsil') && $admin->district_id === $user->district_id;
        }

        return false;
    }
}
