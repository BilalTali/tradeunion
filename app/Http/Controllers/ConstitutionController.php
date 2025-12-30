<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConstitutionController extends Controller
{
    /**
     * Show the constitution page.
     */
    public function show()
    {
        // Fetch state level profile as default
        $state = State::first();
        $profile = $state?->officeProfile;

        return Inertia::render('Public/Constitution', [
            'constitutionPath' => $profile?->constitution_path,
            'lastUpdated' => $profile?->updated_at,
        ]);
    }
}
