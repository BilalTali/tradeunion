<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VotingController;
use App\Http\Controllers\ResultsController;
use App\Http\Controllers\ICardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\ResolutionEligibilityController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\SitemapController;

// Public Routes
// Public Routes
// Grievance Routes updated
Route::get('/', [\App\Http\Controllers\HomepageController::class, 'index'])->name('homepage');

Route::get('/about', [\App\Http\Controllers\Public\PageController::class, 'about'])->name('about');

Route::get('/contact', [\App\Http\Controllers\Public\PageController::class, 'contact'])->name('contact');

Route::get('/privacy-policy', [\App\Http\Controllers\Public\PageController::class, 'privacyPolicy'])->name('privacy-policy');

Route::get('/terms-of-service', [\App\Http\Controllers\Public\PageController::class, 'termsOfService'])->name('terms');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('/constitution', [\App\Http\Controllers\ConstitutionController::class, 'show'])->name('constitution');

Route::get('/government-orders', [\App\Http\Controllers\Public\PageController::class, 'governmentOrders'])->name('public.govt-orders');
Route::get('/academic-calendar', [\App\Http\Controllers\Public\PageController::class, 'academicCalendar'])->name('public.calendar');
Route::get('/important-links', [\App\Http\Controllers\Public\PageController::class, 'importantLinks'])->name('public.links');

