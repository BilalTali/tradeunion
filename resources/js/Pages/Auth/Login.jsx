import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props;
    const [otpRequired, setOtpRequired] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        otp: '',
        remember: false,
    });

    useEffect(() => {
        if (flash?.otp_required) {
            setOtpRequired(true);
            setData('email', flash.email || data.email);
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();

        if (otpRequired) {
            post(route('otp.verify'), {
                onFinish: () => reset('otp'),
            });
        } else {
            post(route('login'), {
                // onFinish: () => reset('password'), // Don't reset if we might need to show OTP
                onSuccess: () => {
                    // Check if OTP is required after success (handled by useEffect on flash)
                },
                onError: () => reset('password')
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Page Title */}
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808] mb-2 font-serif">
                    {otpRequired ? 'Verify OTP' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                    {otpRequired ? 'Enter the OTP sent to your email' : 'Sign in to access your union portal'}
                </p>
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {status}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {!otpRequired ? (
                    <>
                        {/* Email Field */}
                        <div>
                            <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-bold mb-2" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full text-base py-3 focus:ring-[#138808] focus:border-[#138808]"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                icon={
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                }
                            />

                            <p className="mt-1.5 text-xs text-gray-500">Use your registered email address</p>

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-bold mb-2" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full text-base py-3 focus:ring-[#138808] focus:border-[#138808]"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                icon={
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                }
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="text-[#138808] focus:ring-[#138808]"
                                />
                                <span className="ms-2 text-sm text-gray-600 group-hover:text-[#138808] transition-colors font-medium">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-[#FF9933] hover:text-[#e08520] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* OTP Field */}
                        <div>
                            <InputLabel htmlFor="otp" value="One Time Password (OTP)" className="text-gray-700 font-bold mb-2" />

                            <TextInput
                                id="otp"
                                type="text"
                                name="otp"
                                value={data.otp}
                                className="mt-1 block w-full text-base py-3 focus:ring-[#138808] focus:border-[#138808] tracking-widest text-center text-xl font-bold"
                                autoComplete="one-time-code"
                                isFocused={true}
                                onChange={(e) => setData('otp', e.target.value)}
                                maxLength={6}
                            />

                            <p className="mt-2 text-sm text-center text-gray-600">
                                Sending OTP to: <span className="font-bold">{data.email}</span>
                            </p>

                            <InputError message={errors.otp} className="mt-2" />
                        </div>
                    </>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3.5 text-base bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] hover:shadow-lg text-gray-800 font-bold border border-gray-200"
                        disabled={processing}
                        processing={processing}
                    >
                        {processing ? 'Processing...' : (otpRequired ? 'Verify & Login' : 'Continue')}
                    </PrimaryButton>

                    {otpRequired && (
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setOtpRequired(false)}
                                className="text-sm text-gray-600 hover:text-[#138808] hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Additional Help */}
                <div className="pt-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Having trouble logging in?{' '}
                        <Link
                            href="/contact"
                            className="font-bold text-[#138808] hover:underline transition-colors"
                        >
                            Contact Support
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
