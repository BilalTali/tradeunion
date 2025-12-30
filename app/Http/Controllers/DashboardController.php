<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Election;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // PRIORITY 1: Admin roles get their admin dashboards (even if they have portfolios)
        // Only non-admin members get portfolio dashboards
        $isAdmin = $role === 'super_admin' || 
                   str_contains($role, '_admin') || 
                   str_contains($role, 'tehsil') && str_contains($role, 'admin') ||
                   str_contains($role, 'district') && str_contains($role, 'admin') ||
                   str_contains($role, 'state') && str_contains($role, 'admin');
        
        // PRIORITY 2: Check for active portfolio (only for non-admin members)
        if (!$isAdmin && $user->member) {
            $service = app(\App\Services\PortfolioPermissionService::class);
            $activePosition = $service->getActivePosition($user->member);
            
            if ($activePosition) {
                // Redirect to portfolio-specific URL
                $portfolioType = $this->getPortfolioUrlSlug($activePosition->portfolio);
                $level = $activePosition->level; // tehsil, district, state
                
                // Check if we're not already on the correct portfolio URL
                $currentRoute = $request->route()->getName();
                $expectedRoute = "{$level}.{$portfolioType}.dashboard";
                
                if ($currentRoute !== $expectedRoute) {
                    // Redirect to portfolio-specific dashboard
                    return redirect()->route($expectedRoute);
                }
                
                // Render portfolio-specific dashboard
                return $this->renderPortfolioDashboard($request, $activePosition);
            }
        }

        // Force redirect for pure members to ensure correct URL
        if (in_array($role, ['member', 'tehsil_member', 'district_member', 'state_member']) && !$isAdmin) {
            if ($request->route()->getName() !== 'member.dashboard') {
                return redirect()->route('member.dashboard');
            }
        }

        // Specialized Dashboard for Members (non-admins only)
        if (in_array($role, ['member', 'tehsil_member', 'district_member', 'state_member']) && !$isAdmin) {
            $member = $user->member; // Assuming User hasOne Member relation
            
            // Get Member-specific data
            $announcements = BlogPost::where('category', 'notice')
                ->where('status', 'published')
                ->latest()
                ->take(5)
                ->get();
            $blogs = BlogPost::latest()->take(3)->get();
            $activeElections = Election::where('status', 'voting_open')
                ->get()
                ->map(function ($election) use ($member) {
                    $election->has_voted = $member ? $election->votes()->where('member_id', $member->id)->exists() : false;
                    return $election;
                });

            return Inertia::render('MemberDashboard', [
                'user' => $user,
                'member' => $member ? $member->load('tehsil.district.state') : null,
                'announcements' => $announcements,
                'blogs' => $blogs,
                'activeElections' => $activeElections,
                'userRole' => $role,
            ]);
        }

        // Standard Dashboard for Admins/Presidents
        $stats = $this->getStatsForRole($user);
        $recentActivities = $this->getRecentActivities($user);
        $upcomingEvents = $this->getUpcomingEvents($user);
        
        // Role-specific pending items
        $pendingApprovals = 0;
        if (str_contains($role, 'admin') || str_contains($role, 'president')) {
            $query = Member::where('status', 'pending');
            
            if (str_contains($role, 'district')) {
                $query->where('district_id', $user->district_id);
            } elseif (str_contains($role, 'tehsil')) {
                $query->where('tehsil_id', $user->tehsil_id);
            }
            
            $pendingApprovals = $query->count();
        }

        // Get pending election winners for installation
        $pendingWinners = [];
        if (str_contains($role, 'admin') || str_contains($role, 'president')) {
            // Determine level
            $level = 'state';
            if (str_contains($role, 'district')) {
                $level = 'district';
            } elseif (str_contains($role, 'tehsil')) {
                $level = 'tehsil';
            }

            // Find certified winners who haven't been installed yet
            $pendingWinners = \App\Models\ElectionResult::where('is_certified', true)
                ->whereHas('election', function ($q) use ($level) {
                    $q->where('level', $level)
                      ->where('status', 'completed');
                })
                ->with(['winner', 'election'])
                ->get()
                ->filter(function ($result) {
                    // Check if winner has NOT been installed into this position yet
                    $activePositions = \App\Models\LeadershipPosition::where('member_id', $result->winner_id)
                        ->where('is_current', true)
                        ->get();
                    
                    // Robust check: Compare titles ignoring case and standard prefixes
                    $hasPosition = $activePositions->contains(function ($pos) use ($result) {
                        $posTitle = trim($pos->position_title);
                        $resultTitle = trim($result->position_title);
                        
                        // Check standard matches first
                        if (strcasecmp($posTitle, $resultTitle) === 0) return true;
                        
                        // Strip prefixes (Zonal, District, State)
                        $prefixes = ['Zonal ', 'District ', 'State '];
                        foreach ($prefixes as $prefix) {
                            if (stripos($posTitle, $prefix) === 0) {
                                $strippedTitle = substr($posTitle, strlen($prefix));
                                if (strcasecmp(trim($strippedTitle), $resultTitle) === 0) return true;
                            }
                        }
                        
                        return false;
                    });
                    
                    return !$hasPosition; // Only include if NOT installed
                });
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'upcomingEvents' => $upcomingEvents,
            'pendingApprovals' => $pendingApprovals,
            'pendingWinners' => $pendingWinners,
            'userRole' => $role,
            'charts' => $this->getChartData($user),
        ]);
    }

    private function getStatsForRole($user)
    {
        $role = $user->role;
        
        // Cache key based on role and relevant entity
        $cacheKey = 'dashboard.stats.' . $role;
        if ($user->district_id) {
            $cacheKey .= '.district.' . $user->district_id;
        } elseif ($user->tehsil_id) {
            $cacheKey .= '.tehsil.' . $user->tehsil_id;
        }
        
        // Cache for 5 minutes (300 seconds)
        return Cache::remember($cacheKey, 300, function () use ($user, $role) {
            $stats = [];

            // Role-based member counting
            if ($role === 'super_admin') {
                // Super Admin sees ALL members
                $stats['totalMembers'] = Member::count();
                $stats['activeMembers'] = Member::where('status', 'active')->count();
                $stats['scope'] = 'State-wide';
            } elseif (str_contains($role, 'district')) {
                // District Admin sees their district's members
                $stats['totalMembers'] = Member::where('district_id', $user->district_id)->count();
                $stats['activeMembers'] = Member::where('district_id', $user->district_id)
                    ->where('status', 'active')->count();
                $stats['scope'] = 'District: ' . ($user->district->name ?? 'N/A');
            } elseif (str_contains($role, 'tehsil')) {
                // Tehsil Admin sees their tehsil's members
                $stats['totalMembers'] = Member::where('tehsil_id', $user->tehsil_id)->count();
                $stats['activeMembers'] = Member::where('tehsil_id', $user->tehsil_id)
                    ->where('status', 'active')->count();
                $stats['scope'] = 'Tehsil: ' . ($user->tehsil->name ?? 'N/A');
            } else {
                $stats['totalMembers'] = Member::count();
                $stats['activeMembers'] = Member::where('status', 'active')->count();
                $stats['scope'] = 'All';
            }

            // Elections count
            $stats['activeElections'] = Election::where('status', 'voting_open')->count();
            $stats['upcomingEvents'] = BlogPost::where('category', 'event')
                ->where('publish_date', '>=', now())
                ->where('status', 'published')
                ->count();

            return $stats;
        });
    }

    private function getRecentActivities($user)
    {
        // Mock recent activities - you can customize this based on your needs
        return [
            [
                'description' => 'New member joined: Bilal  Tali',
                'time' => '2 hours ago',
            ],
            [
                'description' => 'Election "District President 2024" started',
                'time' => '5 hours ago',
            ],
            [
                'description' => '15 members approved today',
                'time' => '1 day ago',
            ],
        ];
    }

    private function getUpcomingEvents($user)
    {
        return BlogPost::where('category', 'event')
            ->where('publish_date', '>=', now())
            ->where('status', 'published')
            ->orderBy('publish_date')
            ->limit(3)
            ->get()
            ->map(function ($event) {
                return [
                    'title' => $event->title,
                    'date' => $event->publish_date->format('M d, Y'),
                ];
            });
    }

    private function getChartData($user)
    {
        $role = $user->role;
        $charts = [];

        // 1. Member Growth (Last 6 months)
        $months = collect(range(5, 0))->map(function ($i) {
            return now()->subMonths($i);
        });

        $growthData = $months->map(function ($month) use ($user, $role) {
            $query = Member::whereMonth('created_at', $month->month)
                           ->whereYear('created_at', $month->year);
            
            if (str_contains($role, 'district')) {
                $query->where('district_id', $user->district_id);
            } elseif (str_contains($role, 'tehsil')) {
                $query->where('tehsil_id', $user->tehsil_id);
            }

            return [
                'name' => $month->format('M'),
                'members' => $query->count(),
            ];
        });
        $charts['memberGrowth'] = $growthData;

        // 2. Member Distribution (Pie/Bar)
        if ($role === 'super_admin' || $role === 'state_admin') {
            // State sees District distribution
            $distData = \App\Models\District::withCount('members')
                ->orderByDesc('members_count')
                ->take(10) // Top 10 districts
                ->get()
                ->map(function ($d) {
                    return ['name' => $d->name, 'value' => $d->members_count];
                });
            $charts['distribution'] = $distData;
            $charts['distributionLabel'] = 'Members by District';
        } elseif (str_contains($role, 'district')) {
            // District sees Tehsil distribution
            $tehsilData = \App\Models\Tehsil::where('district_id', $user->district_id)
                ->withCount('members')
                ->orderByDesc('members_count')
                ->get()
                ->map(function ($t) {
                    return ['name' => $t->name, 'value' => $t->members_count];
                });
            $charts['distribution'] = $tehsilData;
            $charts['distributionLabel'] = 'Members by Tehsil';
        }

        return $charts;
    }

    /**
     * Render portfolio-specific dashboard
     */
    private function renderPortfolioDashboard($request, $activePosition)
    {
        $portfolio = $activePosition->portfolio;
        
        // Election Commission Dashboard
        if ($portfolio->isElectionCommission()) {
            return $this->renderECDashboard($request->user(), $activePosition);
        }
        
        // President Dashboard
        if (str_contains($portfolio->code, 'PRESIDENT')) {
            return $this->renderPresidentDashboard($request->user(), $activePosition);
        }
        
        // Treasurer Dashboard
        if (str_contains($portfolio->code, 'TREASURER')) {
            return $this->renderTreasurerDashboard($request->user(), $activePosition);
        }
        
        // Secretary Dashboard
        if (str_contains($portfolio->code, 'SECRETARY')) {
            return $this->renderSecretaryDashboard($request->user(), $activePosition);
        }
        
        // Fallback to generic portfolio dashboard
        return $this->renderGenericPortfolioDashboard($request->user(), $activePosition);
    }

    private function renderECDashboard($user, $activePosition)
    {
        $level = $activePosition->level;
        
        $activeElections = Election::where('level', $level)
            ->whereIn('status', ['nominations_open', 'voting_open', 'voting_closed'])
            ->with('candidates')
            ->withCount(['votes as pending_votes_count' => function ($query) {
                $query->where('verification_status', 'pending');
            }])
            ->get();
        
        $pendingCandidates = \App\Models\Candidate::whereHas('election', function($q) use ($level) {
                $q->where('level', $level);
            })
            ->where('status', 'pending')
            ->count();
         // Pending vote verifications (for ECs)
        $pendingVoteVerifications = \App\Models\Vote::whereHas('election', function($query) use ($level) {
                $query->where('level', $level);
            })
            ->where('verification_status', 'pending')
            ->count();
        
        $completedElections = Election::where('level', $level)
            ->where('status', 'completed')
            ->count();

        // Get user's portfolio assignments for switcher
        $portfolios = $user->member->leadershipPositions()
            ->where('is_current', true)
            ->with('portfolio')
            ->get();

        // Calculate total eligible voters across active elections
        $eligibleVotersCount = $activeElections->sum('eligible_voters_count');

        // Fetch recent nominations (pending or approved/rejected)
        $recentNominations = \App\Models\Candidate::whereHas('election', function($q) use ($level) {
                $q->where('level', $level);
            })
            ->with(['member', 'election'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($candidate) {
                return [
                    'id' => $candidate->id,
                    'member_name' => $candidate->member->name,
                    'election_title' => $candidate->election->title,
                    'position' => $candidate->position_title,
                    'status' => $candidate->status,
                    'timestamp' => $candidate->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Dashboards/ElectionCommissionerDashboard', [
            'activeElections' => $activeElections,
            'pendingCandidates' => $pendingCandidates,
            'pendingVoteVerifications' => $pendingVoteVerifications,
            'completedElections' => $completedElections,
            'portfolios' => $portfolios,
            'activePortfolioId' => $activePosition->id,
            'userLevel' => $activePosition->level,
            'eligibleVotersCount' => $eligibleVotersCount,
            'recentNominations' => $recentNominations,
        ]);
    }

    private function renderPresidentDashboard($user, $activePosition)
    {
        // Render President dashboard with proper data
        $stats = $this->getStatsForRole($user);
        $recentActivities = $this->getRecentActivities($user);
        $upcomingEvents = $this->getUpcomingEvents($user);
        
        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'upcomingEvents' => $upcomingEvents,
            'pendingApprovals' => 0,
            'userRole' => 'President - ' . ucfirst($activePosition->level),
        ]);
    }

    private function renderTreasurerDashboard($user, $activePosition)
    {
        // TODO: Implement Treasurer dashboard  
        return Inertia::render('Dashboard', ['userRole' => 'Treasurer']);
    }

    private function renderSecretaryDashboard($user, $activePosition)
    {
        // TODO: Implement Secretary dashboard
        return Inertia::render('Dashboard', ['userRole' => 'Secretary']);
    }
    
    /**
     * Get URL slug for portfolio type
     */
    private function getPortfolioUrlSlug($portfolio): string
    {
        // Map portfolio types to URL slugs
        if ($portfolio->isElectionCommission()) {
            return 'ec'; // Election Commission
        }
        
        // Map other portfolio types
        $typeMap = [
            'executive' => 'president',
            'vice_executive' => 'vice-president',
            'secretary' => 'secretary',
            'treasurer' => 'treasurer',
            'financial' => 'treasurer',
        ];
        
        return $typeMap[$portfolio->type] ?? 'portfolio';
    }

    private function renderGenericPortfolioDashboard($user, $activePosition)
    {
        // Generic portfolio dashboard
        return Inertia::render('Dashboard', [
            'userRole' => $activePosition->portfolio->name,
            'portfolioLevel' => $activePosition->level,
        ]);
    }
}
