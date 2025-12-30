<?php

namespace App\Http\Controllers;

use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistrictController extends Controller
{
    /**
     * Display a listing of the districts.
     */
    public function index()
    {
        $user = auth()->user();
        $query = District::with('state') // Assuming belongsTo state, similar to tehsils->district
            ->withCount(['members', 'leadershipPositions as active_leaders_count' => function ($q) {
                $q->where('is_current', true);
            }]);

        // Filter by district if user belongs to one (e.g. District Admin)
        if ($user->district_id) {
            $query->where('id', $user->district_id);
        } elseif ($user->member && $user->member->district_id) {
            $query->where('id', $user->member->district_id);
        }

        $districts = $query->get();

        return Inertia::render('Districts/Index', [
            'districts' => $districts,
        ]);
    }

    /**
     * Display the specified district and its portfolio holders.
     */
    public function show(District $district)
    {
        $district->load(['state']);
        
        // Fetch active portfolio holders for this district
        // We look for LeadershipPositions linked to this district (entity_id) with level 'district'
        $portfolioHolders = \App\Models\LeadershipPosition::where('level', 'district')
            ->where('entity_id', $district->id)
            ->where('is_current', true)
            ->with(['member', 'portfolio'])
            // Order by authority rank if available, otherwise name
            ->get()
            ->sortBy(function ($holder) {
                return $holder->portfolio->authority_rank ?? 999;
            })->values();

        return Inertia::render('Districts/Show', [
            'district' => $district,
            'portfolioHolders' => $portfolioHolders,
        ]);
    }
}

