<?php

namespace App\Http\Controllers;

use App\Models\Tehsil;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TehsilController extends Controller
{
    /**
     * Display a listing of tehsils
     */
    public function index(Request $request)
    {
        $query = Tehsil::with('district.state');

        // Filter by district if provided
        if ($request->has('district_id')) {
            $query->where('district_id', $request->district_id);
        }

        $tehsils = $query->orderBy('name')->get();

        return Inertia::render('Tehsils/Index', [
            'tehsils' => $tehsils,
        ]);
    }

    /**
     * Display the specified tehsil
     */
    public function show(Tehsil $tehsil)
    {
        $tehsil->load(['district.state', 'members', 'officeProfile']);

        return Inertia::render('Tehsils/Show', [
            'tehsil' => $tehsil,
            'memberCount' => $tehsil->members()->count(),
        ]);
    }
}
