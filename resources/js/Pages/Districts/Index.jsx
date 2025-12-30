import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, districts }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">District Bodies</h2>}
        >
            <Head title="District Bodies" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {districts.map((district) => (
                            <Link
                                key={district.id}
                                href={route('districts.show', district.id)}
                                className="block"
                            >
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                                            {district.name}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>State:</span>
                                                <span className="font-medium text-gray-800">{district.state?.name || 'J&K'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Members:</span>
                                                <span className="font-medium text-gray-800">{district.members_count || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Office Bearers:</span>
                                                <span className="font-medium text-green-600">{district.active_leaders_count || 0}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                            <span className="text-blue-600 text-sm font-medium flex items-center">
                                                View Details
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {districts.length === 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center text-gray-500">
                            No districts found.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
