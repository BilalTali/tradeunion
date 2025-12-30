<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteVerificationController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PortfolioAssignmentController;

/*
|--------------------------------------------------------------------------
| Portfolio-Based Routes
|--------------------------------------------------------------------------
|
| These routes are accessed by members with assigned portfolios.
| They run PARALLEL to existing admin routes (no breaking changes).
| Permission checking is done via PortfolioAuth middleware.
|
*/

// ============================================
// TEHSIL ELECTION COMMISSIONER ROUTES
// ============================================
Route::prefix('tehsil/election-commissioner')
    ->middleware(['auth', 'portfolio.context'])
    ->name('tehsil.ec.')
    ->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        
        // Election Management
        Route::middleware('portfolio:election.create,write')->group(function () {
            Route::get('elections/create', [ElectionController::class, 'create'])->name('elections.create');
            Route::post('elections', [ElectionController::class, 'store'])->name('elections.store');
            Route::get('elections/{election}/edit', [ElectionController::class, 'edit'])->name('elections.edit');
            Route::put('elections/{election}', [ElectionController::class, 'update'])->name('elections.update');
            Route::delete('elections/{election}', [ElectionController::class, 'destroy'])->name('elections.destroy');
        });
        
        Route::middleware('portfolio:election.read,read')->group(function () {
            Route::get('elections', [ElectionController::class, 'index'])->name('elections.index');
            Route::get('elections/{election}', [ElectionController::class, 'show'])->name('elections.show');
        });
        
        // Election Status Transitions
        Route::middleware('portfolio:election.open_nominations,execute')
            ->post('elections/{election}/open-nominations', [ElectionController::class, 'openNominations'])
            ->name('elections.open-nominations');
            
        Route::middleware('portfolio:election.close_nominations,execute')
            ->post('elections/{election}/close-nominations', [ElectionController::class, 'closeNominations'])
            ->name('elections.close-nominations');
            
        Route::middleware('portfolio:election.open_voting,execute')
            ->post('elections/{election}/open-voting', [ElectionController::class, 'openVoting'])
            ->name('elections.open-voting');
            
        Route::middleware('portfolio:election.close_voting,execute')
            ->post('elections/{election}/close-voting', [ElectionController::class, 'closeVoting'])
            ->name('elections.close-voting');
            
        Route::middleware('portfolio:election.complete,execute')
            ->post('elections/{election}/complete', [ElectionController::class, 'complete'])
            ->name('elections.complete');
        
        // Candidate Management - All pending across all elections
        Route::middleware('portfolio:candidate.review,read')
            ->get('candidates/pending', [CandidateController::class, 'allPending'])
            ->name('candidates.all-pending');
        
        // Candidate Management - Election-specific
        Route::middleware('portfolio:candidate.review,read')
            ->get('elections/{election}/candidates/pending', [CandidateController::class, 'pending'])
            ->name('candidates.pending');
            
        Route::middleware('portfolio:candidate.approve,execute')
            ->post('candidates/{candidate}/approve', [CandidateController::class, 'approve'])
            ->name('candidates.approve');
            
        Route::middleware('portfolio:candidate.reject,execute')
            ->post('candidates/{candidate}/reject', [CandidateController::class, 'reject'])
            ->name('candidates.reject');
        
        // Vote Verification
        Route::middleware('portfolio:vote.verify,read')
            ->get('elections/{election}/votes/pending', [VoteVerificationController::class, 'pending'])
            ->name('votes.pending');
            
        Route::middleware('portfolio:vote.approve,execute')
            ->post('votes/{vote}/approve', [VoteVerificationController::class, 'approve'])
            ->name('votes.approve');
            
        Route::middleware('portfolio:vote.reject,execute')
            ->post('votes/{vote}/reject', [VoteVerificationController::class, 'reject'])
            ->name('votes.reject');
        
        // Results Management
        Route::middleware('portfolio:result.calculate,execute')
            ->post('elections/{election}/calculate-results', [ResultController::class, 'calculate'])
            ->name('results.calculate');
            
        Route::middleware('portfolio:result.certify,execute')
            ->post('elections/{election}/certify-results', [ResultController::class, 'certify'])
            ->name('results.certify');
            
        // View Results (read-only, available to all EC members)
        Route::get('elections/{election}/results', [ResultController::class, 'show'])
            ->name('results.show');
            
        // Download Winner Certificate
        Route::get('elections/{election}/results/{result}/certificate', [ResultController::class, 'downloadCertificate'])
            ->name('results.certificate');
        
        // Eligibility Criteria Management (EC)
        Route::middleware('portfolio:election.read,read')
            ->get('elections/{election}/eligibility-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'index'])
            ->name('eligibility-criteria.index');
            
        Route::middleware('portfolio:election.create,write')
            ->put('elections/{election}/voting-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateVotingCriteria'])
            ->name('voting-criteria.update');
            
        Route::middleware('portfolio:election.create,write')
            ->put('elections/{election}/candidacy-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateCandidacyCriteria'])
            ->name('candidacy-criteria.update');
            
        Route::middleware('portfolio:election.create,write')
            ->post('elections/{election}/apply-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'applyCriteria'])
            ->name('apply-criteria');
            
        Route::middleware('portfolio:election.read,read')
            ->get('elections/{election}/eligible-members', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'listEligibleMembers'])
            ->name('eligible-members');
    });

