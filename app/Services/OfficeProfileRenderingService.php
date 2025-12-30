<?php

namespace App\Services;

use App\Models\OfficeProfile;
use App\Models\State;
use App\Models\District;
use App\Models\Tehsil;

class OfficeProfileRenderingService
{
    /**
     * Get office profile for current authenticated user
     */
    public function getCurrentOfficeProfile(): ?OfficeProfile
    {
        $user = auth()->user();
        
        if (!$user) {
            return null;
        }
        
        return $this->getOfficeProfileForUser($user);
    }
    
    /**
     * Get office profile for a specific user
     */
    public function getOfficeProfileForUser($user): ?OfficeProfile
    {
        // 1. Explicit Role-based Matching (Admins/Portfolio holders)
        if ($user->role === 'super_admin' || str_contains($user->role, 'state')) {
            $state = State::first();
            if ($state?->officeProfile) return $state->officeProfile;
        }
        
        if (str_contains($user->role, 'district') && $user->district_id) {
            $district = District::find($user->district_id);
            if ($district?->officeProfile) return $district->officeProfile;
        }
        
        if (str_contains($user->role, 'tehsil') && $user->tehsil_id) {
            $tehsil = Tehsil::find($user->tehsil_id);
            if ($tehsil?->officeProfile) return $tehsil->officeProfile;
        }

        // 2. Cascading Fallback for Regular Users (Members)
        // Priority: Tehsil -> District -> State
        if ($user->tehsil_id) {
            $tehsil = Tehsil::with('officeProfile')->find($user->tehsil_id);
            if ($tehsil?->officeProfile) return $tehsil->officeProfile;
            
            // If tehsil has no profile, try its parent district
            $tehsil->load('district.officeProfile');
            if ($tehsil->district?->officeProfile) return $tehsil->district->officeProfile;
        }

        if ($user->district_id) {
            $district = District::with('officeProfile')->find($user->district_id);
            if ($district?->officeProfile) return $district->officeProfile;
        }

        // Final Fallback: State Profile
        $state = State::with('officeProfile')->first();
        return $state?->officeProfile;
    }
    
    /**
     * Get office profile by entity (State/District/Tehsil)
     */
    public function getOfficeProfileByEntity($entity): ?OfficeProfile
    {
        if (!$entity) {
            return null;
        }
        
        return $entity->officeProfile;
    }
    
    /**
     * Get PDF header HTML for rendering
     */
    public function getHeaderHTML(OfficeProfile $profile): string
    {
        return view('pdf.partials.office-header', compact('profile'))->render();
    }
    
    /**
     * Get PDF footer HTML for rendering
     */
    public function getFooterHTML(OfficeProfile $profile): string
    {
        return view('pdf.partials.office-footer', compact('profile'))->render();
    }
    
    /**
     * Get watermark CSS for PDF background
     */
    public function getWatermarkCSS(OfficeProfile $profile): string
    {
        if (!$profile->watermark_logo_path) {
            return '';
        }
        
        $logoUrl = asset('storage/' . $profile->watermark_logo_path);
        
        return "
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.08;
                z-index: -1;
                width: 500px;
                height: 500px;
                background-image: url('{$logoUrl}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
        ";
    }
    
    /**
     * Get letterhead styles as array for inline CSS
     */
    public function getLetterheadStyles(OfficeProfile $profile): array
    {
        return [
            'primaryColor' => $profile->primary_color ?? '#1e40af',
            'secondaryColor' => $profile->secondary_color ?? '#075985',
            'borderColor' => $profile->border_color ?? '#000000',
            'borderStyle' => $profile->border_style ?? 'single',
            'fontFamily' => $profile->font_family ?? 'Arial',
            'headerAlignment' => $profile->header_alignment ?? 'center',
        ];
    }
    
    /**
     * Get common PDF options
     */
    public function getPDFOptions(): array
    {
        return [
            'dpi' => 150,
            'defaultFont' => 'sans-serif',
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
        ];
    }
    
    /**
     * Prepare data for PDF views
     */
    public function preparePDFData(?OfficeProfile $profile = null): array
    {
        $profile = $profile ?? $this->getCurrentOfficeProfile();
        
        if (!$profile) {
            return [
                'hasOfficeProfile' => false,
                'officeProfile' => null,
                'styles' => [],
            ];
        }
        
        return [
            'hasOfficeProfile' => true,
            'officeProfile' => $profile,
            'styles' => $this->getLetterheadStyles($profile),
            'watermarkCSS' => $this->getWatermarkCSS($profile),
        ];
    }
}

