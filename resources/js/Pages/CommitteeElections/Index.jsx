import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ elections }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const getRolePrefix = () => {
        if (userRole === 'super_admin') return 'state';
        if (userRole.includes('district') && !userRole.includes('member')) return 'district';
        if (userRole.includes('tehsil') && !userRole.includes('member')) return 'tehsil';
        return 'state';
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
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getElectionTypeLabel = (type) => {
        const labels = {
            leadership: 'Leadership Election',
            membership: 'Membership Election',
            custom: 'Custom Election',
        };
        return labels[type] || type;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Committee Elections" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Committee Elections</h1>
                            <p className="text-gray-600 mt-1">View and manage committee elections</p>
                        </div>

                        {/* Create Button for admins */}
                        {(userRole === 'super_admin' || userRole.includes('admin')) && (
                            <Link
                                href={route(`${rolePrefix}.committee-elections.create`)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Election
                            </Link>
                        )}
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
                                                href={route('committee-elections.show', election.id)}
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="font-medium">
                                                    {election.committee?.name || 'Committee'}
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
                                                    {getElectionTypeLabel(election.election_type)}
                                                </span>
                                            </div>

                                            {/* Eligible Voters Count */}
                                            {election.eligible_voters_count > 0 && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    <span className="text-xs">
                                                        {election.eligible_voters_count} Eligible Voters
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                            <Link
                                                href={route('committee-elections.show', election.id)}
                                                className="flex-1 text-center py-2 text-sm text-gray-600 font-medium hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                View Details
                                            </Link>

                                            {election.status === 'nominations_open' && (
                                                <Link
                                                    href={route('committee-elections.nominate.form', election.id)}
                                                    className="flex-1 text-center py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    File Nomination
                                                </Link>
                                            )}

                                            {election.status === 'voting_open' && (
                                                <Link
                                                    href={route('committee-elections.vote.show', election.id)}
                                                    className="flex-1 text-center py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Cast Vote
                                                </Link>
                                            )}

                                            {election.status === 'completed' && (
                                                <Link
                                                    href={route(`${rolePrefix}.committee-elections.results`, election.id)}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Committee Elections</h3>
                            <p className="text-gray-600">There are currently no committee elections available.</p>
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

