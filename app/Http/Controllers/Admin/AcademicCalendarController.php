<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicCalendar;
use App\Models\AcademicCalendarEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    public function index()
    {
        $calendars = AcademicCalendar::with('events')->orderBy('year', 'desc')->get();
        return Inertia::render('Admin/Calendar/Index', ['calendars' => $calendars]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'file' => 'nullable|file|mimes:pdf|max:5120',
            'is_active' => 'boolean',
        ]);

        $calendar = AcademicCalendar::where('year', $request->year)->first();

        if ($request->hasFile('file')) {
            if ($calendar && $calendar->file_path) {
                Storage::disk('public')->delete($calendar->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('academic-calendars', 'public');
        }

        if ($calendar) {
            $calendar->update($validated);
            return back()->with('success', "Calendar for {$request->year} updated successfully.");
        }

        AcademicCalendar::create($validated);

        return back()->with('success', 'Calendar Year added.');
    }

    public function update(Request $request, AcademicCalendar $calendar)
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'file' => 'nullable|file|mimes:pdf|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            if ($calendar->file_path) {
                Storage::disk('public')->delete($calendar->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('academic-calendars', 'public');
        }

        $calendar->update($validated);
        return back()->with('success', 'Calendar updated.');
    }

    public function storeEvent(Request $request, AcademicCalendar $calendar)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'is_holiday' => 'boolean',
        ]);

        $calendar->events()->create($validated);
        return back()->with('success', 'Event added.');
    }

    public function destroyEvent(AcademicCalendarEvent $event)
    {
        $event->delete();
        return back()->with('success', 'Event removed.');
    }

    public function destroy(AcademicCalendar $calendar)
    {
        // Recursively deletes events via DB cascade if configured, or manually
        if ($calendar->file_path) {
            Storage::disk('public')->delete($calendar->file_path);
        }
        $calendar->events()->delete();
        $calendar->delete();

        return back()->with('success', 'Calendar deleted.');
    }
    public function deleteFile(AcademicCalendar $calendar)
    {
        if ($calendar->file_path) {
            Storage::disk('public')->delete($calendar->file_path);
            $calendar->update(['file_path' => null]);
            return back()->with('success', 'PDF removed successfully.');
        }
        return back()->with('error', 'No PDF file to remove.');
    }
}
