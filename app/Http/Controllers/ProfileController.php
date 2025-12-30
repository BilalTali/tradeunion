<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        // Load member data specifically for photo access and location relationships
        $user->load(['member', 'district', 'tehsil']);

        // Get state (always Jammu & Kashmir for now)
        $state = \App\Models\State::first();
        
        // Get all districts and tehsils for dropdown selection
        $districts = \App\Models\District::orderBy('name')->get();
        $tehsils = \App\Models\Tehsil::with('district')->orderBy('name')->get();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'state' => $state,
            'district' => $user->district,
            'tehsil' => $user->tehsil,
            'districts' => $districts,
            'tehsils' => $tehsils,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Handle Photo Upload with strict validation
        if ($request->hasFile('photo')) {
            $request->validate([
                'photo' => [
                    'required',
                    'image',
                    'mimes:jpeg,png,jpg', // Strict MIME types (no gif for security)
                    'max:2048', // 2MB max
                    'dimensions:min_width=200,min_height=200,max_width=4000,max_height=4000' // Reasonable dimensions
                ]
            ]);
            
            
            $user = $request->user();
            
            // If user has a linked Member record, save photo to Member
            if ($user->member) {
                $member = $user->member;
                
                // Delete old photo
                if ($member->photo_path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($member->photo_path);
                }
                
                // Store new photo
                $path = $request->file('photo')->store('members/photos', 'public');
                $member->update(['photo_path' => $path]);
            } else {
                // Otherwise, save photo directly to User (for Admins)
                // Delete old photo
                if ($user->photo_path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->photo_path);
                }
                
                // Store new photo
                $path = $request->file('photo')->store('admins/photos', 'public');
                $user->update(['photo_path' => $path]);
            }
        }

        return Redirect::route($this->getRoutePrefix($request->user()) . '.profile.edit');
    }

    /**
     * Get route prefix based on user role
     */
    private function getRoutePrefix($user): string
    {
        $role = $user->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district') && !str_contains($role, 'member')) return 'district';
        if (str_contains($role, 'tehsil') && !str_contains($role, 'member')) return 'tehsil';
        return 'member';
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Restrict Members from deleting their own account
        if (in_array($request->user()->role, ['member', 'tehsil_member', 'district_member', 'state_member'])) {
            abort(403, 'Members cannot delete their own account. Please contact your union representative.');
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

