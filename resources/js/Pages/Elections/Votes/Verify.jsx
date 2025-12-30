import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Verify({ election, pendingVotes }) {
    const { auth } = usePage().props;
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const getRoutePrefix = () => {
        // Detect level from current URL path (e.g., /tehsil/election-commissioner/...)
        const path = window.location.pathname;
        if (path.includes('/tehsil/')) return 'tehsil.ec';
        if (path.includes('/district/')) return 'district.ec';
        if (path.includes('/state/')) return 'state';

        // Fallback to user role (for backwards compatibility)
        const role = auth.user?.role || '';
        if (role === 'super_admin' || role === 'state_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';

        return 'state';
    };

    const prefix = getRoutePrefix();

    const handleApprove = (voteId) => {
        if (confirm('Approve this vote? The vote will be counted.')) {
            router.post(route(`${prefix}.votes.approve`, voteId));
        }
    };

    const handleReject = (voteId) => {
        if (!rejectionReason || rejectionReason.length < 10) {
            alert('Please provide a detailed reason for rejection (minimum 10 characters)');
            return;
        }

        router.post(route(`${prefix}.votes.reject`, voteId), {
            reason: rejectionReason
        }, {
            onSuccess: () => {
                setRejectingId(null);
                setRejectionReason('');
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Verify Votes" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Votes</h1>
                        <p className="text-gray-600">
                            {election.title} - Pending Verification: {pendingVotes.length}
                        </p>
                    </div>

                    {/* Empty State */}
                    {pendingVotes.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Votes Verified</h3>
                            <p className="text-gray-600">There are no pending votes requiring verification.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {pendingVotes.map((vote) => (
                                <div key={vote.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Vote Header */}
                                    <div className="bg-yellow-50 border-b border-yellow-200 p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Voter: {vote.member.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Submitted: {new Date(vote.created_at).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                                Pending Verification
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Photo Comparison */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Photo Verification</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Profile Photo */}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Profile Photo</p>
                                                    <div className="border-2 border-blue-300 rounded-lg overflow-hidden bg-gray-100">
                                                        {vote.member.verified_photo_path || vote.member.photo_path ? (
                                                            <img
                                                                src={`/storage/${vote.member.verified_photo_path || vote.member.photo_path}`}
                                                                alt="Profile"
                                                                className="w-full h-64 object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(vote.member.name) + '&background=random';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                                                                <div className="text-center text-gray-500">
                                                                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <p className="text-sm">No profile photo</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Live Photo */}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Live Captured Photo</p>
                                                    <div className="border-2 border-green-300 rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={`/storage/${vote.live_photo_path}`}
                                                            alt="Live capture"
                                                            className="w-full h-64 object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Voter Details */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Voter Information</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Name:</p>
                                                    <p className="font-semibold text-gray-900">{vote.member.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Member ID:</p>
                                                    <p className="font-semibold text-gray-900">{vote.member.membership_id || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">IP Address:</p>
                                                    <p className="font-semibold text-gray-900 font-mono text-xs">{vote.ip_address}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Vote Time:</p>
                                                    <p className="font-semibold text-gray-900">{new Date(vote.created_at).toLocaleTimeString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {rejectingId === vote.id ? (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Rejection Reason <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    placeholder="Provide a detailed reason (e.g., photo mismatch, unclear face, etc.)..."
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                                                />
                                                <p className="text-xs text-gray-600 mb-3">
                                                    {rejectionReason.length} / 10 minimum characters
                                                </p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleReject(vote.id)}
                                                        disabled={rejectionReason.length < 10}
                                                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold disabled:bg-gray-400"
                                                        style={{ backgroundColor: rejectionReason.length < 10 ? '#9ca3af' : '#111827', color: '#ffffff' }}
                                                    >
                                                        Confirm Rejection
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setRejectingId(null);
                                                            setRejectionReason('');
                                                        }}
                                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <style>{`
                                                    #btn-approve { background-color: #16a34a !important; color: white !important; }
                                                    #btn-reject { background-color: #000000 !important; color: white !important; }
                                                `}</style>
                                                <button
                                                    id="btn-approve"
                                                    onClick={() => handleApprove(vote.id)}
                                                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve Vote
                                                </button>
                                                <button
                                                    id="btn-reject"
                                                    onClick={() => setRejectingId(vote.id)}
                                                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject Vote
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