// Legacy welcome page (can remove later)
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {
    // API Routes for AJAX calls
    Route::get('/api/resolutions/eligible', [ResolutionEligibilityController::class, 'getEligible'])
        ->name('api.resolutions.eligible');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Root dashboard - redirects based on role
    // Root dashboard - redirects based on role
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;
        
        // Check for specific Member roles first to ensure they go to Member Dashboard
        if (in_array($role, ['member', 'tehsil_member', 'district_member', 'state_member'])) {
            return redirect('/member/dashboard');
        }

        // Super Admin
        if ($role === 'super_admin') {
            return redirect('/state/dashboard');
        } 
        // District Admin/President
        elseif (str_contains($role, 'district')) {
            return redirect('/district/dashboard');
        } 
        // Tehsil Admin/President
        elseif (str_contains($role, 'tehsil')) {
            return redirect('/tehsil/dashboard');
        } 
        
        // Fallback
        return redirect('/member/dashboard');
    })->name('dashboard');

    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.readAll');

    // Public/Authenticated Directory
    Route::resource('tehsils', \App\Http\Controllers\TehsilController::class)->only(['index', 'show']);
    Route::resource('districts', \App\Http\Controllers\DistrictController::class)->only(['index', 'show']);

    // STATE LEVEL (Super Admin)
    Route::prefix('state')->middleware('role:super_admin,state')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('state.dashboard');
        Route::resource('admins', AdminController::class)->names('state.admins');
        Route::resource('members', MemberController::class)->names('state.members')->except(['create', 'store']);
        Route::post('members/{member}/approve', [MemberController::class, 'approve'])->name('state.members.approve');
        Route::post('members/{member}/reject', [MemberController::class, 'reject'])->name('state.members.reject');
        Route::resource('elections', ElectionController::class)->names('state.elections');
        
        // Candidate Management (EC) - View only, approval requires portfolio
        Route::get('elections/{election}/candidates/pending', [\App\Http\Controllers\CandidateController::class, 'pending'])->name('state.candidates.pending');
        
        // Status Transitions
        Route::post('elections/{election}/open-nominations', [ElectionController::class, 'openNominations'])->name('state.elections.open-nominations');
        Route::post('elections/{election}/close-nominations', [ElectionController::class, 'closeNominations'])->name('state.elections.close-nominations');
        Route::post('elections/{election}/open-voting', [ElectionController::class, 'openVoting'])->name('state.elections.open-voting');
        Route::post('elections/{election}/close-voting', [ElectionController::class, 'closeVoting'])->name('state.elections.close-voting');
        Route::post('elections/{election}/complete', [ElectionController::class, 'complete'])->name('state.elections.complete');
        
        // Results Management
        Route::post('elections/{election}/calculate-results', [\App\Http\Controllers\ResultController::class, 'calculate'])->name('state.results.calculate');
        Route::post('elections/{election}/certify-results', [\App\Http\Controllers\ResultController::class, 'certify'])->name('state.results.certify');
        
        // Vote Verification (EC)
        Route::get('elections/{election}/votes/pending', [\App\Http\Controllers\VoteVerificationController::class, 'pending'])->name('state.votes.pending');
        Route::post('votes/{vote}/approve', [\App\Http\Controllers\VoteVerificationController::class, 'approve'])->name('state.votes.approve');
        Route::post('votes/{vote}/reject', [\App\Http\Controllers\VoteVerificationController::class, 'reject'])->name('state.votes.reject');
        
        // Eligibility Criteria Management (EC)
        Route::get('elections/{election}/eligibility-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'index'])->name('state.eligibility-criteria.index');
        Route::put('elections/{election}/voting-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateVotingCriteria'])->name('state.voting-criteria.update');
        Route::put('elections/{election}/candidacy-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateCandidacyCriteria'])->name('state.candidacy-criteria.update');
        Route::post('elections/{election}/apply-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'applyCriteria'])->name('state.apply-criteria');
        Route::get('elections/{election}/eligible-members', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'listEligibleMembers'])->name('state.eligible-members');
        
        // Portfolio Management (Full CRUD)
        Route::resource('portfolios', \App\Http\Controllers\Admin\PortfolioController::class)->names('state.portfolios');
        Route::resource('tehsils', \App\Http\Controllers\Admin\TehsilController::class)->names('state.tehsils');
        Route::resource('districts', \App\Http\Controllers\Admin\DistrictController::class)->names('state.districts');
        
        // Portfolio Assignments (assign members to portfolios)
        Route::resource('portfolio-assignments', \App\Http\Controllers\PortfolioAssignmentController::class)->names('state.portfolio-assignments')->only(['index', 'create', 'store', 'destroy']);
        
        // Portfolio Holder Profile Management
        Route::get('/portfolio-holders/{position}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'show'])->name('state.portfolio-holders.show');
        Route::get('/portfolio-holders/{position}/edit', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'edit'])->name('state.portfolio-holders.edit');
        Route::put('/portfolio-holders/{position}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'update'])->name('state.portfolio-holders.update');
        Route::post('/portfolio-holders/{position}/signature', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'uploadSignature'])->name('state.portfolio-holders.signature');
        Route::post('/portfolio-holders/{position}/seal', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'uploadSeal'])->name('state. portfolio-holders.seal');
        
        // Member Transfers
        Route::resource('transfers', \App\Http\Controllers\MemberTransferController::class)->names('state.transfers')->only(['index', 'create', 'store', 'show']);
        Route::post('transfers/{transfer}/recommend', [\App\Http\Controllers\MemberTransferController::class, 'recommend'])->name('state.transfers.recommend');
        Route::post('transfers/{transfer}/approve', [\App\Http\Controllers\MemberTransferController::class, 'approve'])->name('state.transfers.approve');
        Route::post('transfers/{transfer}/reject', [\App\Http\Controllers\MemberTransferController::class, 'reject'])->name('state.transfers.reject');
        Route::post('transfers/{transfer}/complete', [\App\Http\Controllers\MemberTransferController::class, 'complete'])->name('state.transfers.complete');
        
        // Blog Management
    Route::resource('blog', \App\Http\Controllers\BlogController::class)->names('state.blog');
        Route::delete('blog/{post}/remove-image', [\App\Http\Controllers\BlogController::class, 'removeFeaturedImage'])->name('state.blog.remove-image');
        Route::get('blog/{post}/download-pdf', [\App\Http\Controllers\BlogController::class, 'downloadPdf'])->name('state.blog.download-pdf');
        Route::get('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'index'])->name('state.blog.attendance');
        Route::post('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'store'])->name('state.blog.attendance.store');
        Route::post('blog/{post}/notify', [\App\Http\Controllers\EventAttendanceController::class, 'notify'])->name('state.blog.attendance.notify');
        Route::post('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'store'])->name('state.blog.attendance.store');
        Route::post('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'store'])->name('state.blog.attendance.store');
        Route::post('blog/{post}/notify', [\App\Http\Controllers\EventAttendanceController::class, 'notify'])->name('state.blog.attendance.notify');

        // Homepage Content Management
        Route::resource('leadership-messages', \App\Http\Controllers\Admin\LeadershipMessageController::class)
            ->names('state.messages')
            ->parameters(['leadership-messages' => 'message']);

        Route::resource('achievements', \App\Http\Controllers\Admin\AchievementController::class)
            ->names('state.achievements');

        Route::resource('govt-orders', \App\Http\Controllers\Admin\GovernmentOrderController::class)
            ->names('state.govt-orders')
            ->parameters(['govt-orders' => 'govtOrder']);
        
        // Academic Calendar
        Route::resource('academic-calendars', \App\Http\Controllers\Admin\AcademicCalendarController::class)
            ->names('state.calendars')
            ->parameters(['academic-calendars' => 'calendar']);

        Route::delete('academic-calendars/{calendar}/file', [\App\Http\Controllers\Admin\AcademicCalendarController::class, 'deleteFile'])->name('state.calendars.file.destroy');
        Route::post('academic-calendars/{calendar}/events', [\App\Http\Controllers\Admin\AcademicCalendarController::class, 'storeEvent'])->name('state.calendars.events.store');
        Route::delete('academic-calendar-events/{event}', [\App\Http\Controllers\Admin\AcademicCalendarController::class, 'destroyEvent'])->name('state.calendars.events.destroy');

        // Important Links
        Route::resource('important-links', \App\Http\Controllers\Admin\ImportantLinkController::class)
            ->names('state.links')
            ->parameters(['important-links' => 'link']);

        // Governance System - Institutional Decision Making
        Route::resource('committees', \App\Http\Controllers\CommitteeController::class)->names('state.committees');
        Route::post('committees/{committee}/members', [\App\Http\Controllers\CommitteeController::class, 'addMember'])->name('state.committees.add-member');
        Route::delete('committees/{committee}/members/{membershipId}', [\App\Http\Controllers\CommitteeController::class, 'removeMember'])->name('state.committees.remove-member');
        Route::resource('resolutions', \App\Http\Controllers\ResolutionController::class)->names('state.resolutions');
        Route::resource('disputes', \App\Http\Controllers\DisputeController::class)->names('state.disputes')->only(['index', 'create', 'store', 'show']);
        Route::resource('appeals', \App\Http\Controllers\AppealController::class)->names('state.appeals')->only(['index', 'create', 'store', 'show']);
        
        // Resolution Workflow
        Route::post('resolutions/{resolution}/open-voting', [\App\Http\Controllers\ResolutionController::class, 'openVoting'])->name('state.resolutions.open-voting');
        Route::post('resolutions/{resolution}/close-voting', [\App\Http\Controllers\ResolutionController::class, 'closeVoting'])->name('state.resolutions.close-voting');
        Route::post('resolutions/{resolution}/execute', [\App\Http\Controllers\ResolutionController::class, 'execute'])->name('state.resolutions.execute');
        Route::post('resolutions/{resolution}/cancel', [\App\Http\Controllers\ResolutionController::class, 'cancel'])->name('state.resolutions.cancel');
        Route::post('resolutions/{resolution}/vote', [\App\Http\Controllers\ResolutionVoteController::class, 'store'])->name('state.resolutions.vote');
        Route::get('resolutions/{resolution}/voting-stats', [\App\Http\Controllers\ResolutionVoteController::class, 'stats'])->name('state.resolutions.voting-stats');

        // Committee Elections
        Route::resource('committee-elections', \App\Http\Controllers\CommitteeElectionController::class)->names('state.committee-elections');
        Route::post('committee-elections/{election}/open-nominations', [\App\Http\Controllers\CommitteeElectionController::class, 'openNominations'])->name('state.committee-elections.open-nominations');
        Route::post('committee-elections/{election}/close-nominations', [\App\Http\Controllers\CommitteeElectionController::class, 'closeNominations'])->name('state.committee-elections.close-nominations');
        Route::post('committee-elections/{election}/open-voting', [\App\Http\Controllers\CommitteeElectionController::class, 'openVoting'])->name('state.committee-elections.open-voting');
        Route::post('committee-elections/{election}/close-voting', [\App\Http\Controllers\CommitteeElectionController::class, 'closeVoting'])->name('state.committee-elections.close-voting');
        Route::post('committee-elections/{election}/complete', [\App\Http\Controllers\CommitteeElectionController::class, 'complete'])->name('state.committee-elections.complete');
        
        // Committee Candidates
        Route::get('committee-elections/{election}/candidates/pending', [\App\Http\Controllers\CommitteeCandidateController::class, 'pending'])->name('state.committee-candidates.pending');
        Route::post('committee-candidates/{candidate}/approve', [\App\Http\Controllers\CommitteeCandidateController::class, 'approve'])->name('state.committee-candidates.approve');
        Route::post('committee-candidates/{candidate}/reject', [\App\Http\Controllers\CommitteeCandidateController::class, 'reject'])->name('state.committee-candidates.reject');
        
        // Committee Election Results
        Route::get('committee-elections/{election}/results', [\App\Http\Controllers\CommitteeElectionResultController::class, 'show'])->name('state.committee-elections.results');
        Route::get('committee-elections/{election}/results/pdf', [\App\Http\Controllers\CommitteeElectionResultController::class, 'downloadPdf'])->name('state.committee-elections.results.pdf');
        Route::get('committee-elections/{election}/results/{result}/certificate', [\App\Http\Controllers\CommitteeElectionResultController::class, 'downloadCertificate'])->name('state.committee-elections.certificate');


        // Member Enforcement (REQUIRES DISCIPLINARY RESOLUTIONS)
        Route::post('members/{member}/suspend', [MemberController::class, 'suspend'])->name('state.members.suspend');
        Route::post('members/{member}/terminate', [MemberController::class, 'terminate'])->name('state.members.terminate');
        Route::post('members/{member}/reinstate', [MemberController::class, 'reinstate'])->name('state.members.reinstate');

        // Office Profile & Letterhead Management
        Route::get('/office-profile', [\App\Http\Controllers\OfficeProfileController::class, 'show'])->name('state.office-profile.show');
        Route::get('/office-profile/edit', [\App\Http\Controllers\OfficeProfileController::class, 'edit'])->name('state.office-profile.edit');
        Route::put('/office-profile', [\App\Http\Controllers\OfficeProfileController::class, 'update'])->name('state.office-profile.update');
        Route::post('/office-profile/upload/{assetType}', [\App\Http\Controllers\OfficeProfileController::class, 'uploadAsset'])->name('state.office-profile.upload');
        Route::delete('/office-profile/delete/{assetType}', [\App\Http\Controllers\OfficeProfileController::class, 'deleteAsset'])->name('state.office-profile.delete');

        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('state.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('state.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('state.profile.destroy');

        // Homepage CMS (One-Page Manager)
        Route::get('/homepage-manager', [\App\Http\Controllers\AdminHomepageController::class, 'edit'])->name('state.homepage.edit');
        Route::match(['put', 'patch'], '/homepage/theme', [\App\Http\Controllers\AdminHomepageController::class, 'updateTheme'])->name('state.homepage.theme-update');
        Route::post('/homepage/section/{key}', [\App\Http\Controllers\AdminHomepageController::class, 'updateContent'])->name('state.homepage.content-update'); // POST for file uploads
        Route::post('/homepage/slides', [\App\Http\Controllers\AdminHomepageController::class, 'storeSlide'])->name('state.homepage.slides.store');
        Route::post('/homepage/slides/{slide}', [\App\Http\Controllers\AdminHomepageController::class, 'updateSlide'])->name('state.homepage.slides.update');
        Route::delete('/homepage/slides/{slide}', [\App\Http\Controllers\AdminHomepageController::class, 'destroySlide'])->name('state.homepage.slides.destroy');
        
        // Grievance Management (State Admin)
        Route::resource('grievances', \App\Http\Controllers\AdminGrievanceController::class)->names('state.grievances')->only(['index', 'update', 'destroy']);

        // Theme Management
        Route::get('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'edit'])->name('state.theme.edit');
        Route::post('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'update'])->name('state.theme.update');
        Route::delete('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'destroy'])->name('state.theme.destroy');
    });

    // DISTRICT LEVEL (District Admins)
    Route::prefix('district')->middleware(['role:super_admin,state_admin,district_admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('district.dashboard');
        Route::resource('admins', AdminController::class)->names('district.admins');
        Route::resource('members', MemberController::class)->names('district.members')->except(['create', 'store']);
        Route::get('district-members', [MemberController::class, 'districtMembers'])->name('district.district-members');
        Route::post('members/{member}/approve', [MemberController::class, 'approve'])->name('district.members.approve');
        Route::post('members/{member}/reject', [MemberController::class, 'reject'])->name('district.members.reject');
        Route::resource('elections', ElectionController::class)->names('district.elections');
        
        // Candidate Management (EC) - View only, approval requires portfolio
        Route::get('elections/{election}/candidates/pending', [\App\Http\Controllers\CandidateController::class, 'pending'])->name('district.candidates.pending');
        
        // Eligibility Criteria Management (EC)
        Route::get('elections/{election}/eligibility-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'index'])->name('district.eligibility-criteria.index');
        Route::put('elections/{election}/voting-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateVotingCriteria'])->name('district.voting-criteria.update');
        Route::put('elections/{election}/candidacy-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateCandidacyCriteria'])->name('district.candidacy-criteria.update');
        Route::post('elections/{election}/apply-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'applyCriteria'])->name('district.apply-criteria');
        Route::get('elections/{election}/eligible-members', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'listEligibleMembers'])->name('district.eligible-members');
        
        // Portfolio viewing (read-only)
        Route::get('portfolios', [\App\Http\Controllers\PortfolioController::class, 'index'])->name('district.portfolios.index');
        Route::get('portfolios/{portfolio}', [\App\Http\Controllers\PortfolioController::class, 'show'])->name('district.portfolios.show');
        
        // Portfolio Assignments (assign members to portfolios)
        Route::resource('portfolio-assignments', \App\Http\Controllers\PortfolioAssignmentController::class)->names('district.portfolio-assignments')->only(['index', 'create', 'store', 'destroy']);
        
        // Portfolio Holder Profile Management
        Route::get('/portfolio-holders/{position}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'show'])->name('district.portfolio-holders.show');
        Route::get('/portfolio-holders/{position}/edit', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'edit'])->name('district.portfolio-holders.edit');
        Route::put('/portfolio-holders/{position}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'update'])->name('district.portfolio-holders.update');
        Route::post('/portfolio-holders/{position}/signature', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'uploadSignature'])->name('district.portfolio-holders.signature');
        Route::post('/portfolio-holders/{position}/seal', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'uploadSeal'])->name('district.portfolio-holders.seal');
        Route::get('/portfolio-holders/{position}/image/{type}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'serveImage'])->name('district.portfolio-holders.image');
        
        // Member Transfers
        Route::resource('transfers', \App\Http\Controllers\MemberTransferController::class)->names('district.transfers')->only(['index', 'create', 'store', 'show']);
        Route::post('transfers/{transfer}/recommend', [\App\Http\Controllers\MemberTransferController::class, 'recommend'])->name('district.transfers.recommend');
        Route::post('transfers/{transfer}/approve', [\App\Http\Controllers\MemberTransferController::class, 'approve'])->name('district.transfers.approve');
        Route::post('transfers/{transfer}/reject', [\App\Http\Controllers\MemberTransferController::class, 'reject'])->name('district.transfers.reject');
        Route::post('transfers/{transfer}/complete', [\App\Http\Controllers\MemberTransferController::class, 'complete'])->name('district.transfers.complete');
        
        // Blog Management
        Route::resource('blog', \App\Http\Controllers\BlogController::class)->names('district.blog');
        Route::delete('blog/{post}/remove-image', [\App\Http\Controllers\BlogController::class, 'removeFeaturedImage'])->name('district.blog.remove-image');
        Route::get('blog/{post}/download-pdf', [\App\Http\Controllers\BlogController::class, 'downloadPdf'])->name('district.blog.download-pdf');
        Route::get('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'index'])->name('district.blog.attendance');
        Route::post('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'store'])->name('district.blog.attendance.store');
        Route::post('blog/{post}/notify', [\App\Http\Controllers\EventAttendanceController::class, 'notify'])->name('district.blog.attendance.notify');
        Route::post('blog/{post}/notify', [\App\Http\Controllers\EventAttendanceController::class, 'notify'])->name('district.blog.attendance.notify');

        // Governance System - Institutional Decision Making
        Route::resource('committees', \App\Http\Controllers\CommitteeController::class)->names('district.committees');
        Route::post('committees/{committee}/members', [\App\Http\Controllers\CommitteeController::class, 'addMember'])->name('district.committees.add-member');
        Route::delete('committees/{committee}/members/{membershipId}', [\App\Http\Controllers\CommitteeController::class, 'removeMember'])->name('district.committees.remove-member');
        Route::resource('resolutions', \App\Http\Controllers\ResolutionController::class)->names('district.resolutions');
        Route::resource('disputes', \App\Http\Controllers\DisputeController::class)->names('district.disputes')->only(['index', 'create', 'store', 'show']);
        Route::resource('appeals', \App\Http\Controllers\AppealController::class)->names('district.appeals')->only(['index', 'create', 'store', 'show']);
        
        // Resolution Workflow
        Route::post('resolutions/{resolution}/open-voting', [\App\Http\Controllers\ResolutionController::class, 'openVoting'])->name('district.resolutions.open-voting');
        Route::post('resolutions/{resolution}/close-voting', [\App\Http\Controllers\ResolutionController::class, 'closeVoting'])->name('district.resolutions.close-voting');
        Route::post('resolutions/{resolution}/execute', [\App\Http\Controllers\ResolutionController::class, 'execute'])->name('district.resolutions.execute');
        Route::post('resolutions/{resolution}/cancel', [\App\Http\Controllers\ResolutionController::class, 'cancel'])->name('district.resolutions.cancel');
        Route::post('resolutions/{resolution}/vote', [\App\Http\Controllers\ResolutionVoteController::class, 'store'])->name('district.resolutions.vote');
        Route::get('resolutions/{resolution}/voting-stats', [\App\Http\Controllers\ResolutionVoteController::class, 'stats'])->name('district.resolutions.voting-stats');

        // Committee Elections
        Route::resource('committee-elections', \App\Http\Controllers\CommitteeElectionController::class)->names('district.committee-elections');
        Route::post('committee-elections/{election}/open-nominations', [\App\Http\Controllers\CommitteeElectionController::class, 'openNominations'])->name('district.committee-elections.open-nominations');
        Route::post('committee-elections/{election}/close-nominations', [\App\Http\Controllers\CommitteeElectionController::class, 'closeNominations'])->name('district.committee-elections.close-nominations');
        Route::post('committee-elections/{election}/open-voting', [\App\Http\Controllers\CommitteeElectionController::class, 'openVoting'])->name('district.committee-elections.open-voting');
        Route::post('committee-elections/{election}/close-voting', [\App\Http\Controllers\CommitteeElectionController::class, 'closeVoting'])->name('district.committee-elections.close-voting');
        Route::post('committee-elections/{election}/complete', [\App\Http\Controllers\CommitteeElectionController::class, 'complete'])->name('district.committee-elections.complete');
        
        // Committee Candidates
        Route::get('committee-elections/{election}/candidates/pending', [\App\Http\Controllers\CommitteeCandidateController::class, 'pending'])->name('district.committee-candidates.pending');
        Route::post('committee-candidates/{candidate}/approve', [\App\Http\Controllers\CommitteeCandidateController::class, 'approve'])->name('district.committee-candidates.approve');
        Route::post('committee-candidates/{candidate}/reject', [\App\Http\Controllers\CommitteeCandidateController::class, 'reject'])->name('district.committee-candidates.reject');
        
        // Committee Election Results
        Route::get('committee-elections/{election}/results', [\App\Http\Controllers\CommitteeElectionResultController::class, 'show'])->name('district.committee-elections.results');
        Route::get('committee-elections/{election}/results/pdf', [\App\Http\Controllers\CommitteeElectionResultController::class, 'downloadPdf'])->name('district.committee-elections.results.pdf');
        Route::get('committee-elections/{election}/results/{result}/certificate', [\App\Http\Controllers\CommitteeElectionResultController::class, 'downloadCertificate'])->name('district.committee-elections.certificate');


        // Member Enforcement (REQUIRES DISCIPLINARY RESOLUTIONS)
        Route::post('members/{member}/suspend', [MemberController::class, 'suspend'])->name('district.members.suspend');
        Route::post('members/{member}/terminate', [MemberController::class, 'terminate'])->name('district.members.terminate');
        Route::post('members/{member}/reinstate', [MemberController::class, 'reinstate'])->name('district.members.reinstate');

        // Office Profile & Letterhead Management
        Route::get('/office-profile', [\App\Http\Controllers\OfficeProfileController::class, 'show'])->name('district.office-profile.show');
        Route::get('/office-profile/edit', [\App\Http\Controllers\OfficeProfileController::class, 'edit'])->name('district.office-profile.edit');
        Route::put('/office-profile', [\App\Http\Controllers\OfficeProfileController::class, 'update'])->name('district.office-profile.update');
        Route::post('/office-profile/upload/{assetType}', [\App\Http\Controllers\OfficeProfileController::class, 'uploadAsset'])->name('district.office-profile.upload');
        Route::delete('/office-profile/delete/{assetType}', [\App\Http\Controllers\OfficeProfileController::class, 'deleteAsset'])->name('district.office-profile.delete');

        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('district.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('district.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('district.profile.destroy');

        // Theme Management
        Route::get('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'edit'])->name('district.theme.edit');
        Route::post('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'update'])->name('district.theme.update');
        Route::delete('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'destroy'])->name('district.theme.destroy');
    });
    
    // TEHSIL LEVEL
    Route::prefix('tehsil')->middleware('role:super_admin,tehsil')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('tehsil.dashboard');
        Route::resource('members', MemberController::class)->names('tehsil.members');
        Route::post('members/{member}/approve', [MemberController::class, 'approve'])->name('tehsil.members.approve');
        Route::post('members/{member}/reject', [MemberController::class, 'reject'])->name('tehsil.members.reject');
        Route::resource('elections', ElectionController::class)->names('tehsil.elections');
        
        // Candidate Management (EC) - View only, approval requires portfolio
        Route::get('elections/{election}/candidates/pending', [\App\Http\Controllers\CandidateController::class, 'pending'])->name('tehsil.candidates.pending');
        
        // Eligibility Criteria Management (EC)
        Route::get('elections/{election}/eligibility-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'index'])->name('tehsil.eligibility-criteria.index');
        Route::put('elections/{election}/voting-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateVotingCriteria'])->name('tehsil.voting-criteria.update');
        Route::put('elections/{election}/candidacy-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateCandidacyCriteria'])->name('tehsil.candidacy-criteria.update');
        Route::post('elections/{election}/apply-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'applyCriteria'])->name('tehsil.apply-criteria');
        Route::get('elections/{election}/eligible-members', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'listEligibleMembers'])->name('tehsil.eligible-members');
        
        // Portfolio viewing (read-only)
        Route::get('portfolios', [\App\Http\Controllers\PortfolioController::class, 'index'])->name('tehsil.portfolios.index');
        Route::get('portfolios/{portfolio}', [\App\Http\Controllers\PortfolioController::class, 'show'])->name('tehsil.portfolios.show');
        
        // Portfolio Assignments (assign members to portfolios)
        Route::resource('portfolio-assignments', \App\Http\Controllers\PortfolioAssignmentController::class)->names('tehsil.portfolio-assignments')->only(['index', 'create', 'store', 'destroy']);
        
        // Portfolio Holder Profile Management
        Route::get('/portfolio-holders/{position}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'show'])->name('tehsil.portfolio-holders.show');
        Route::get('/portfolio-holders/{position}/edit', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'edit'])->name('tehsil.portfolio-holders.edit');
        Route::put('/portfolio-holders/{position}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'update'])->name('tehsil.portfolio-holders.update');
        Route::post('/portfolio-holders/{position}/signature', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'uploadSignature'])->name('tehsil.portfolio-holders.signature');
        Route::post('/portfolio-holders/{position}/seal', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'uploadSeal'])->name('tehsil.portfolio-holders.seal');
        Route::get('/portfolio-holders/{position}/image/{type}', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'serveImage'])->name('tehsil.portfolio-holders.image');
        
        // Member Transfers
        Route::resource('transfers', \App\Http\Controllers\MemberTransferController::class)->names('tehsil.transfers')->only(['index', 'create', 'store', 'show']);
        Route::post('transfers/{transfer}/recommend', [\App\Http\Controllers\MemberTransferController::class, 'recommend'])->name('tehsil.transfers.recommend');
        Route::post('transfers/{transfer}/approve', [\App\Http\Controllers\MemberTransferController::class, 'approve'])->name('tehsil.transfers.approve');
        Route::post('transfers/{transfer}/reject', [\App\Http\Controllers\MemberTransferController::class, 'reject'])->name('tehsil.transfers.reject');
        Route::post('transfers/{transfer}/complete', [\App\Http\Controllers\MemberTransferController::class, 'complete'])->name('tehsil.transfers.complete');
        
        // Blog Management
        Route::resource('blog', \App\Http\Controllers\BlogController::class)->names('tehsil.blog');
        Route::delete('blog/{post}/remove-image', [\App\Http\Controllers\BlogController::class, 'removeFeaturedImage'])->name('tehsil.blog.remove-image');
        Route::get('blog/{post}/download-pdf', [\App\Http\Controllers\BlogController::class, 'downloadPdf'])->name('tehsil.blog.download-pdf');
        Route::get('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'index'])->name('tehsil.blog.attendance');
        Route::post('blog/{post}/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'store'])->name('tehsil.blog.attendance.store');
        Route::post('blog/{post}/notify', [\App\Http\Controllers\EventAttendanceController::class, 'notify'])->name('tehsil.blog.attendance.notify');
        Route::post('blog/{post}/notify', [\App\Http\Controllers\EventAttendanceController::class, 'notify'])->name('tehsil.blog.attendance.notify');

        // Governance System - Institutional Decision Making
        Route::resource('committees', \App\Http\Controllers\CommitteeController::class)->names('tehsil.committees');
        Route::post('committees/{committee}/members', [\App\Http\Controllers\CommitteeController::class, 'addMember'])->name('tehsil.committees.add-member');
        Route::delete('committees/{committee}/members/{membershipId}', [\App\Http\Controllers\CommitteeController::class, 'removeMember'])->name('tehsil.committees.remove-member');
        Route::resource('resolutions', \App\Http\Controllers\ResolutionController::class)->names('tehsil.resolutions');
        Route::resource('disputes', \App\Http\Controllers\DisputeController::class)->names('tehsil.disputes')->only(['index', 'create', 'store', 'show']);
        Route::resource('appeals', \App\Http\Controllers\AppealController::class)->names('tehsil.appeals')->only(['index', 'create', 'store', 'show']);
        
        // Resolution Workflow
        Route::post('resolutions/{resolution}/open-voting', [\App\Http\Controllers\ResolutionController::class, 'openVoting'])->name('tehsil.resolutions.open-voting');
        Route::post('resolutions/{resolution}/close-voting', [\App\Http\Controllers\ResolutionController::class, 'closeVoting'])->name('tehsil.resolutions.close-voting');
        Route::post('resolutions/{resolution}/execute', [\App\Http\Controllers\ResolutionController::class, 'execute'])->name('tehsil.resolutions.execute');
        Route::post('resolutions/{resolution}/cancel', [\App\Http\Controllers\ResolutionController::class, 'cancel'])->name('tehsil.resolutions.cancel');
        Route::post('resolutions/{resolution}/vote', [\App\Http\Controllers\ResolutionVoteController::class, 'store'])->name('tehsil.resolutions.vote');
        Route::get('resolutions/{resolution}/voting-stats', [\App\Http\Controllers\ResolutionVoteController::class, 'stats'])->name('tehsil.resolutions.voting-stats');

        // Committee Elections
        Route::resource('committee-elections', \App\Http\Controllers\CommitteeElectionController::class)->names('tehsil.committee-elections');
        Route::post('committee-elections/{election}/open-nominations', [\App\Http\Controllers\CommitteeElectionController::class, 'openNominations'])->name('tehsil.committee-elections.open-nominations');
        Route::post('committee-elections/{election}/close-nominations', [\App\Http\Controllers\CommitteeElectionController::class, 'closeNominations'])->name('tehsil.committee-elections.close-nominations');
        Route::post('committee-elections/{election}/open-voting', [\App\Http\Controllers\CommitteeElectionController::class, 'openVoting'])->name('tehsil.committee-elections.open-voting');
        Route::post('committee-elections/{election}/close-voting', [\App\Http\Controllers\CommitteeElectionController::class, 'closeVoting'])->name('tehsil.committee-elections.close-voting');
        Route::post('committee-elections/{election}/complete', [\App\Http\Controllers\CommitteeElectionController::class, 'complete'])->name('tehsil.committee-elections.complete');
        
        // Committee Candidates
        Route::get('committee-elections/{election}/candidates/pending', [\App\Http\Controllers\CommitteeCandidateController::class, 'pending'])->name('tehsil.committee-candidates.pending');
        Route::post('committee-candidates/{candidate}/approve', [\App\Http\Controllers\CommitteeCandidateController::class, 'approve'])->name('tehsil.committee-candidates.approve');
        Route::post('committee-candidates/{candidate}/reject', [\App\Http\Controllers\CommitteeCandidateController::class, 'reject'])->name('tehsil.committee-candidates.reject');
        
        // Committee Election Results
        Route::get('committee-elections/{election}/results', [\App\Http\Controllers\CommitteeElectionResultController::class, 'show'])->name('tehsil.committee-elections.results');
        Route::get('committee-elections/{election}/results/pdf', [\App\Http\Controllers\CommitteeElectionResultController::class, 'downloadPdf'])->name('tehsil.committee-elections.results.pdf');
        Route::get('committee-elections/{election}/results/{result}/certificate', [\App\Http\Controllers\CommitteeElectionResultController::class, 'downloadCertificate'])->name('tehsil.committee-elections.certificate');


        // Member Enforcement (REQUIRES DISCIPLINARY RESOLUTIONS)
        Route::post('members/{member}/suspend', [MemberController::class, 'suspend'])->name('tehsil.members.suspend');
        Route::post('members/{member}/terminate', [MemberController::class, 'terminate'])->name('tehsil.members.terminate');
        Route::post('members/{member}/reinstate', [MemberController::class, 'reinstate'])->name('tehsil.members.reinstate');

        // Office Profile & Letterhead Management
        Route::get('/office-profile', [\App\Http\Controllers\OfficeProfileController::class, 'show'])->name('tehsil.office-profile.show');
        Route::get('/office-profile/edit', [\App\Http\Controllers\OfficeProfileController::class, 'edit'])->name('tehsil.office-profile.edit');
        Route::put('/office-profile', [\App\Http\Controllers\OfficeProfileController::class, 'update'])->name('tehsil.office-profile.update');
        Route::post('/office-profile/upload/{assetType}', [\App\Http\Controllers\OfficeProfileController::class, 'uploadAsset'])->name('tehsil.office-profile.upload');
        Route::delete('/office-profile/delete/{assetType}', [\App\Http\Controllers\OfficeProfileController::class, 'deleteAsset'])->name('tehsil.office-profile.delete');

        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('tehsil.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('tehsil.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('tehsil.profile.destroy');

        // Theme Management
        Route::get('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'edit'])->name('tehsil.theme.edit');
        Route::post('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'update'])->name('tehsil.theme.update');
        Route::delete('/theme', [\App\Http\Controllers\Admin\ThemeController::class, 'destroy'])->name('tehsil.theme.destroy');
    });

    // MEMBER LEVEL
    Route::prefix('member')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('member.dashboard');
        Route::get('/elections', [ElectionController::class, 'index'])->name('member.elections.index');
        Route::get('/elections/{election}', [ElectionController::class, 'show'])->name('member.elections.show');
        
        
        // Elections viewing
        Route::get('elections', [\App\Http\Controllers\ElectionController::class, 'index'])->name('member.elections.index');
        Route::get('elections/{election}', [\App\Http\Controllers\ElectionController::class, 'show'])->name('member.elections.show');
        
        // Candidate Management (for EC members) - View only, approval requires portfolio
        Route::get('elections/{election}/candidates/pending', [\App\Http\Controllers\CandidateController::class, 'pending'])->name('member.candidates.pending');
        
        // Blog Access for Members
        Route::resource('blog', \App\Http\Controllers\BlogController::class)->only(['index', 'show'])->names('member.blog');
        Route::get('blog/{post}/download-pdf', [\App\Http\Controllers\BlogController::class, 'downloadPdf'])->name('member.blog.download-pdf');
        
        // Member Attendance History
        Route::get('/attendance', [\App\Http\Controllers\EventAttendanceController::class, 'myAttendance'])->name('member.attendance.index');
        Route::get('/attendance/{attendance}/duty-slip', [\App\Http\Controllers\EventAttendanceController::class, 'downloadDutySlip'])->name('member.attendance.dutyslip');
        Route::get('/attendance/{attendance}/absent-notice', [\App\Http\Controllers\EventAttendanceController::class, 'downloadAbsentNotice'])->name('member.attendance.absentnotice');
        
        // Member Portfolio View (read-only)
        Route::get('/my-portfolio', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'myPortfolio'])->name('member.portfolio.show');
        // Member Portfolio View (read-only)
        Route::get('/my-portfolio', [\App\Http\Controllers\PortfolioHolderProfileController::class, 'myPortfolio'])->name('member.portfolio.show');

        // Member Directory Access
        Route::get('/members', [MemberController::class, 'index'])->name('member.members.index');
        Route::get('/members/{member}', [MemberController::class, 'show'])->name('member.members.show');

        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('member.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('member.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('member.profile.destroy');
    });

    // SHARED ROUTES (accessible to all authenticated users)
    Route::middleware('auth')->group(function () {
        // View elections
        Route::get('/elections', [\App\Http\Controllers\ElectionController::class, 'index'])->name('elections.index');
        Route::get('/elections/{election}', [\App\Http\Controllers\ElectionController::class, 'show'])->name('elections.show');
        
        // Nomination form & submission (members)
        Route::get('/elections/{election}/nominate', [\App\Http\Controllers\CandidateController::class, 'create'])->name('elections.nominate.form');
        Route::post('/elections/{election}/nominate', [\App\Http\Controllers\CandidateController::class, 'store'])->name('elections.nominate');

        // Grievance Submission (Authenticated Users)
        // Grievance Submission (Authenticated Users)
        Route::resource('grievances', \App\Http\Controllers\GrievanceController::class)->only(['index', 'create', 'store', 'show']);
    });
    
    
    // Voting routes (accessible to delegates)
    Route::middleware('auth')->group(function () {
        // OTP for voting - RATE LIMITED (5 per 10 minutes)
        Route::middleware('throttle:otp')->group(function () {
            Route::post('/elections/{election}/vote/request-otp', [\App\Http\Controllers\VoteController::class, 'requestOtp'])->name('elections.vote.request-otp');
            Route::post('/elections/{election}/vote/verify-otp', [\App\Http\Controllers\VoteController::class, 'verifyOtp'])->name('elections.vote.verify-otp');
        });
        
        // Voting - RATE LIMITED (1 per minute)
        // Voting Page - Standard web throttling
        Route::get('/elections/{election}/vote', [\App\Http\Controllers\VoteController::class, 'show'])->name('elections.vote.show');

        // Voting Submission - STRICT RATE LIMIT (1 per minute)
        Route::middleware('throttle:vote')->group(function () {
            Route::post('/elections/{election}/vote', [\App\Http\Controllers\VoteController::class, 'vote'])->name('elections.vote.submit');
        });
        
        Route::get('/elections/{election}/has-voted', [\App\Http\Controllers\VoteController::class, 'hasVoted'])->name('elections.has-voted');
        
        // Committee Election Voting routes (accessible to committee members and portfolio holders)
        Route::get('/committee-elections/{election}', [\App\Http\Controllers\CommitteeElectionController::class, 'show'])->name('committee-elections.show');
        Route::get('/committee-elections/{election}/nominate', [\App\Http\Controllers\CommitteeCandidateController::class, 'create'])->name('committee-elections.nominate.form');
        Route::post('/committee-elections/{election}/nominate', [\App\Http\Controllers\CommitteeCandidateController::class, 'store'])->name('committee-elections.nominate');
        
        // Committee election OTP and voting
        Route::post('/committee-elections/{election}/vote/request-otp', [\App\Http\Controllers\CommitteeVoteController::class, 'requestOtp'])->name('committee-elections.vote.request-otp');
        Route::post('/committee-elections/{election}/vote/verify-otp', [\App\Http\Controllers\CommitteeVoteController::class, 'verifyOtp'])->name('committee-elections.vote.verify-otp');
        Route::get('/committee-elections/{election}/vote', [\App\Http\Controllers\CommitteeVoteController::class, 'show'])->name('committee-elections.vote.show');
        Route::post('/committee-elections/{election}/vote', [\App\Http\Controllers\CommitteeVoteController::class, 'vote'])->name('committee-elections.vote.submit');
        Route::get('/committee-elections/{election}/has-voted', [\App\Http\Controllers\CommitteeVoteController::class, 'hasVoted'])->name('committee-elections.has-voted');
    });
    Route::post('/elections/{election}/tally', [ResultsController::class, 'tally'])->name('elections.tally');
    Route::post('/elections/{election}/certify', [ResultsController::class, 'certify'])->name('elections.certify');
    Route::get('/elections/{election}/results', [ResultsController::class, 'show'])->name('elections.results');
    Route::get('/elections/{election}/results/pdf', [ResultsController::class, 'downloadPdf'])->name('elections.results.pdf');
    
    // Candidate Nomination - Approval/rejection requires portfolio (routes in portfolio.php)
    
    // Election Commission Management
    Route::get('elections/{election}/commission', [\App\Http\Controllers\ElectionCommissionController::class, 'index'])->name('elections.commission.index');
    Route::post('elections/{election}/commission', [\App\Http\Controllers\ElectionCommissionController::class, 'store'])->name('elections.commission.store');
    Route::delete('elections/{election}/commission/{commission}', [\App\Http\Controllers\ElectionCommissionController::class, 'destroy'])->name('elections.commission.destroy');
    
    // Voter Slips
    Route::get('elections/{election}/voter-slips', [\App\Http\Controllers\VoterSlipController::class, 'index'])->name('elections.voter-slips.index');
    Route::post('elections/{election}/voter-slips/generate', [\App\Http\Controllers\VoterSlipController::class, 'generate'])->name('elections.voter-slips.generate');
    Route::get('elections/{election}/voter-slips/download', [\App\Http\Controllers\VoterSlipController::class, 'download'])->name('elections.voter-slips.download');
    Route::get('elections/{election}/voter-slips/download-all', [\App\Http\Controllers\VoterSlipController::class, 'downloadAll'])->name('elections.voter-slips.download-all');
    Route::get('elections/{election}/voter-list', [\App\Http\Controllers\VoterSlipController::class, 'voterList'])->name('elections.voter-list');
    
    // Election Delegates
    Route::get('elections/{election}/delegates', [\App\Http\Controllers\ElectionDelegateController::class, 'index'])->name('elections.delegates.index');
    Route::post('elections/{election}/delegates', [\App\Http\Controllers\ElectionDelegateController::class, 'store'])->name('elections.delegates.store');
    Route::post('elections/{election}/delegates/populate', [\App\Http\Controllers\ElectionDelegateController::class, 'populate'])->name('elections.delegates.populate');
    Route::delete('elections/{election}/delegates/{delegate}', [\App\Http\Controllers\ElectionDelegateController::class, 'destroy'])->name('elections.delegates.destroy');
    
    Route::get('members/{member}/icard', [ICardController::class, 'view'])->name('members.icard');
    Route::get('members/{member}/icard/download', [ICardController::class, 'download'])->name('members.icard.download');
    Route::get('admins/{admin}/icard/download', [ICardController::class, 'downloadAdmin'])->name('admins.icard.download');
    Route::patch('members/{member}/star-grade', [MemberController::class, 'updateStarGrade'])->name('members.star-grade');
    Route::patch('members/{member}/status', [MemberController::class, 'updateStatus'])->name('members.update-status');
    Route::patch('members/{member}/status', [MemberController::class, 'updateStatus'])->name('members.update-status');

    // Mernber/Public Blog Access
    Route::get('/posts', [\App\Http\Controllers\BlogController::class, 'publicIndex'])->name('posts.index');
    Route::get('/posts/{slug}', [\App\Http\Controllers\BlogController::class, 'publicShow'])->name('posts.show');
});

// Public member verification
Route::get('/verify/{membershipId}', [ICardController::class, 'verify'])->name('member.verify');

require __DIR__.'/auth.php';



