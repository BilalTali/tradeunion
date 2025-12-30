import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

export default function Results({ election, results, candidates }) {
    const { auth } = usePage().props;

    // Check if user is accessing via EC route (not just role-based)
    const isEC = window.location.pathname.includes('/election-commissioner/');
    const isAdmin = auth.user?.role !== 'member' || isEC;

    const getRoutePrefix = () => {
        // Detect from URL path for EC routes
        const path = window.location.pathname;
        if (path.includes('/tehsil/election-commissioner/')) return 'tehsil.ec';
        if (path.includes('/district/election-commissioner/')) return 'district.ec';
        if (path.includes('/state/election-commissioner/')) return 'state.ec';

        // Fallback to role
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'member';
    };

    const prefix = getRoutePrefix();

    const handleCertify = () => {
        if (confirm('Certify these results? This action certifies the election outcome.')) {
            router.post(route(`${prefix}.results.certify`, election.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Results - ${election.title}`} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-lg shadow-lg p-8 mb-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Election Results</h1>
                                <p className="text-indigo-100 text-lg">{election.title}</p>
                                <p className="text-indigo-200 text-sm mt-2">
                                    {election.level.charAt(0).toUpperCase() + election.level.slice(1)} Level
                                </p>
                            </div>
                            {results.length > 0 && results[0].is_certified ? (
                                <div className="bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold">CERTIFIED</span>
                                </div>
                            ) : (
                                <div className="bg-yellow-500 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <span className="font-bold">PENDING CERTIFICATION</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Winners */}
                    {results.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span>🏆</span>
                                Election Winners
                            </h2>
                            <div className="space-y-4">
                                {results.map((result) => (
                                    <div key={result.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                                                    {result.winner?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{result.winner?.name || 'Unknown'}</h3>
                                                    <p className="text-gray-600">{result.position_title}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-4">
                                                <div>
                                                    <p className="text-3xl font-bold text-gray-900">{result.vote_percentage}%</p>
                                                    <p className="text-sm text-gray-600">{result.total_votes} votes</p>
                                                </div>
                                                {result.is_certified && (
                                                    <a
                                                        href={route(`${prefix}.results.certificate`, [election.id, result.id])}
                                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                                        </svg>
                                                        Download Certificate
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Results */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>

                        {candidates.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No candidates in this election</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Candidate</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Votes</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.map((candidate, index) => {
                                            const totalVotes = results[0]?.total_voters || 1;
                                            const percentage = ((candidate.vote_count / totalVotes) * 100).toFixed(2);
                                            const isWinner = index === 0;

                                            return (
                                                <tr key={candidate.id} className={`border-b border-gray-100 ${isWinner ? 'bg-yellow-50' : ''}`}>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${isWinner ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                            {index + 1}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                                {candidate.member.name.charAt(0)}
                                                            </div>
                                                            <span className="font-semibold text-gray-900">{candidate.member.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-700">{candidate.position_title}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="font-bold text-gray-900">{candidate.vote_count}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${isWinner ? 'bg-yellow-400' : 'bg-blue-500'}`}
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-semibold text-gray-700 w-16 text-right">{percentage}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Election Statistics */}
                    {results.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <p className="text-sm text-gray-600 mb-1">Total Voters</p>
                                <p className="text-3xl font-bold text-gray-900">{results[0].total_voters}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <p className="text-sm text-gray-600 mb-1">Total Votes Cast</p>
                                <p className="text-3xl font-bold text-gray-900">{results[0].total_votes}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <p className="text-sm text-gray-600 mb-1">Voter Turnout</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {results[0].total_voters > 0 ? ((results[0].total_votes / results[0].total_voters) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && results.length > 0 && !results[0].is_certified && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Election Commission Actions</h3>
                            <button
                                onClick={handleCertify}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Certify Results
                            </button>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="mt-8">
                        <a
                            href={route(`${prefix === 'member' ? 'member' : prefix}.elections.show`, election.id)}
                            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Election
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

