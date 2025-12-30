<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AcademicCalendar;
use App\Models\GovernmentOrder;
use App\Models\ImportantLink;
use Illuminate\Http\Request;
use App\Models\HomepageContent;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        $aboutContent = HomepageContent::where('key', 'about')
            ->where('is_active', true)
            ->first();

        return Inertia::render('Public/About', [
            'aboutContent' => $aboutContent
        ]);
    }
    public function governmentOrders(Request $request)
    {
        $query = GovernmentOrder::where('is_active', true)
            ->orderBy('order_date', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        $orders = $query->paginate(20)->withQueryString();
        $departments = GovernmentOrder::where('is_active', true)->distinct()->pluck('department');

        return Inertia::render('Public/GovernmentOrders', [
            'orders' => $orders,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department']),
        ]);
    }

    public function academicCalendar()
    {
        $currentYear = date('Y');
        $calendar = AcademicCalendar::where('is_active', true)
            ->where('year', $currentYear)
            ->with(['events' => function($q) {
                $q->orderBy('start_date');
            }])
            ->first();

        // If no active calendar for current year, try next year or previous year
        if (!$calendar) {
            $calendar = AcademicCalendar::where('is_active', true)
                ->orderBy('year', 'desc')
                ->with(['events' => function($q) {
                    $q->orderBy('start_date');
                }])
                ->first();
        }

        return Inertia::render('Public/AcademicCalendar', [
            'calendar' => $calendar
        ]);
    }

    public function importantLinks(Request $request)
    {
        $query = ImportantLink::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('department', 'asc');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('department', 'like', '%' . $request->search . '%');
        }

        $links = $query->paginate(50)->withQueryString();

        return Inertia::render('Public/ImportantLinks', [
            'links' => $links,
            'filters' => $request->only(['search'])
        ]);
    }
    public function contact()
    {
        // 1. Fetch State Office Profile
        $state = \App\Models\State::first();
        $stateProfile = $state?->officeProfile;

        // 2. Fetch Hierarchy: Districts with their Office Profiles and Tehsils with their Office Profiles
        $districts = \App\Models\District::query()
            ->with(['officeProfile', 'tehsils.officeProfile'])
            ->get();

        return Inertia::render('Public/Contact', [
            'stateProfile' => $stateProfile,
            'districts' => $districts
        ]);
    }
}
