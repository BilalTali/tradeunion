<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grievance;
use Inertia\Inertia;

class AdminGrievanceController extends Controller
{
    public function index()
    {
        $grievances = Grievance::with('user:id,name,email', 'responder:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Grievances/Index', [
            'grievances' => $grievances
        ]);
    }

    public function update(Request $request, Grievance $grievance)
    {
        $validated = $request->validate([
            'admin_response' => 'nullable|string',
            'status' => 'required|string|in:pending,in_progress,resolved,rejected'
        ]);

        $grievance->update([
            'admin_response' => $validated['admin_response'],
            'status' => $validated['status'],
            'responded_by' => $request->user()->id
        ]);

        return back()->with('success', 'Grievance updated successfully.');
    }

    public function destroy(Grievance $grievance)
    {
        $grievance->delete();
        return back()->with('success', 'Grievance deleted successfully.');
    }
}
