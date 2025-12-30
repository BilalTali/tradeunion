import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ resolution, canVote, hasVoted, userVote, votingStats }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const [showVoteModal, setShowVoteModal] = useState(false);
    const [selectedVote, setSelectedVote] = useState(null);

    const getRolePrefix = () => {
        if (userRole === 'super_admin' || userRole.includes('state')) return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const { data, setData, post, processing } = useForm({
        vote: '',
        notes: '',
    });

    const handleVoteClick = (voteType) => {
        setSelectedVote(voteType);
        setData('vote', voteType);
        setShowVoteModal(true);
    };

    const handleSubmitVote = (e) => {
        e.preventDefault();
        post(route(`${rolePrefix}.resolutions.vote`, resolution.id), {
            onSuccess: () => {
                setShowVoteModal(false);
                setSelectedVote(null);
            }
        });
    };

    const handleStatusAction = (action) => {
        const confirmations = {
            'open-voting': 'Open voting on this resolution? All committee members will be able to vote.',
            'close-voting': 'Close voting and finalize results? This will determine if the resolution passes or fails.',
            'execute': 'Execute this resolution? This action will be recorded and cannot be undone.',
            'cancel': 'Cancel this resolution? This will mark it as cancelled.',
        };

        if (confirm(confirmations[action])) {
            if (action === 'execute') {
                const notes = prompt('Execution notes (optional):');
                router.post(route(`${rolePrefix}.resolutions.${action}`, resolution.id), {
                    execution_notes: notes
                });
            } else {
                router.post(route(`${rolePrefix}.resolutions.${action}`, resolution.id));
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            voting: 'bg-blue-100 text-blue-800',
            passed: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            executed: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getTypeColor = (type) => {
        const colors = {
            disciplinary: 'bg-red-50 text-red-700 border-red-200',
            administrative: 'bg-blue-50 text-blue-700 border-blue-200',
            financial: 'bg-green-50 text-green-700 border-green-200',
            election: 'bg-purple-50 text-purple-700 border-purple-200',
            policy: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        };
        return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const quorumPercentage = votingStats ? (votingStats.votesReceived / votingStats.totalMembers) * 100 : 0;
    const quorumMet = quorumPercentage >= (resolution.committee?.quorum_percentage || 50);
    const votePercentageFor = votingStats && votingStats.totalVotes > 0
        ? (resolution.votes_for / votingStats.totalVotes) * 100
        : 0;

    return (
        <AuthenticatedLayout>
            <Head title={resolution.title} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href={route(`${rolePrefix}.resolutions.index`)}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Resolutions
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Resolution Header */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resolution.status)}`}>
                                                {resolution.status.toUpperCase()}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(resolution.type)}`}>
                                                {resolution.type}
                                            </span>
                                        </div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{resolution.title}</h1>
                                        <p className="text-sm text-gray-600 font-mono">{resolution.resolution_number}</p>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Committee</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{resolution.committee?.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                                        <dd className="mt-1 text-sm text-gray-900 capitalize">{resolution.category?.replace(/_/g, ' ')}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Proposed By</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{resolution.proposer?.position_title || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Proposed On</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{new Date(resolution.created_at).toLocaleString()}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Proposal Content */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Proposal</h2>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap">{resolution.proposal_text}</p>
                                </div>

                                {resolution.rationale && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="text-md font-semibold text-gray-900 mb-2">Rationale</h3>
                                        <p className="text-gray-700 whitespace-pre-wrap">{resolution.rationale}</p>
                                    </div>
                                )}

                                {resolution.proposed_action && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="text-md font-semibold text-gray-900 mb-2">Proposed Action</h3>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <pre className="text-sm text-blue-900 whitespace-pre-wrap font-mono">
                                                {JSON.stringify(resolution.proposed_action, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Voting Panel (if user can vote) */}
                            {canVote && resolution.status === 'voting' && !hasVoted && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border-2 border-blue-300 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Vote</h2>
                                    <p className="text-sm text-gray-600 mb-4">As a committee member, your vote is required on this resolution.</p>

                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => handleVoteClick('for')}
                                            className="p-4 bg-white border-2 border-green-500 rounded-lg hover:bg-green-50 transition text-center group"
                                        >
                                            <div className="text-3xl mb-2">👍</div>
                                            <div className="font-semibold text-green-700">For</div>
                                        </button>
                                        <button
                                            onClick={() => handleVoteClick('against')}
                                            className="p-4 bg-white border-2 border-red-500 rounded-lg hover:bg-red-50 transition text-center group"
                                        >
                                            <div className="text-3xl mb-2">👎</div>
                                            <div className="font-semibold text-red-700">Against</div>
                                        </button>
                                        <button
                                            onClick={() => handleVoteClick('abstain')}
                                            className="p-4 bg-white border-2 border-gray-400 rounded-lg hover:bg-gray-50 transition text-center group"
                                        >
                                            <div className="text-3xl mb-2">🤷</div>
                                            <div className="font-semibold text-gray-700">Abstain</div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* User's Vote (if already voted) */}
                            {hasVoted && userVote && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-green-900">You voted: <span className="uppercase font-bold">{userVote.vote}</span></p>
                                            <p className="text-xs text-green-700 mt-1">Cast on {new Date(userVote.vote_cast_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Execution Details */}
                            {resolution.status === 'executed' && resolution.executed_at && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Execution Details</h3>
                                    <dl className="space-y-2 text-sm">
                                        <div>
                                            <dt className="text-purple-700 font-medium">Executed By:</dt>
                                            <dd className="text-purple-900">{resolution.executor?.position_title || 'N/A'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-purple-700 font-medium">Executed On:</dt>
                                            <dd className="text-purple-900">{new Date(resolution.executed_at).toLocaleString()}</dd>
                                        </div>
                                        {resolution.execution_notes && (
                                            <div>
                                                <dt className="text-purple-700 font-medium">Notes:</dt>
                                                <dd className="text-purple-900">{resolution.execution_notes}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Voting Statistics */}
                            {(resolution.status === 'voting' || resolution.status === 'passed' || resolution.status === 'rejected' || resolution.status === 'executed') && votingStats && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-md font-semibold text-gray-900 mb-4">Voting Statistics</h3>

                                    {/* Quorum Status */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Quorum</span>
                                            <span className={`text-sm font-semibold ${quorumMet ? 'text-green-600' : 'text-red-600'}`}>
                                                {quorumMet ? 'Met ✓' : 'Not Met ✗'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${quorumMet ? 'bg-green-600' : 'bg-red-600'}`}
                                                style={{ width: `${Math.min(quorumPercentage, 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {votingStats.votesReceived} of {votingStats.totalMembers} members ({Math.round(quorumPercentage)}%)
                                            <br />Required: {votingStats.quorumRequired} ({resolution.committee?.quorum_percentage}%)
                                        </p>
                                    </div>

                                    {/* Vote Breakdown */}
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-600">For</span>
                                                <span className="text-sm font-semibold text-green-600">{resolution.votes_for}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${votePercentageFor}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-600">Against</span>
                                                <span className="text-sm font-semibold text-red-600">{resolution.votes_against}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-red-600 h-2 rounded-full"
                                                    style={{ width: `${votingStats.totalVotes > 0 ? (resolution.votes_against / votingStats.totalVotes) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-600">Abstain</span>
                                                <span className="text-sm font-semibold text-gray-600">{resolution.votes_abstain}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gray-400 h-2 rounded-full"
                                                    style={{ width: `${votingStats.totalVotes > 0 ? (resolution.votes_abstain / votingStats.totalVotes) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Threshold Info */}
                                    {resolution.committee?.voting_threshold && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs text-gray-600">
                                                <strong>Passing Threshold:</strong> {resolution.committee.voting_threshold}%
                                                <br />
                                                <strong>Current For:</strong> {Math.round(votePercentageFor)}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Status Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-md font-semibold text-gray-900 mb-4">Actions</h3>

                                <div className="space-y-2">
                                    {resolution.status === 'draft' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusAction('open-voting')}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium text-sm"
                                            >
                                                Open Voting
                                            </button>
                                            <button
                                                onClick={() => handleStatusAction('cancel')}
                                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition font-medium text-sm"
                                            >
                                                Cancel Resolution
                                            </button>
                                        </>
                                    )}

                                    {resolution.status === 'voting' && (
                                        <button
                                            onClick={() => handleStatusAction('close-voting')}
                                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition font-medium text-sm"
                                        >
                                            Close Voting
                                        </button>
                                    )}

                                    {resolution.status === 'passed' && (
                                        <button
                                            onClick={() => handleStatusAction('execute')}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium text-sm"
                                        >
                                            Execute Resolution
                                        </button>
                                    )}

                                    <Link
                                        href={route(`${rolePrefix}.resolutions.index`)}
                                        className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-center font-medium text-sm"
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-md font-semibold text-gray-900 mb-4">Important Dates</h3>

                                <dl className="space-y-3 text-sm">
                                    {resolution.effective_date && (
                                        <div>
                                            <dt className="text-gray-500 font-medium">Effective Date</dt>
                                            <dd className="text-gray-900">{new Date(resolution.effective_date).toLocaleDateString()}</dd>
                                        </div>
                                    )}
                                    {resolution.expires_date && (
                                        <div>
                                            <dt className="text-gray-500 font-medium">Expires On</dt>
                                            <dd className="text-gray-900">{new Date(resolution.expires_date).toLocaleDateString()}</dd>
                                        </div>
                                    )}
                                    {resolution.vote_scheduled_date && (
                                        <div>
                                            <dt className="text-gray-500 font-medium">Vote Scheduled</dt>
                                            <dd className="text-gray-900">{new Date(resolution.vote_scheduled_date).toLocaleDateString()}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Vote Modal */}
                    {showVoteModal && (
                        <div className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowVoteModal(false)}></div>

                                <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Confirm Vote: <span className="uppercase text-blue-600">{selectedVote}</span>
                                    </h3>

                                    <form onSubmit={handleSubmitVote}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Optional Notes
                                            </label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows="3"
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                placeholder="Explain your vote (optional)..."
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowVoteModal(false)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {processing ? 'Submitting...' : 'Confirm Vote'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

