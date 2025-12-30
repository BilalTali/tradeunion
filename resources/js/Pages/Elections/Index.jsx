import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ elections }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const getRolePrefix = () => {
        // First check URL path for EC routes
        const path = window.location.pathname;
        if (path.includes('/tehsil/election-commissioner/')) return 'tehsil.ec';
        if (path.includes('/district/election-commissioner/')) return 'district.ec';
        if (path.includes('/state/election-commissioner/')) return 'state.ec';

        // Fallback to user role
        if (userRole === 'super_admin') return 'state';
        if (userRole.includes('district') && !userRole.includes('member')) return 'district';
        if (userRole.includes('tehsil') && !userRole.includes('member')) return 'tehsil';
        return 'member';
    };

    const rolePrefix = getRolePrefix();

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            nominations_open: 'bg-blue-100 text-blue-800',
            nominations_closed: 'bg-yellow-100 text-yellow-800',
            voting_open: 'bg-green-100 text-green-800',
            voting_closed: 'bg-orange-100 text-orange-800',
            completed: 'bg-purple-100 text-purple-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Elections" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Elections</h1>
                            <p className="text-gray-600 mt-1">View and manage union elections</p>
                        </div>
                    </div>

                    {/* Elections Grid */}
                    {elections.data && elections.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {elections.data.map((election) => (
                                <div
                                    key={election.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden flex flex-col h-full"
                                >
                                    {/* Status Bar */}
                                    <div className={`h-2 ${election.status === 'voting_open' ? 'bg-green-500' : election.status === 'nominations_open' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

                                    <div className="p-6">
                                        {/* Title & Status */}
                                        <div className="flex items-start justify-between mb-3">
                                            <Link
                                                href={route(`${rolePrefix === 'member' && route().has('member.elections.show') ? 'member' : rolePrefix}.elections.show`, election.id)}
                                                className="text-lg font-bold text-gray-900 flex-1 hover:text-blue-600 transition"
                                            >
                                                {election.title}
                                            </Link>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(election.status)}`}>
                                                {getStatusLabel(election.status)}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {election.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {election.description}
                                            </p>
                                        )}

                                        {/* Meta Info */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="font-medium">
                                                    {election.level.charAt(0).toUpperCase() + election.level.slice(1)} Level
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    Voting: {new Date(election.voting_start).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>

                                            {/* Type */}
                                            <div className="pt-2 border-t border-gray-100">
                                                <span className="text-xs text-gray-500">
                                                    {election.election_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                            <Link
                                                href={route(`${rolePrefix === 'member' ? 'member' : rolePrefix}.elections.show`, election.id)}
                                                className="flex-1 text-center py-2 text-sm text-gray-600 font-medium hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                View Details
                                            </Link>

                                            {election.status === 'nominations_open' && (
                                                <Link
                                                    href={route('elections.nominate.form', election.id)}
                                                    className="flex-1 text-center py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    File Nomination
                                                </Link>
                                            )}

                                            {election.status === 'voting_open' && (
                                                <Link
                                                    href={route('elections.vote.show', election.id)}
                                                    className="flex-1 text-center py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Cast Vote
                                                </Link>
                                            )}

                                            {election.status === 'completed' && (
                                                <Link
                                                    href={route(`${rolePrefix}.results.show`, election.id)}
                                                    className="flex-1 text-center py-2 text-sm bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
                                                >
                                                    View Results
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Elections</h3>
                            <p className="text-gray-600">There are currently no elections available.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {elections.links && elections.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {elections.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg font-medium ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

