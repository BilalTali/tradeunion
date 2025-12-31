<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $districts = District::with('state')
            ->withCount('tehsils')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/MasterData/DistrictManager', [
            'districts' => $districts,
            'states' => State::all(), // Needed for dropdown in Create/Edit
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:districts,name',
            'code' => 'required|string|max:50|unique:districts,code',
            'state_id' => 'required|exists:states,id',
            'office_address' => 'nullable|string',
            'contact_details' => 'nullable|array', // JSON cast
        ]);

        District::create($validated);

        return back()->with('success', 'District created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:districts,name,' . $district->id,
            'code' => 'required|string|max:50|unique:districts,code,' . $district->id,
            'state_id' => 'required|exists:states,id',
            'office_address' => 'nullable|string',
            'contact_details' => 'nullable|array',
        ]);

        $district->update($validated);

        return back()->with('success', 'District updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        // Check for dependencies (tehsils, members)
        if ($district->tehsils()->exists()) {
            return back()->with('error', 'Cannot delete district with assigned tehsils. Please move or delete tehsils first.');
        }

        $district->delete();

        return back()->with('success', 'District deleted successfully.');
    }
}
