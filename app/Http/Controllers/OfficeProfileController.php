<?php

namespace App\Http\Controllers;

use App\Models\OfficeProfile;
use App\Models\State;
use App\Models\District;
use App\Models\Tehsil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OfficeProfileController extends Controller
{
    /**
     * Show office profile (or redirect to edit if not exists)
     */
    public function show(Request $request)
    {
        $profile = $this->getOfficeProfile($request->user());
        
        if (!$profile) {
            return redirect()->route($this->getRoutePrefix() . '.office-profile.edit');
        }
        
        return Inertia::render('OfficeProfile/Show', [
            'profile' => $profile->load('entity', 'creator'),
            'entity' => $this->getEntity($request->user()),
        ]);
    }
    
    /**
     * Show edit form
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        $profile = $this->getOfficeProfile($user);
        $entity = $this->getEntity($user);
        
        // Get state organization name for district/zone levels
        $stateOrgName = null;
        $stateName = null;
        $districtName = null;
        $stateProfile = null;
        
        if (str_contains($user->role, 'district')) {
            // District level - get state info
            $state = \App\Models\State::first();
            $stateProfile = $state?->officeProfile;
            $stateOrgName = $stateProfile?->organization_name ?? 'Jammu and Kashmir';
            $stateName = $state?->name ?? 'Jammu and Kashmir';
        } elseif (str_contains($user->role, 'tehsil')) {
            // Tehsil level - get state and district info
            $state = \App\Models\State::first();
            $stateProfile = $state?->officeProfile;
            $stateOrgName = $stateProfile?->organization_name ?? 'Jammu and Kashmir';
            $stateName = $state?->name ?? 'Jammu and Kashmir';
            
            $district = null;
            if ($user->district_id) {
                $district = \App\Models\District::find($user->district_id);
            }
            
            if (!$district && $user->tehsil_id) {
                $tehsil = \App\Models\Tehsil::with('district')->find($user->tehsil_id);
                $district = $tehsil?->district;
            }
            $districtName = $district?->name;
        }
        
        // Create profile if doesn't exist
        if (!$profile && $entity) {
            $profileData = [
                'entity_type' => get_class($entity),
                'entity_id' => $entity->id,
                'level' => $this->getLevel($user->role),
                'full_address' => $entity->office_address ?? 'Not Set',
                'primary_email' => $user->email,
                'created_by' => $user->id,
            ];
            
            // Set organization_name based on level
            if (str_contains($user->role, 'state') || $user->role === 'super_admin') {
                $profileData['organization_name'] = $entity->name ?? 'Not Set';
            } else {
                // District/Zone inherits from state
                $profileData['organization_name'] = $stateOrgName ?? 'Not Set';
            }
            
            // Set district/tehsil field for district/tehsil
            if (str_contains($user->role, 'district') || str_contains($user->role, 'tehsil')) {
                $profileData['state'] = $stateName;
            }
            
            // Set district field for tehsil
            if (str_contains($user->role, 'tehsil')) {
                $profileData['district'] = $districtName;
            }
            
            $profile = OfficeProfile::create($profileData);
            $profile->updateCompletion();
        }
        
        return Inertia::render('OfficeProfile/Edit', [
            'profile' => $profile,
            'entity' => $entity,
            'completionPercentage' => $profile ? $profile->completion_percentage : 0,
            'stateOrgName' => $stateOrgName,
            'stateName' => $stateName,
            'districtName' => $districtName,
            'userLevel' => $this->getLevel($user->role),
            'stateProfile' => $stateProfile, // Pass full state profile for form inheritance
        ]);
    }
    
    /**
     * Update office profile
     */
    public function update(Request $request)
    {
        $profile = $this->getOfficeProfile($request->user());
        
        if (!$profile) {
            return back()->with('error', 'Office profile not found. Please contact support.');
        }
        
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:100',
            'affiliation_text' => 'nullable|string',
            'federation_name' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:100',
            'established_date' => 'nullable|date',
            'full_address' => 'required|string',
            'district' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pin_code' => 'nullable|string|max:10',
            'primary_email' => 'required|email',
            'secondary_email' => 'nullable|email',
            'contact_numbers' => 'nullable|array',
            'contact_numbers.*' => 'nullable|string|max:20',
            'website' => 'nullable|url',
            'header_title' => 'nullable|string|max:255',
            'header_subtitle' => 'nullable|string|max:255',
            'header_alignment' => 'nullable|in:left,center,right',
            'border_style' => 'nullable|in:none,single,double',
            'border_color' => 'nullable|string|max:7',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
            'font_family' => 'nullable|string|max:50',
            'footer_line_1' => 'nullable|string',
            'footer_line_2' => 'nullable|string',
            'footer_line_3' => 'nullable|string',
            'show_footer_separator' => 'nullable|boolean',
        ]);
        
        $profile->fill($validated);
        $profile->updated_by = $request->user()->id;
        $profile->save();
        
        // Recalculate completion percentage
        $profile->updateCompletion();
        
        $message = $profile->is_complete 
            ? 'Office profile updated successfully! Profile is now complete.'
            : "Office profile updated successfully. Completion: {$profile->completion_percentage}%";
        
        return back()->with('success', $message);
    }
    
    /**
     * Upload logo/asset file
     */
    public function uploadAsset(Request $request, string $assetType)
    {
        $isConstitution = $assetType === 'constitution';
        
        $request->validate([
            'file' => [
                'required',
                'file',
                $isConstitution ? 'mimes:pdf' : 'mimes:jpeg,png,jpg,svg',
                $isConstitution ? 'max:10240' : 'max:2048' // 10MB for PDF, 2MB for Images
            ],
        ]);
        
        $profile = $this->getOfficeProfile($request->user());
        
        if (!$profile) {
            return back()->with('error', 'Office profile not found.');
        }
        
        // Validate asset type
        $validAssetTypes = ['primary_logo', 'header_logo', 'watermark_logo', 'constitution'];
        if (!in_array($assetType, $validAssetTypes)) {
            return back()->with('error', 'Invalid asset type.');
        }
        
        $fieldName = $assetType . '_path';
        
        // Delete old file if exists
        if ($profile->$fieldName) {
            Storage::disk('public')->delete($profile->$fieldName);
        }
        
        // Store new file in office-profiles directory
        $path = $request->file('file')->store('office-profiles/' . $assetType, 'public');
        
        $profile->$fieldName = $path;
        $profile->updated_by = $request->user()->id;
        $profile->save();
        
        // Update completion
        $profile->updateCompletion();
        
        $assetLabel = ucwords(str_replace('_', ' ', $assetType));
        
        return back()->with('success', "{$assetLabel} uploaded successfully. Completion: {$profile->completion_percentage}%");
    }
    
    /**
     * Delete asset file
     */
    public function deleteAsset(Request $request, string $assetType)
    {
        $profile = $this->getOfficeProfile($request->user());
        
        if (!$profile) {
            return back()->with('error', 'Office profile not found.');
        }
        
        $fieldName = $assetType . '_path';
        
        if ($profile->$fieldName) {
            // Delete from storage
            Storage::disk('public')->delete($profile->$fieldName);
            
            // Clear database field
            $profile->$fieldName = null;
            $profile->updated_by = $request->user()->id;
            $profile->save();
            
            // Update completion
            $profile->updateCompletion();
        }
        
        $assetLabel = ucwords(str_replace('_', ' ', $assetType));
        
        return back()->with('success', "{$assetLabel} deleted successfully.");
    }
    
    // ==================== Helper Methods ====================
    
    /**
     * Get office profile for current user
     */
    private function getOfficeProfile($user)
    {
        $entity = $this->getEntity($user);
        return $entity?->officeProfile;
    }
    
    /**
     * Get entity (State/District/Tehsil) for user
     */
    private function getEntity($user)
    {
        if (!$user) return null;
        
        $role = $user->role;

        if ($role === 'super_admin' || str_contains($role, 'state')) {
            return \App\Models\State::first();
        } 
        
        if (str_contains($role, 'district') && $user->district_id) {
            return \App\Models\District::find($user->district_id);
        } 
        
        if (str_contains($role, 'tehsil') && $user->tehsil_id) {
            return \App\Models\Tehsil::find($user->tehsil_id);
        }
        
        // Fallback for members or other roles
        if ($user->tehsil_id) return \App\Models\Tehsil::find($user->tehsil_id);
        if ($user->district_id) return \App\Models\District::find($user->district_id);

        return null;
    }
    
    /**
     * Get level string from user role
     */
    private function getLevel($role): string
    {
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        return 'state';
    }
    
    /**
     * Get route prefix based on current user role
     */
    private function getRoutePrefix(): string
    {
        $role = auth()->user()->role ?? 'state';
        
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        if (str_contains($role, 'tehsil')) return 'tehsil';
        
        return 'state';
    }
}
