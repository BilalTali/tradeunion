import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ election, hasNominated, isCommissionMember, commissionExists, hasECPortfolio, userLevel }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role !== 'member';
    const isMember = auth.user?.role === 'member';

    const getRoutePrefix = () => {
        // If user has EC portfolio, use their portfolio level + ec
        if (hasECPortfolio) {
            // Determine level from portfolio if userLevel not passed, or use 'member' as fallback? 
            // Actually, Show.jsx receives userLevel.
            if (userLevel) {
                return `${userLevel}.ec`;
            }
            // Fallback if userLevel missing but hasECPortfolio (shouldn't happen with controller fix)
            // return 'tehsil.ec'; // Safe guess? Or rely on role?
        }

        // Otherwise use role-based prefix
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.toLowerCase().includes('tehsil')) return 'tehsil';
        return 'member';
    };

    const prefix = getRoutePrefix();

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

    const handleStatusAction = (action) => {
        const confirmations = {
            'open-nominations': 'Open nominations for this election?',
            'close-nominations': 'Close nominations? No more candidates can file after this.',
            'open-voting': 'Open voting for this election?',
            'close-voting': 'Close voting? No more votes can be cast after this.',
            'complete': 'Mark this election as completed?',
        };

        if (confirm(confirmations[action])) {
            router.post(route(`${prefix}.elections.${action}`, election.id));
        }
    };

    const handleCalculateResults = () => {
        if (confirm('Calculate results? This will tally all votes.')) {
            router.post(route(`${prefix}.results.calculate`, election.id));
        }
    };


    return (
        <AuthenticatedLayout>
            <Head title={election.title} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
                                <p className="text-gray-600">{election.description || 'No description provided'}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(election.status)}`}>
                                {getStatusLabel(election.status)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Level</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {election.level.charAt(0).toUpperCase() + election.level.slice(1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Election Type</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {election.election_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Entity ID</p>
                                <p className="text-lg font-semibold text-gray-900">{election.entity_id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Election Timeline</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">📝 Nomination Period</p>
                                <p className="text-gray-900">
                                    {new Date(election.nomination_start).toLocaleString('en-IN')}
                                </p>
                                <p className="text-gray-500 text-sm">to</p>
                                <p className="text-gray-900">
                                    {new Date(election.nomination_end).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">🗳️ Voting Period</p>
                                <p className="text-gray-900">
                                    {new Date(election.voting_start).toLocaleString('en-IN')}
                                </p>
                                <p className="text-gray-500 text-sm">to</p>
                                <p className="text-gray-900">
                                    {new Date(election.voting_end).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Based on Status */}
                    <div className="space-y-4">
                        {/* Member Actions */}
                        {isMember && election.status === 'nominations_open' && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">Nominations Are Open!</h3>
                                {hasNominated ? (
                                    <div className="mt-2">
                                        <p className="text-green-700 font-semibold mb-2">
                                            ✅ You have already filed a nomination for this election.
                                        </p>
                                        <div className="inline-flex items-center px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold">
                                            Nomination Filed
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-blue-700 mb-4">File your nomination for this election</p>
                                        <Link
                                            href={route('elections.nominate.form', election.id)}
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                                        >
                                            File Nomination
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}

                        {isMember && election.status === 'voting_open' && (
                            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                                <h3 className="text-lg font-bold text-green-900 mb-2">Voting Is Open!</h3>
                                <p className="text-green-700 mb-4">Cast your vote in this election</p>
                                <button
                                    onClick={() => window.location.href = route('elections.vote.show', election.id)}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                                >
                                    Cast Your Vote
                                </button>
                            </div>
                        )}

                        {/* Eligibility Management (EC Only) */}
                        {isCommissionMember && (
                            <div className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-200 p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">⚙️</span>
                                    <h3 className="text-lg font-bold text-indigo-900">Eligibility Management</h3>
                                </div>
                                <p className="text-sm text-indigo-700 mb-4">
                                    Set voting and candidacy criteria for this election
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route(`${prefix}.eligibility-criteria.index`, election.id)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                    >
                                        ⚙️ Set Eligibility Criteria
                                    </Link>
                                    <Link
                                        href={route(`${prefix}.eligible-members`, election.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        👥 View Eligible Members ({election.eligible_voters_count || 0})
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Election Commission Actions (Status Control) */}
                        {isCommissionMember && (
                            <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">⚖️</span>
                                    <h3 className="text-lg font-bold text-purple-900">Election Commission Actions</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {election.status === 'draft' && (
                                        <button
                                            onClick={() => handleStatusAction('open-nominations')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            Open Nominations
                                        </button>
                                    )}

                                    {election.status === 'nominations_open' && (
                                        <>
                                            <Link
                                                href={route(`${prefix}.candidates.pending`, election.id)}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                                            >
                                                Review Nominations
                                            </Link>
                                            <button
                                                onClick={() => handleStatusAction('close-nominations')}
                                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
                                            >
                                                Close Nominations
                                            </button>
                                        </>
                                    )}

                                    {election.status === 'nominations_closed' && (
                                        <button
                                            onClick={() => handleStatusAction('open-voting')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                        >
                                            Open Voting
                                        </button>
                                    )}

                                    {election.status === 'voting_open' && (
                                        <button
                                            onClick={() => handleStatusAction('close-voting')}
                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                                        >
                                            Close Voting
                                        </button>
                                    )}

                                    {election.status === 'voting_closed' && (
                                        <>
                                            <button
                                                onClick={handleCalculateResults}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                            >
                                                Calculate Results
                                            </button>
                                            <button
                                                onClick={() => handleStatusAction('complete')}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                                            >
                                                Complete Election
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Admin Actions (Commission Mgmt & Edit Only) */}
                        {isAdmin && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>

                                {!commissionExists && !isCommissionMember && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    <span className="font-bold">Action Required:</span> You must appoint an Election Commission to manage this election.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    {/* Manage Commission - Available until completed */}
                                    {election.status !== 'completed' && (
                                        <Link
                                            href={route('elections.commission.index', election.id)}
                                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center"
                                        >
                                            <span className="mr-2">👥</span>
                                            Manage Commission
                                        </Link>
                                    )}

                                    {/* Edit - Always available */}
                                    <Link
                                        href={route(`${prefix}.elections.edit`, election.id)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                                    >
                                        Edit Details
                                    </Link>

                                    {/* View Results - If available */}
                                    {(election.status === 'completed' || election.status === 'voting_closed') && (
                                        <Link
                                            href={route('elections.results', election.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                        >
                                            View Results
                                        </Link>
                                    )}
                                </div>

                                {!isCommissionMember && election.status !== 'completed' && (
                                    <p className="text-xs text-gray-500 mt-4">
                                        * Note: Only the Election Commission can open/close nominations and voting.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* View Results (for all if completed) */}
                        {election.status === 'completed' && !isAdmin && !isCommissionMember && (
                            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
                                <h3 className="text-lg font-bold text-purple-900 mb-2">Results Available</h3>
                                <p className="text-purple-700 mb-4">View the final election results</p>
                                <Link
                                    href={route('elections.results', election.id)}
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition"
                                >
                                    View Results
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-8">
                        <Link
                            href={route(`${prefix === 'member' ? 'member' : prefix}.elections.index`)}
                            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Elections
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