// ============================================
// DISTRICT CHIEF ELECTION COMMISSIONER ROUTES
// ============================================
Route::prefix('district/chief-election-commissioner')
    ->middleware(['auth', 'portfolio.context'])
    ->name('district.ec.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        
        // Same structure as zone EC
        Route::middleware('portfolio:election.create,write')->group(function () {
            Route::get('elections/create', [ElectionController::class, 'create'])->name('elections.create');
            Route::post('elections', [ElectionController::class, 'store'])->name('elections.store');
        });
        
        Route::middleware('portfolio:election.read,read')->group(function () {
            Route::get('elections', [ElectionController::class, 'index'])->name('elections.index');
            Route::get('elections/{election}', [ElectionController::class, 'show'])->name('elections.show');
        });
        
        Route::middleware('portfolio:election.open_nominations,execute')
            ->post('elections/{election}/open-nominations', [ElectionController::class, 'openNominations'])
            ->name('elections.open-nominations');
            
        Route::middleware('portfolio:candidate.review,read')
            ->get('elections/{election}/candidates/pending', [CandidateController::class, 'pending'])
            ->name('candidates.pending');
            
        Route::middleware('portfolio:candidate.approve,execute')
            ->post('candidates/{candidate}/approve', [CandidateController::class, 'approve'])
            ->name('candidates.approve');
            
        Route::middleware('portfolio:result.certify,execute')
            ->post('elections/{election}/certify-results', [ResultController::class, 'certify'])
            ->name('results.certify');
        
        // Eligibility Criteria Management (EC)
        Route::middleware('portfolio:election.read,read')
            ->get('elections/{election}/eligibility-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'index'])
            ->name('eligibility-criteria.index');
            
        Route::middleware('portfolio:election.create,write')
            ->put('elections/{election}/voting-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateVotingCriteria'])
            ->name('voting-criteria.update');
            
        Route::middleware('portfolio:election.create,write')
            ->put('elections/{election}/candidacy-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateCandidacyCriteria'])
            ->name('candidacy-criteria.update');
            
        Route::middleware('portfolio:election.create,write')
            ->post('elections/{election}/apply-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'applyCriteria'])
            ->name('apply-criteria');
            
        Route::middleware('portfolio:election.read,read')
            ->get('elections/{election}/eligible-members', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'listEligibleMembers'])
            ->name('eligible-members');
    });

