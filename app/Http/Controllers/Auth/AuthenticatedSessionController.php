<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\User;
use App\Mail\LoginOtpMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // We will manually handle authentication to support OTP
        $request->ensureIsNotRateLimited();

        $credentials = $request->only('email', 'password');

        if (! Auth::validate($credentials)) {
            \Illuminate\Support\Facades\RateLimiter::hit($request->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        \Illuminate\Support\Facades\RateLimiter::clear($request->throttleKey());

        $user = User::where('email', $request->email)->first();

        // OTP is ONLY for admins. Regular members login directly.
        // Checking for both possible naming conventions to be safe
        $adminRoles = ['super_admin', 'state', 'district', 'tehsil', 'zone', 'state_admin', 'district_admin', 'tehsil_admin', 'zone_admin'];
        if (!in_array($user->role, $adminRoles)) {
             Auth::login($user, $request->boolean('remember'));
             $request->session()->regenerate();
             return redirect()->intended(route('dashboard', absolute: false));
        }
        
        // Generate OTP
        $otp = rand(100000, 999999);
        $user->otp_code = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(10);
        $user->save();

        // Send Email
        try {
            \Illuminate\Support\Facades\Log::info("Sending OTP to user email: " . $user->email);
            Mail::to($user->email)->send(new LoginOtpMail($otp));
        } catch (\Exception $e) {
            // Log error or handle failure
        }

        return back()->with('status', 'OTP sent to your email.')->with('otp_required', true)->with('email', $request->email);
    }

    /**
     * Verify OTP and login.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || $user->otp_code !== $request->otp) {
            throw ValidationException::withMessages([
                'otp' => 'The provided OTP is incorrect.',
            ]);
        }

        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            throw ValidationException::withMessages([
                'otp' => 'The OTP has expired.',
            ]);
        }

        // OTP Valid - Login User
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
