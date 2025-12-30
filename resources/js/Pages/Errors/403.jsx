import { Head } from '@inertiajs/react';

export default function Forbidden() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
            <Head title="Access Denied" />

            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    {/* Error Icon */}
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        You don't have permission to access this page.
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-blue-800 font-semibold mb-2">Admin Access Required</p>
                        <p className="text-sm text-blue-700">
                            Only <strong>Super Admins</strong>, <strong>District Admins</strong>, and <strong>District Presidents</strong> can access the Admin Management section.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <a
                            href="/dashboard"
                            className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Go to Dashboard
                        </a>
                        <a
                            href="/logout"
                            className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Logout
                        </a>
                    </div>

                    {/* Help Text */}
                    <p className="text-xs text-gray-500 mt-6">
                        If you believe you should have access, please contact your administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}
