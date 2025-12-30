<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resolution;
use Illuminate\Http\Request;

class ResolutionEligibilityController extends Controller
{
    /**
     * Get resolutions eligible for execution
     * 
     * Filters by:
     * - Type (disciplinary, administrative, etc.)
     * - Category (member_suspension, portfolio_removal, etc.)
     * - Status (must be 'passed')
     * - Not already executed
     * - No active appeals freezing execution
     * - Optional target validation from proposed_action
     */
    public function getEligible(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:disciplinary,administrative,financial,election,policy',
            'category' => 'required|string',
            'target' => 'nullable|string', // JSON string of target validation
        ]);
        
        // Build base query
        $query = Resolution::with(['committee', 'proposer'])
            ->where('type', $validated['type'])
            ->where('category', $validated['category'])
            ->where('status', 'passed')
            ->whereNull('executed_at'); // Not yet executed
        
        // Exclude resolutions with active appeals that freeze execution
        $query->whereDoesntHave('appeals', function($q) {
            $q->whereIn('status', ['filed', 'admitted', 'under_review'])
              ->where('freezes_execution', true);
        });
        
        // Optional: Filter by target validation
        if (!empty($validated['target'])) {
            try {
                $target = json_decode($validated['target'], true);
                
                if (is_array($target)) {
                    foreach ($target as $key => $value) {
                        // Check if proposed_action contains the expected key-value pair
                        $query->whereRaw("JSON_EXTRACT(proposed_action, '$.{$key}') = ?", [$value]);
                    }
                }
            } catch (\Exception $e) {
                // If JSON decode fails, ignore target filtering
                \Log::warning('Failed to decode target validation in ResolutionEligibilityController', [
                    'target' => $validated['target'],
                    'error' => $e->getMessage()
                ]);
            }
        }
        
        // Order by most recent first
        $resolutions = $query->orderBy('voting_closed_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'resolutions' => $resolutions,
            'count' => $resolutions->count(),
            'filters' => [
                'type' => $validated['type'],
                'category' => $validated['category'],
                'target' => $validated['target'] ?? null,
            ]
        ]);
    }
}
