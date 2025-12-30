
    /**
     * Suspend a member (REQUIRES DISCIPLINARY RESOLUTION)
     */
    public function suspend(Request $request, Member $member)
    {
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
            $result = $this->executeWithResolution(
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
            $result = $this->executeWithResolution(
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
            $result = $this->executeWithResolution(
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
