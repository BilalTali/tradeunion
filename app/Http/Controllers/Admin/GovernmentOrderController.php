<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GovernmentOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GovernmentOrderController extends Controller
{
    public function index()
    {
        $orders = GovernmentOrder::orderBy('order_date', 'desc')->get();
        return Inertia::render('Admin/GovtOrders/Index', ['orders' => $orders]);
    }

    public function create()
    {
        return Inertia::render('Admin/GovtOrders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'order_date' => 'required|date',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB Limit
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('govt-orders', 'public');
        }

        GovernmentOrder::create($validated);

        return redirect()->route('state.govt-orders.index')->with('success', 'Order uploaded successfully.');
    }

    public function edit(GovernmentOrder $govtOrder)
    {
        return Inertia::render('Admin/GovtOrders/Edit', ['order' => $govtOrder]);
    }

    public function update(Request $request, GovernmentOrder $govtOrder)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'order_date' => 'required|date',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            if ($govtOrder->file_path) {
                Storage::disk('public')->delete($govtOrder->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('govt-orders', 'public');
        }

        $govtOrder->update($validated);

        return redirect()->route('state.govt-orders.index')->with('success', 'Order updated successfully.');
    }

    public function destroy(GovernmentOrder $govtOrder)
    {
        if ($govtOrder->file_path) {
            Storage::disk('public')->delete($govtOrder->file_path);
        }
        $govtOrder->delete();

        return redirect()->route('state.govt-orders.index')->with('success', 'Order deleted successfully.');
    }
}
