import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ election, canVote, hasVoted, voterType, isAdmin }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.role;

    const getRoutePrefix = () => {
        if (userRole === 'super_admin') return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
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
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const handleStatusAction = (action) => {
        const confirmations = {
            'open-nominations': 'Open nominations for this committee election?',
            'close-nominations': 'Close nominations? No more candidates can file after this.',
            'open-voting': 'Open voting for this committee election?',
            'close-voting': 'Close voting? No more votes can be cast after this.',
            'complete': 'Mark this committee election as completed?',
        };

        if (confirm(confirmations[action])) {
            router.post(route(`${prefix}.committee-elections.${action}`, election.id));
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
                                <p className="text-sm text-gray-600 mb-1">Committee</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {election.committee?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {election.committee?.level ? `${election.committee.level.charAt(0).toUpperCase() + election.committee.level.slice(1)} Level` : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Election Type</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {election.election_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Eligible Voters</p>
                                <p className="text-lg font-semibold text-gray-900">{election.eligible_voters_count || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility Info */}
                    <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-4">Who Can Vote?</h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-800">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Active Committee Members ({election.committee?.active_members_count || 0})</span>
                            </div>
                            {election.allow_portfolio_holders && (
                                <div className="flex items-center gap-2 text-blue-800">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">
                                        Portfolio Holders
                                        {election.allowed_portfolio_ids?.length > 0 && ` (${election.allowed_portfolio_ids.length} specific portfolios)`}
                                        {election.restrict_to_same_level && ` (Same level only)`}
                                    </span>
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="text-blue-900 font-bold">Total Eligible: {election.eligible_voters_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* User's Eligibility Status */}
                    {canVote !== undefined && (
                        <div className={`rounded-lg shadow-sm border p-6 mb-6 ${canVote ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            {canVote ? (
                                <div>
                                    <div className="flex items-center gap-2 text-green-800 mb-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="text-lg font-bold">You are eligible to vote!</h3>
                                    </div>
                                    <p className="text-green-700">
                                        Voting as: <strong>{voterType === 'committee_member' ? 'Committee Member' : 'Portfolio Holder'}</strong>
                                    </p>
                                    {hasVoted && (
                                        <p className="mt-2 text-green-600 text-sm">✓ You have already voted in this election</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="text-lg font-bold">You are not eligible to vote</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">You must be either a committee member or an authorized portfolio holder.</p>
                                </div>
                            )}
                        </div>
                    )}

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

                    {/* Member Actions */}
                    <div className="space-y-4">
                        {canVote && election.status === 'nominations_open' && !hasVoted && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">Nominations Are Open!</h3>
                                <p className="text-blue-700 mb-4">File your nomination for this committee election</p>
                                <Link
                                    href={route('committee-elections.nominate.form', election.id)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                                >
                                    File Nomination
                                </Link>
                            </div>
                        )}

                        {canVote && election.status === 'voting_open' && !hasVoted && (
                            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                                <h3 className="text-lg font-bold text-green-900 mb-2">Voting Is Open!</h3>
                                <p className="text-green-700 mb-4">Cast your vote in this committee election</p>
                                <Link
                                    href={route('committee-elections.vote.show', election.id)}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                                >
                                    Cast Your Vote
                                </Link>
                            </div>
                        )}

                        {/* Admin Actions */}
                        {isAdmin && (
                            <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">⚙️</span>
                                    <h3 className="text-lg font-bold text-purple-900">Admin Actions</h3>
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
                                                href={route(`${prefix}.committee-candidates.pending`, election.id)}
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
                                        <button
                                            onClick={() => handleStatusAction('complete')}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                                        >
                                            Complete Election
                                        </button>
                                    )}

                                    {election.status !== 'completed' && (
                                        <Link
                                            href={route(`${prefix}.committee-elections.edit`, election.id)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                                        >
                                            Edit Details
                                        </Link>
                                    )}

                                    {election.status === 'completed' && (
                                        <Link
                                            href={route(`${prefix}.committee-elections.results`, election.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                        >
                                            View Results
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* View Results (for all if completed) */}
                        {election.status === 'completed' && !isAdmin && (
                            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
                                <h3 className="text-lg font-bold text-purple-900 mb-2">Results Available</h3>
                                <p className="text-purple-700 mb-4">View the final committee election results</p>
                                <Link
                                    href={route(`${prefix}.committee-elections.results`, election.id)}
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition"
                                >
                                    ViewResults
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-8">
                        <Link
                            href={route('committee-elections.show', election.id) || route(`${prefix}.committee-elections.index`)}
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

