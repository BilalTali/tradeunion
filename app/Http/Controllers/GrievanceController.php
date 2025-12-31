<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grievance;

class GrievanceController extends Controller
{
    public function index(Request $request)
    {
        $grievances = $request->user()->grievances()->latest()->paginate(10);
        return inertia('Member/Grievances/Index', [
            'grievances' => $grievances
        ]);
    }

    public function create()
    {
        return inertia('Member/Grievances/Create', [
            'user' => auth()->user()->load('member'),
            'districts' => \App\Models\District::select('id', 'name')->get(),
            'tehsils' => \App\Models\Tehsil::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'category' => 'required|string|in:Service Matter,Transfer / Posting,Pay / Allowances,Promotion / Seniority,Disciplinary Action,Welfare / Benefits,Other',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|min:100',
            'incident_date' => 'required|date',
            'grievance_level' => 'required|string|in:tehsil,district,state',
            'is_declaration_accepted' => 'required|accepted',
            'attachment' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ];

        // Conditional validation for attachments
        if (in_array($request->category, ['Pay / Allowances', 'Promotion / Seniority', 'Disciplinary Action'])) {
            $rules['attachment'] = 'required|file|mimes:pdf,jpg,png,jpeg|max:2048';
        }

        $validated = $request->validate($rules);

        $path = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('grievances', 'public');
        }

        $grievance = $request->user()->grievances()->create([
            'category' => $validated['category'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'incident_date' => $validated['incident_date'],
            'grievance_level' => $validated['grievance_level'],
            'is_declaration_accepted' => true,
            'attachment_path' => $path,
            'status' => 'pending',
        ]);

        return redirect()->route('grievances.index')->with('success', 'Grievance submitted successfully. Ticket ID: ' . $grievance->ticket_id);
    }

    public function show(Request $request, Grievance $grievance)
    {
        // Ensure user owns the grievance
        if ($request->user()->id !== $grievance->user_id) {
            abort(403);
        }

        return inertia('Member/Grievances/Show', [
            'grievance' => $grievance->load('responder')
        ]);
    }
}
