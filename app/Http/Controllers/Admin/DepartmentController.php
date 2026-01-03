<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments
     */
    public function index()
    {
        $departments = Department::orderBy('name')->paginate(20);

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new department
     */
    public function create()
    {
        return Inertia::render('Admin/Departments/Create');
    }

    /**
     * Store a newly created department
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:departments,code',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'posting_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        Department::create($validated);

        return redirect()->route('state.departments.index')
            ->with('success', 'Department created successfully.');
    }

    /**
     * Show the form for editing the specified department
     */
    public function edit(Department $department)
    {
        return Inertia::render('Admin/Departments/Edit', [
            'department' => $department,
        ]);
    }

    /**
     * Update the specified department
     */
    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:departments,code,' . $department->id,
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'posting_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $department->update($validated);

        return redirect()->route('state.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department
     */
    public function destroy(Department $department)
    {
        // Check if department has any members
        $memberCount = \App\Models\Member::where('department_id', $department->id)->count();
        
        if ($memberCount > 0) {
            return back()->with('error', "Cannot delete department. It has {$memberCount} members associated with it.");
        }

        $department->delete();

        return redirect()->route('state.departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
