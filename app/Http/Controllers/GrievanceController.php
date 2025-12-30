<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grievance;

class GrievanceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|in:Transfer,Pay Related,Harassment,Other',
            'message' => 'required|string|max:2000',
        ]);

        $request->user()->grievances()->create($validated);

        return back()->with('success', 'Your grievance has been submitted successfully. You can track its status in your profile.');
    }
}
