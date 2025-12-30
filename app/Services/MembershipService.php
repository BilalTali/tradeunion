<?php

namespace App\Services;

use App\Models\Member;
use App\Models\Tehsil;

class MembershipService
{
    /**
     * Generate unique membership ID
     * Format: JKTU-DIST-TEHSIL-2024-0001
     */
    /**
     * Generate unique membership ID
     * Format: JK-25-00001 (11 chars)
     * Prefix (2) - Year (2) - Sequence (5)
     */
    /**
     * Generate unique membership ID
     * Format: JKBUDKH0001 (11 chars)
     * JK (2) + District Name (3) + Tehsil Name (2) + Sequence (4)
     */
    public function generateMembershipId(Tehsil $tehsil): string
    {
        // 1. Prefix: JK (Fixed for J&K or from state code)
        $prefix = 'JK'; 

        // 2. District: First 3 chars of Name (e.g., BUDGAM -> BUD)
        $distShort = strtoupper(substr($tehsil->district->name, 0, 3));

        // 3. Tehsil: First 2 chars of Name (e.g., KHAG -> KH)
        $tehsilShort = strtoupper(substr($tehsil->name, 0, 2));
        
        // Pattern: JKBUDKH%
        $base = $prefix . $distShort . $tehsilShort;
        
        $lastMember = Member::withTrashed()
            ->where('membership_id', 'like', $base . '%')
            ->orderBy('membership_id', 'desc')
            ->first();
        
        if ($lastMember) {
            // Extract last 4 digits (assuming standard length)
            // If the previous ID logic was different, this might need care, 
            // but for new pattern it is safe.
            // We use simple regex or string parsing to get the number.
            // Since strict format, take last 4.
            $lastSequence = intval(substr($lastMember->membership_id, -4));
            $sequence = $lastSequence + 1;
        } else {
            $sequence = 1;
        }
        
        // Format: JKBUDKH0001
        return sprintf('%s%04d', $base, $sequence);
    }

    /**
     * Approve a pending member
     */
    public function approveMember(Member $member): bool
    {
        if ($member->status !== 'pending') {
            return false;
        }

        $member->update(['status' => 'active']);
        
        // TODO: Send welcome email
        
        return true;
    }

    /**
     * Reject a pending member
     */
    public function rejectMember(Member $member, ?string $reason = null): bool
    {
        if ($member->status !== 'pending') {
            return false;
        }

        // Soft delete the member
        $member->delete();
        
        // TODO: Send rejection email with reason
        
        return true;
    }
}
