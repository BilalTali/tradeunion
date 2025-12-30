<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => function () use ($request) {
                    $user = $request->user();
                    if (!$user) return null;
                    
                    // Force load member with all its data including photo_path
                    $user->load(['member' => function($query) {
                        $query->select('*'); // Ensure all columns including photo_path
                    }, 'member.district', 'member.tehsil']);
                    
                    if ($user->member) {
                        $user->member->append('active_commission_role');
                    }
                    
                    return $user;
                },
                'activePortfolio' => function () use ($request) {
                    $portfolio = $request->attributes->get('activePortfolio');
                    if ($portfolio) return $portfolio;
                    
                    // Fallback to service if not in attributes
                    $user = $request->user();
                    if ($user && $user->member) {
                        try {
                            $service = app(\App\Services\PortfolioPermissionService::class);
                            $position = $service->getActivePosition($user->member);
                            return $position ? $position->portfolio : null;
                        } catch (\Exception $e) {
                            return null;
                        }
                    }
                    return null;
                },
                'activePosition' => function () use ($request) {
                    $position = $request->attributes->get('activePosition');
                    if ($position) return $position;
                    
                    $user = $request->user();
                    if ($user && $user->member) {
                        try {
                            $service = app(\App\Services\PortfolioPermissionService::class);
                            return $service->getActivePosition($user->member);
                        } catch (\Exception $e) {
                            return null;
                        }
                    }
                    return null;
                },
                'portfolioLevel' => function () use ($request) {
                    $level = $request->attributes->get('portfolioLevel');
                    if ($level) return $level;
                     
                    $user = $request->user();
                    if ($user && $user->member) {
                        try {
                            $service = app(\App\Services\PortfolioPermissionService::class);
                            $position = $service->getActivePosition($user->member);
                            return $position ? $position->level : null;
                        } catch (\Exception $e) {
                            return null;
                        }
                    }
                    return null;
                },
                'office_profile' => null, // Deprecated in auth, moved to root

                'notifications' => $request->user() ? 
                    $request->user()->unreadNotifications()
                        ->whereIn('type', [
                            'App\\Notifications\\MeetingScheduled',
                            'App\\Notifications\\MeetingAbsent',
                        ])
                        ->limit(5)
                        ->get() : [],
                'unreadCount' => $request->user() ? 
                    $request->user()->unreadNotifications()
                        ->whereIn('type', [
                            'App\\Notifications\\MeetingScheduled',
                            'App\\Notifications\\MeetingAbsent',
                        ])
                        ->count() : 0,
            ],
            'office_profile' => function () use ($request) {
                $user = $request->user();
                $service = app(\App\Services\OfficeProfileRenderingService::class);
                
                $officeProfile = $user 
                    ? $service->getOfficeProfileForUser($user)
                    : \App\Models\State::first()?->officeProfile;

                return $officeProfile ? [
                    'organization_name' => $officeProfile->organization_name,
                    'short_name' => $officeProfile->short_name,
                    'primary_logo_path' => $officeProfile->primary_logo_path,
                    'secondary_logo_path' => $officeProfile->secondary_logo_path,
                    'letter_head_top_path' => $officeProfile->letter_head_top_path,
                    'tagline' => $officeProfile->tagline,
                    'address' => $officeProfile->address,
                    'full_address' => $officeProfile->full_address,
                    'primary_email' => $officeProfile->primary_email,
                    'primary_color' => $officeProfile->primary_color,
                    'secondary_color' => $officeProfile->secondary_color,
                    'font_family' => $officeProfile->font_family,
                    'registration_number' => $officeProfile->registration_number,
                    'constitution_path' => $officeProfile->constitution_path,
                    'theme_preferences' => $officeProfile->theme_preferences,
                ] : null;
            },
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
                'otp_required' => fn () => $request->session()->get('otp_required'),
                'email' => fn () => $request->session()->get('email'),
            ],
        ];
    }
}

