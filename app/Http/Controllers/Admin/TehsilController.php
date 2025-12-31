<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Tehsil;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TehsilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tehsils = Tehsil::with('district')
            ->withCount('members')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/MasterData/TehsilManager', [
            'tehsils' => $tehsils,
            'districts' => District::orderBy('name')->get(), // For dropdown
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255', // Removed unique globally, maybe unique per district? keeping simple for now or strict unique
            'code' => 'required|string|max:50|unique:tehsils,code',
            'district_id' => 'required|exists:districts,id',
            'description' => 'nullable|string',
        ]);

        Tehsil::create($validated);

        return back()->with('success', 'Tehsil created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tehsil $tehsil)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:tehsils,code,' . $tehsil->id,
            'district_id' => 'required|exists:districts,id',
            'description' => 'nullable|string',
        ]);

        $tehsil->update($validated);

        return back()->with('success', 'Tehsil updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tehsil $tehsil)
    {
        // Check for dependencies (members)
        if ($tehsil->members()->exists()) {
            return back()->with('error', 'Cannot delete tehsil with assigned members. Please move members first.');
        }

        $tehsil->delete();

        return back()->with('success', 'Tehsil deleted successfully.');
    }
}
