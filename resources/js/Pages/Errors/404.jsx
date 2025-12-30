import { Head, Link, usePage } from '@inertiajs/react';

export default function Error404() {
    const { auth } = usePage().props;

    const getDashboardRoute = () => {
        if (!auth?.user) return '/';

        const role = auth.user.role;
        if (role === 'member') return '/member/dashboard';
        if (role === 'super_admin') return '/state/dashboard';
        if (role.includes('district')) return '/district/dashboard';
        if (role.includes('tehsil')) return '/tehsil/dashboard';
        return '/';
    };

    return (
        <>
            <Head title="404 - Page Not Found" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center">
                    {/* Error Code */}
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                            404
                        </h1>
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-gray-600 mb-2">
                            Sorry, we couldn't find the page you're looking for.
                        </p>
                        <p className="text-sm text-gray-500">
                            The page may have been moved, deleted, or the URL might be incorrect.
                        </p>
                    </div>

                    {/* Error Icon */}
                    <div className="mb-12 flex justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-16 h-16 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-75"></div>
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full opacity-75"></div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {/* Go Back Button */}
                        <button
                            onClick={() => window.history.back()}
                            className="group inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg
                                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Go Back
                        </button>

                        {/* Home/Dashboard Button */}
                        <Link
                            href={getDashboardRoute()}
                            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {auth?.user ? 'Go to Dashboard' : 'Go to Home'}
                        </Link>
                    </div>

                    {/* Additional Help */}
                    <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Need Help?
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                            {auth?.user && (
                                <Link
                                    href="/contact"
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                >
                                    Contact Support
                                </Link>
                            )}
                            <Link
                                href="/"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                                Visit Homepage
                            </Link>
                            {auth?.user && (
                                <Link
                                    href={getDashboardRoute()}
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                >
                                    View Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="mt-12">
                        <p className="text-sm text-gray-500">
                            Employees' Union Portal
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

