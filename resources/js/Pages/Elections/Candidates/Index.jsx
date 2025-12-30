import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function CandidatesIndex({ election, candidates }) {
    const { auth } = usePage().props;

    const handleApprove = (candidateId) => {
        router.post(route('candidates.approve', candidateId), {}, {
            preserveScroll: true
        });
    };

    const handleReject = (candidateId) => {
        if (confirm('Are you sure you want to reject this candidate?')) {
            router.post(route('candidates.reject', candidateId), {}, {
                preserveScroll: true
            });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const groupedCandidates = candidates.data?.reduce((acc, candidate) => {
        const position = candidate.position_title;
        if (!acc[position]) acc[position] = [];
        acc[position].push(candidate);
        return acc;
    }, {}) || {};

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Candidates - ${election.title}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('elections.show', election.id)}
                            className="text-red-600 hover:text-red-800 mb-4 inline-block"
                        >
                            ← Back to Election
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Candidates Management</h1>
                                <p className="mt-2 text-gray-600">{election.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Candidates</p>
                                <p className="text-2xl font-bold text-gray-900">{candidates.total || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-yellow-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-800">
                                {candidates.data?.filter(c => c.status === 'pending').length || 0}
                            </p>
                            <p className="text-sm text-yellow-600">Pending</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-green-800">
                                {candidates.data?.filter(c => c.status === 'approved').length || 0}
                            </p>
                            <p className="text-sm text-green-600">Approved</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-red-800">
                                {candidates.data?.filter(c => c.status === 'rejected').length || 0}
                            </p>
                            <p className="text-sm text-red-600">Rejected</p>
                        </div>
                    </div>

                    {/* Candidates by Position */}
                    {Object.keys(groupedCandidates).length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(groupedCandidates).map(([position, positionCandidates]) => (
                                <div key={position} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="bg-gradient-to-r from-red-600 to-amber-600 px-6 py-4">
                                        <h2 className="text-xl font-semibold text-white">{position}</h2>
                                        <p className="text-red-100 text-sm">{positionCandidates.length} candidates</p>
                                    </div>
                                    <div className="divide-y">
                                        {positionCandidates.map((candidate) => (
                                            <div key={candidate.id} className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {candidate.member?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{candidate.member?.name}</h3>
                                                            <p className="text-sm text-gray-500">{candidate.member?.tehsil?.name}, {candidate.member?.tehsil?.district?.name}</p>
                                                            {candidate.vision_statement && (
                                                                <p className="mt-2 text-sm text-gray-600">{candidate.vision_statement}</p>
                                                            )}
                                                            {candidate.qualifications && (
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    <span className="font-medium">Qualifications:</span> {candidate.qualifications}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(candidate.status)}`}>
                                                            {candidate.status}
                                                        </span>
                                                        {candidate.status === 'pending' && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleApprove(candidate.id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(candidate.id)}
                                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-500">No candidates have submitted nominations yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