// ============================================
// STATE CHIEF ELECTION COMMISSIONER ROUTES
// ============================================
Route::prefix('state/chief-election-commissioner')
    ->middleware(['auth', 'portfolio.context'])
    ->name('state.ec.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        
        // Full election management capabilities
        Route::middleware('portfolio:election.create,write')->group(function () {
            Route::get('elections/create', [ElectionController::class, 'create'])->name('elections.create');
            Route::post('elections', [ElectionController::class, 'store'])->name('elections.store');
        });
        
        Route::middleware('portfolio:election.read,read')->group(function () {
            Route::get('elections', [ElectionController::class, 'index'])->name('elections.index');
            Route::get('elections/{election}', [ElectionController::class, 'show'])->name('elections.show');
        });
        
        Route::middleware('portfolio:candidate.review,read')
            ->get('elections/{election}/candidates/pending', [CandidateController::class, 'pending'])
            ->name('candidates.pending');
            
        Route::middleware('portfolio:result.certify,execute')
            ->post('elections/{election}/certify-results', [ResultController::class, 'certify'])
            ->name('results.certify');
        
        // Eligibility Criteria Management (EC)
        Route::middleware('portfolio:election.read,read')
            ->get('elections/{election}/eligibility-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'index'])
            ->name('eligibility-criteria.index');
            
        Route::middleware('portfolio:election.create,write')
            ->put('elections/{election}/voting-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateVotingCriteria'])
            ->name('voting-criteria.update');
            
        Route::middleware('portfolio:election.create,write')
            ->put('elections/{election}/candidacy-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'updateCandidacyCriteria'])
            ->name('candidacy-criteria.update');
            
        Route::middleware('portfolio:election.create,write')
            ->post('elections/{election}/apply-criteria', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'applyCriteria'])
            ->name('apply-criteria');
            
        Route::middleware('portfolio:election.read,read')
            ->get('elections/{election}/eligible-members', [\App\Http\Controllers\ElectionEligibilityCriteriaController::class, 'listEligibleMembers'])
            ->name('eligible-members');
    });

// ============================================
// STATE PRESIDENT ROUTES
// ============================================
Route::prefix('state/president')
    ->middleware(['auth', 'portfolio.context'])
    ->name('state.president.')
    ->group(function () {
        
        // Member Management
        Route::middleware('portfolio:member.approve,execute')
            ->post('members/{member}/approve', [MemberController::class, 'approve'])
            ->name('members.approve');
            
        Route::middleware('portfolio:member.read,read')
            ->get('members', [MemberController::class, 'index'])
            ->name('members.index');
        
        // Portfolio Assignment
        Route::middleware('portfolio:portfolio.assign,read')->group(function () {
            Route::get('portfolio-assignments', [PortfolioAssignmentController::class, 'index'])
                ->name('portfolio-assignments.index');
            Route::get('portfolio-assignments/create', [PortfolioAssignmentController::class, 'create'])
                ->name('portfolio-assignments.create');
        });
        
        Route::middleware('portfolio:portfolio.assign,write')
            ->post('portfolio-assignments', [PortfolioAssignmentController::class, 'store'])
            ->name('portfolio-assignments.store');
            
        Route::middleware('portfolio:portfolio.revoke,delete')
            ->delete('portfolio-assignments/{portfolioAssignment}', [PortfolioAssignmentController::class, 'destroy'])
            ->name('portfolio-assignments.destroy');
    });

// ============================================
// TEHSIL PRESIDENT ROUTES
// ============================================
Route::prefix('tehsil/president')
    ->middleware(['auth', 'portfolio.context'])
    ->name('tehsil.president.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    });

// ============================================
// DISTRICT PRESIDENT ROUTES
// ============================================
Route::prefix('district/president')
    ->middleware(['auth', 'portfolio.context'])
    ->name('district.president.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    });

// ============================================
// STATE PRESIDENT ROUTES
// ============================================
Route::prefix('state/president')
    ->middleware(['auth', 'portfolio.context'])
    ->name('state.president.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    });

// ============================================
// PORTFOLIO SWITCHER API
// ============================================
Route::post('/api/switch-portfolio', function(\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'leadership_position_id' => 'required|exists:leadership_positions,id'
    ]);
    
    $service = app(\App\Services\PortfolioPermissionService::class);
    $switched = $service->switchActivePortfolio(
        $request->user(),
        $validated['leadership_position_id']
    );
    
    if (!$switched) {
        return response()->json(['error' => 'Unable to switch portfolio'], 400);
    }
    
    $activePosition = $service->getActivePosition($request->user()->member);
    $level = $activePosition->level;
    
    $slug = match(true) {
        $activePosition->portfolio->isElectionCommission() => 'election-commissioner',
        str_contains($activePosition->portfolio->code, 'PRESIDENT') => 'president',
        default => \Illuminate\Support\Str::slug($activePosition->portfolio->name)
    };
    
    return response()->json([
        'success' => true,
        'active_portfolio' => $activePosition->portfolio->name,
        'redirect_url' => "/{$level}/{$slug}/dashboard",
    ]);
})->middleware('auth')->name('api.switch-portfolio');

