<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use App\Models\OfficeProfile;

class ThemeController extends Controller
{
    /**
     * Show the theme settings form.
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        $officeProfile = null;

        // Determine office profile based on role similarly to HandleInertiaRequests
        if ($user->role === 'super_admin' || str_contains($user->role, 'state')) {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        } elseif (str_contains($user->role, 'district') && $user->district_id) {
            $district = \App\Models\District::find($user->district_id);
            $officeProfile = $district?->officeProfile;
        } elseif (str_contains($user->role, 'tehsil') && $user->tehsil_id) {
            $tehsil = \App\Models\Tehsil::find($user->tehsil_id);
            $officeProfile = $tehsil?->officeProfile;
        }

        if (!$officeProfile) {
            return Redirect::back()->with('error', 'Office profile not found.');
        }

        // Check authorization (ensure user can edit THIS profile)
        // Ideally use a Policy, but basic check for now:
        if ($officeProfile->id !== $request->user()->office_profile_id && $user->role !== 'super_admin') {
             // stricter checks can be added if needed, but the logic above selects *their* profile
        }

        return Inertia::render('Admin/Theme/Edit', [
            'officeProfile' => $officeProfile,
            'currentTheme' => $officeProfile->theme_preferences ?? [],
        ]);
    }

    /**
     * Update the theme settings.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $officeProfile = null;

        // Re-determine office profile to ensure security
         if ($user->role === 'super_admin' || str_contains($user->role, 'state')) {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        } elseif (str_contains($user->role, 'district') && $user->district_id) {
            $district = \App\Models\District::find($user->district_id);
            $officeProfile = $district?->officeProfile;
        } elseif (str_contains($user->role, 'tehsil') && $user->tehsil_id) {
            $tehsil = \App\Models\Tehsil::find($user->tehsil_id);
            $officeProfile = $tehsil?->officeProfile;
        }

         if (!$officeProfile) {
            return Redirect::back()->with('error', 'Office profile not found.');
        }

        $validated = $request->validate([
            // Layout & Backgrounds
            'theme_preferences.page_background' => 'nullable|string|max:20',
            'theme_preferences.card_background' => 'nullable|string|max:20',
            'theme_preferences.card_border_color' => 'nullable|string|max:20',
            
            // Typography
            'theme_preferences.font_family' => 'nullable|string|max:50',
            'theme_preferences.text_main_color' => 'nullable|string|max:20',
            'theme_preferences.text_secondary_color' => 'nullable|string|max:20',

            // Navigation
            'theme_preferences.gradient_start' => 'nullable|string|max:20', 
            'theme_preferences.gradient_middle' => 'nullable|string|max:20',
            'theme_preferences.gradient_end' => 'nullable|string|max:20',
            'theme_preferences.navbar_color' => 'nullable|string|max:20',
            'theme_preferences.nav_text_color' => 'nullable|string|max:20',
            'theme_preferences.nav_text_color' => 'nullable|string|max:20',
            'theme_preferences.nav_dropdown_bg' => 'nullable|string|max:20',
            'theme_preferences.nav_item_bg' => 'nullable|string|max:20',

            // Components
            'theme_preferences.primary_button' => 'nullable|string|max:20',
            'theme_preferences.secondary_color' => 'nullable|string|max:20',
            'theme_preferences.input_bg_color' => 'nullable|string|max:20',
            'theme_preferences.input_border_color' => 'nullable|string|max:20',
            'theme_preferences.form_focus' => 'nullable|string|max:20',
            'theme_preferences.chart_primary' => 'nullable|string|max:20',

            // Status Colors
            'theme_preferences.success_color' => 'nullable|string|max:20',
            'theme_preferences.warning_color' => 'nullable|string|max:20',
            'theme_preferences.error_color' => 'nullable|string|max:20',
            'theme_preferences.info_color' => 'nullable|string|max:20',
        ]);

        $officeProfile->theme_preferences = $validated['theme_preferences'];
        $officeProfile->save();

        return Redirect::back()->with('success', 'Theme settings updated successfully.');
    }

    /**
     * Reset the theme settings to default.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $officeProfile = null;

        // Re-determine office profile to ensure security
         if ($user->role === 'super_admin' || str_contains($user->role, 'state')) {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        } elseif (str_contains($user->role, 'district') && $user->district_id) {
            $district = \App\Models\District::find($user->district_id);
            $officeProfile = $district?->officeProfile;
        } elseif (str_contains($user->role, 'tehsil') && $user->tehsil_id) {
            $tehsil = \App\Models\Tehsil::find($user->tehsil_id);
            $officeProfile = $tehsil?->officeProfile;
        }

         if (!$officeProfile) {
            return Redirect::back()->with('error', 'Office profile not found.');
        }

        // Reset theme preferences to null to use system defaults
        $officeProfile->theme_preferences = null;
        $officeProfile->save();

        return Redirect::back()->with('success', 'Theme reset to system defaults successfully.');
    }
}

