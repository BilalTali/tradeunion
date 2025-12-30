<?php

namespace App\Http\Controllers;

use App\Models\LeadershipPosition;
use App\Models\PortfolioHolderAuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class PortfolioHolderProfileController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Display portfolio holder profile for admin editing
     */
    public function show(LeadershipPosition $position)
    {
        // Authorization check
        $this->authorize('managePortfolioHolder', $position);
        
        $position->load(['member', 'portfolio', 'assignedBy', 'auditLogs.user']);
        
        return Inertia::render('PortfolioHolders/Profile', [
            'position' => $position,
            'member' => $position->member,
            'portfolio' => $position->portfolio,
        ]);
    }

    /**
     * Show edit form for portfolio holder authority data
     */
    public function edit(LeadershipPosition $position)
    {
        // Authorization check
        $this->authorize('managePortfolioHolder', $position);
        
        // Prevent self-editing
        if ($position->member->user_id === auth()->id()) {
            abort(403, 'You cannot edit your own authority data.');
        }
        
        $position->load(['member', 'portfolio']);
        
        return Inertia::render('PortfolioHolders/Edit', [
            'position' => $position,
            'member' => $position->member,
            'portfolio' => $position->portfolio,
        ]);
    }

    /**
     * Update portfolio holder authority data
     */
    public function update(Request $request, LeadershipPosition $position)
    {
        // Authorization check
        $this->authorize('managePortfolioHolder', $position);
        
        // Prevent self-editing
        if ($position->member->user_id === auth()->id()) {
            abort(403, 'You cannot edit your own authority data.');
        }
        
        // Validate with mandatory remark
        $validated = $request->validate([
            'admin_remarks' => 'required|string|min:10',
            'appointment_order_number' => 'nullable|string|max:255',
            'appointment_date' => 'nullable|date',
            'appointing_authority' => 'nullable|string|max:255',
            'status' => 'required|in:active,relieved,suspended',
            'signature_valid_from' => 'nullable|date',
            'signature_valid_to' => 'nullable|date|after:signature_valid_from',
            'portfolio_accepted_at' => 'nullable|date',
            'conflict_of_interest_declaration' => 'nullable|array',
            'election_neutrality_declaration' => 'nullable|array',
        ]);
        
        // Track changes for audit log
        $changes = [];
        foreach ($validated as $field => $value) {
            if ($field === 'admin_remarks') continue; // Don't audit the remark itself
            
            if ($position->{$field} != $value) {
                $changes[$field] = [
                    'old' => $position->{$field},
                    'new' => $value,
                ];
            }
        }
        
        // Update position
        $position->update(array_merge($validated, [
            'last_modified_by' => auth()->id(),
        ]));
        
        // Log each change
        foreach ($changes as $field => $change) {
            PortfolioHolderAuditLog::create([
                'leadership_position_id' => $position->id,
                'user_id' => auth()->id(),
                'action' => 'updated',
                'field_changed' => $field,
                'old_value' => $change['old'],
                'new_value' => $change['new'],
                'remark' => $validated['admin_remarks'],
            ]);
        }
        
        $prefix = $this->getRoutePrefix();
        return redirect()->route("$prefix.portfolio-holders.show", $position)
            ->with('success', 'Portfolio holder profile updated successfully.');
    }

    /**
     * Upload signature specimen
     */
    public function uploadSignature(Request $request, LeadershipPosition $position)
    {
        // Authorization check
        $this->authorize('managePortfolioHolder', $position);
        
        // Prevent self-editing
        if ($position->member->user_id === auth()->id()) {
            abort(403, 'You cannot edit your own authority data.');
        }
        
        $request->validate([
            'signature' => 'required|image|max:2048', // 2MB max
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after:valid_from',
            'admin_remarks' => 'required|string|min:10',
        ]);
        
        // Delete old signature if exists
        if ($position->signature_path) {
            Storage::disk('private')->delete($position->signature_path);
        }
        
        // Process and resize signature to 300x80px
        $manager = new ImageManager(new Driver());
        $image = $manager->read($request->file('signature'));
        $image->cover(300, 80); // Resize to web-optimized signature size
        
        // Generate unique filename
        $filename = 'signature_' . $position->id . '_' . time() . '.png';
        $path = 'signatures/' . $filename;
        
        // Save to private disk
        Storage::disk('private')->put($path, (string) $image->toPng());
        
        // Update position
        $oldPath = $position->signature_path;
        $position->update([
            'signature_path' => $path,
            'signature_valid_from' => $request->valid_from,
            'signature_valid_to' => $request->valid_to,
            'last_modified_by' => auth()->id(),
        ]);
        
        // Audit log
        PortfolioHolderAuditLog::create([
            'leadership_position_id' => $position->id,
            'user_id' => auth()->id(),
            'action' => 'signature_uploaded',
            'field_changed' => 'signature_path',
            'old_value' => $oldPath,
            'new_value' => $path,
            'remark' => $request->admin_remarks,
        ]);
        
        return back()->with('success', 'Signature uploaded successfully.');
    }

    /**
     * Upload official seal
     */
    public function uploadSeal(Request $request, LeadershipPosition $position)
    {
        // Authorization check
        $this->authorize('managePortfolioHolder', $position);
        
        $request->validate([
            'seal' => 'required|image|max:2048',
            'admin_remarks' => 'required|string|min:10',
        ]);
        
        // Delete old seal if exists
        if ($position->seal_image_path) {
            Storage::disk('private')->delete($position->seal_image_path);
        }
        
        // Process and resize seal to 1000x1000px (High Resolution Square)
        $manager = new ImageManager(new Driver());
        $image = $manager->read($request->file('seal'));
        $image->cover(1000, 1000); // Resize to high-res square for better quality scaling
        
        // Generate unique filename
        $filename = 'seal_' . $position->id . '_' . time() . '.png';
        $path = 'seals/' . $filename;
        
        // Save to private disk
        Storage::disk('private')->put($path, (string) $image->toPng());
        
        $oldPath = $position->seal_image_path;
        $position->update([
            'seal_image_path' => $path,
            'last_modified_by' => auth()->id(),
        ]);
        
        // Audit log
        PortfolioHolderAuditLog::create([
            'leadership_position_id' => $position->id,
            'user_id' => auth()->id(),
            'action' => 'seal_uploaded',
            'field_changed' => 'seal_image_path',
            'old_value' => $oldPath,
            'new_value' => $path,
            'remark' => $request->admin_remarks,
        ]);
        
        return back()->with('success', 'Official seal uploaded successfully.');
    }

    /**
     * Member view of their own portfolio (read-only)
     */
    public function myPortfolio()
    {
        $user = auth()->user();
        $member = \App\Models\Member::where('user_id', $user->id)->first();
        
        if (!$member) {
            return Inertia::render('Member/MyPortfolio', [
                'positions' => [],
                'message' => 'No member profile found.',
            ]);
        }
        
        $positions = $member->currentPositions()
            ->with(['portfolio', 'auditLogs.user'])
            ->get();
        
        return Inertia::render('Member/MyPortfolio', [
            'positions' => $positions,
            'member' => $member,
        ]);
    }

    /**
     * Get route prefix based on user role
     */
    private function getRoutePrefix(): string
    {
        $role = auth()->user()->role;
        if ($role === 'super_admin') return 'state';
        if (str_contains($role, 'district')) return 'district';
        return 'tehsil';
    }
    
    /**
     * Serve signature or seal image
     */
    public function serveImage(LeadershipPosition $position, string $type)
    {
        // Authorization check
        $this->authorize('managePortfolioHolder', $position);
        
        $path = $type === 'signature' ? $position->signature_path : $position->seal_image_path;
        
        if (!$path || !Storage::disk('private')->exists($path)) {
            abort(404);
        }
        
        return response()->file(Storage::disk('private')->path($path));
    }
}

