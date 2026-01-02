<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use App\Models\HomepageContent;
use App\Models\Department;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminHomepageController extends Controller
{
    /**
     * Show the Homepage Manager (CMS).
     */
    public function edit(Request $request)
    {
        $state = State::first();
        $officeProfile = $state?->officeProfile;

        return Inertia::render('Admin/Homepage/Manager', [
            'officeProfile' => $officeProfile,
            'heroSlides' => HeroSlide::orderBy('sort_order')->get(),
            'contents' => HomepageContent::all()->keyBy('key'),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    /**
     * Update Office Profile Theme (Colors/Fonts).
     */
    public function updateTheme(Request $request)
    {
        $state = State::first();
        $profile = $state?->officeProfile;

        if (!$profile) {
            return back()->with('error', 'State Office Profile not found.');
        }

        $validated = $request->validate([
            'primary_color' => 'required|string|max:7',
            'secondary_color' => 'required|string|max:7',
            'font_family' => 'nullable|string',
        ]);

        $profile->update($validated);

        return back()->with('success', 'Theme updated successfully.');
    }

    /**
     * Update Content Section (Text/JSON/Settings).
     */
    public function updateContent(Request $request, $key)
    {
        $content = HomepageContent::where('key', $key)->firstOrFail();

        $validated = $request->validate([
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'content' => 'nullable', // Text or Array
            'settings' => 'nullable|array',
            'image_path' => 'nullable|string', // If just path string passed
            'image' => 'nullable|image|max:2048', // If file upload
        ]);

        \Illuminate\Support\Facades\Log::info('Update Content Request for ' . $key, $request->all());
        \Illuminate\Support\Facades\Log::info('Validated Data', $validated);

        // Handle Image Upload
        if ($request->hasFile('image')) {
            if ($content->image_path) {
                Storage::disk('public')->delete($content->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('homepage/sections', 'public');
        }

        // Handle Content (if it's JSON from frontend, ensure it's saved correctly)
        // If it's an array (from JSON), Eloquent does NOT auto-cast 'content' because I didn't cast it to array/json in model.
        // So I should json_encode it if it's an array.
        if (isset($validated['content']) && is_array($validated['content'])) {
            $validated['content'] = json_encode($validated['content']);
        }

        // Remove 'image' from validated data as it's not a DB column
        unset($validated['image']);

        // Explicitly handle settings serialization if array
        if (isset($validated['settings']) && is_array($validated['settings'])) {
            $validated['settings'] = $validated['settings']; // Casts will handle it, but let's be sure.
            // Actually, if we want to FORCE it:
            // $content->settings = $validated['settings']; 
            // array cast handles it locally.
        }

        $content->fill($validated);
        $content->save();

        return back()->with('success', strtoupper($key) . ' section updated.');
    }

    /**
     * Store Hero Slide.
     */
    public function storeSlide(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
        ]);

        if (!$request->hasFile('image') && !$request->hasFile('images')) {
            return back()->withErrors(['image' => 'Please upload an image.']);
        }

        $files = [];
        if ($request->hasFile('image')) {
            $files[] = $request->file('image');
        }
        if ($request->hasFile('images')) {
            $files = array_merge($files, $request->file('images'));
        }

        // Get max order
        $maxOrder = HeroSlide::max('sort_order') ?? 0;

        foreach ($files as $file) {
            $path = $file->store('homepage/slider', 'public');
            $maxOrder++;

            HeroSlide::create([
                'image_path' => $path,
                'title' => $request->title ?? null,
                'subtitle' => $request->subtitle ?? null,
                'button_text' => $request->button_text ?? null,
                'button_link' => $request->button_link ?? null,
                'sort_order' => $maxOrder,
                'is_active' => true,
            ]);
        }

        return back()->with('success', count($files) . ' Slide(s) added successfully.');
    }

    /**
     * Update Hero Slide.
     */
    public function updateSlide(Request $request, HeroSlide $slide)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($slide->image_path) {
                Storage::disk('public')->delete($slide->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('homepage/slider', 'public');
        }

        $slide->update($validated);

        return back()->with('success', 'Slide updated.');
    }

    public function destroySlide(HeroSlide $slide)
    {
        if ($slide->image_path) {
            Storage::disk('public')->delete($slide->image_path);
        }
        $slide->delete();
        return back()->with('success', 'Slide removed.');
    }

    /**
     * Store Department.
     */
    public function storeDepartment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
        ]);

        $validated['is_active'] = true;

        Department::create($validated);

        return back()->with('success', 'Department added successfully.');
    }

    /**
     * Delete Department.
     */
    public function destroyDepartment(Department $department)
    {
        $department->delete();
        return back()->with('success', 'Department removed.');
    }

}
