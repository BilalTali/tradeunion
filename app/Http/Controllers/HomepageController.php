<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use App\Models\HomepageContent;
use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{
    /**
     * Display the dynamic homepage.
     */
    public function index()
    {
        // 1. Fetch State Office Profile (Main Identity)
        $state = State::first();
        $officeProfile = $state?->officeProfile;

        // 2. Fetch Active Hero Slides
        $heroSlides = HeroSlide::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        // 3. Fetch Content Sections
        $contents = HomepageContent::where('is_active', true)
            ->get()
            ->keyBy('key');

        // 4. Fetch Grievances/Feedback (Teacher Voices) - Showing all for demo/UAT
        $feedbacks = \App\Models\Grievance::with('user:id,name', 'responder:id,name')
            // ->where('status', 'resolved')
            // ->whereNotNull('admin_response')
            ->latest()
            ->take(6)
            ->get();

        // 5. Fetch Homepage Dynamic Modules
        $messages = \App\Models\LeadershipMessage::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $achievements = \App\Models\Achievement::where('is_active', true)
            ->orderBy('date', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('Public/Homepage', [
            'officeProfile' => $officeProfile,
            'heroSlides' => $heroSlides,
            'contents' => $contents,
            'feedbacks' => $feedbacks,
            'messages' => $messages,
            'achievements' => $achievements,
        ]);
    }
}
