<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeadershipMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeadershipMessageController extends Controller
{
    public function index()
    {
        $messages = LeadershipMessage::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Messages/Index', ['messages' => $messages]);
    }

    public function create()
    {
        return Inertia::render('Admin/Messages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'message' => 'required|string',
            'photo' => 'nullable|image|max:2048', // 2MB Max
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('leadership-photos', 'public');
        }

        LeadershipMessage::create($validated);

        return redirect()->route('state.messages.index')->with('success', 'Message created successfully.');
    }

    public function edit(LeadershipMessage $message)
    {
        return Inertia::render('Admin/Messages/Edit', ['message' => $message]);
    }

    public function update(Request $request, LeadershipMessage $message)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'message' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            if ($message->photo_path) {
                Storage::disk('public')->delete($message->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('leadership-photos', 'public');
        }

        $message->update($validated);

        return redirect()->route('state.messages.index')->with('success', 'Message updated successfully.');
    }

    public function destroy(LeadershipMessage $message)
    {
        if ($message->photo_path) {
            Storage::disk('public')->delete($message->photo_path);
        }
        $message->delete();

        return redirect()->route('state.messages.index')->with('success', 'Message deleted successfully.');
    }
}
