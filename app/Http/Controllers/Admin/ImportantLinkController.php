<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImportantLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ImportantLinkController extends Controller
{
    public function index()
    {
        $links = ImportantLink::orderBy('sort_order')->orderBy('created_at')->get();
        return Inertia::render('Admin/Links/Index', ['links' => $links]);
    }

    public function create()
    {
        return Inertia::render('Admin/Links/Create');
    }

    public function edit(ImportantLink $link)
    {
        return Inertia::render('Admin/Links/Edit', ['link' => $link]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'url' => 'required|url',
            'icon' => 'nullable|image|max:1024',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('icon')) {
            $validated['icon_path'] = $request->file('icon')->store('link-icons', 'public');
        }

        ImportantLink::create($validated);
        return back()->with('success', 'Link added.');
    }

    public function update(Request $request, ImportantLink $link)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'department' => 'required|string',
            'url' => 'required|url',
            'icon' => 'nullable|image|max:1024',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('icon')) {
            if ($link->icon_path) {
                Storage::disk('public')->delete($link->icon_path);
            }
            $validated['icon_path'] = $request->file('icon')->store('link-icons', 'public');
        }

        $link->update($validated);
        return back()->with('success', 'Link updated.');
    }

    public function destroy(ImportantLink $link)
    {
        if ($link->icon_path) {
            Storage::disk('public')->delete($link->icon_path);
        }
        $link->delete();
        return back()->with('success', 'Link removed.');
    }
}
