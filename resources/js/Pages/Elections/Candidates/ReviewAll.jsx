import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ReviewAll({ candidates, level }) {
    const { auth } = usePage().props;
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const getRoutePrefix = () => {
        // Check if user has an active portfolio - use portfolio routes
        if (auth.activePortfolio && auth.portfolioLevel) {
            const portfolioType = auth.activePortfolio.type;
            const level = auth.portfolioLevel;

            // If it's an election commission portfolio, use EC routes
            if (portfolioType === 'election_commission') {
                return `${level}.ec`;
            }
            // If it's a president portfolio, use president routes
            if (auth.activePortfolio.name?.includes('President')) {
                return `${level}.president`;
            }
            // Default to level-based routing for other portfolios
            return level;
        }

        // Fall back to role-based routing
        const role = auth?.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const prefix = getRoutePrefix();

    const handleApprove = (candidateId) => {
        if (confirm('Approve this nomination?')) {
            router.post(route(`${prefix}.candidates.approve`, candidateId));
        }
    };

    const handleReject = (candidateId) => {
        if (!rejectionReason || rejectionReason.length < 10) {
            alert('Please provide a reason for rejection (minimum 10 characters)');
            return;
        }

        router.post(route(`${prefix}.candidates.reject`, candidateId), {
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                setRejectingId(null);
                setRejectionReason('');
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Review All Nominations" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review All Nominations</h1>
                        <p className="text-gray-600">
                            All Pending Candidates: {candidates.length}
                        </p>
                    </div>

                    {/* Candidates List */}
                    {candidates.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Nominations</h3>
                            <p className="text-gray-600">All nominations have been reviewed.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {candidates.map((candidate) => (
                                <div key={candidate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        {/* Candidate Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                                                    {candidate.member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{candidate.member.name}</h3>
                                                    <p className="text-sm text-gray-600">Position: {candidate.position_title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Election: <span className="font-medium">{candidate.election.title}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Submitted: {new Date(candidate.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                Pending Review
                                            </span>
                                        </div>

                                        {/* Vision Statement */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Vision Statement</h4>
                                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                {candidate.vision_statement}
                                            </p>
                                        </div>

                                        {/* Qualifications */}
                                        {candidate.qualifications && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Qualifications</h4>
                                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    {candidate.qualifications}
                                                </p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {rejectingId === candidate.id ? (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Rejection Reason <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    placeholder="Provide a detailed reason for rejection (minimum 10 characters)..."
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleReject(candidate.id)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                                    >
                                                        Confirm Rejection
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setRejectingId(null);
                                                            setRejectionReason('');
                                                        }}
                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApprove(candidate.id)}
                                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setRejectingId(candidate.id)}
                                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
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

