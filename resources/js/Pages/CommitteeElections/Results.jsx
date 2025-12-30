import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Results({ election, resultsByPosition, rolePrefix }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title={`Results - ${election.title}`} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
                        <p className="text-gray-600 mb-4">Committee: {election.committee?.name}</p>

                        {/*Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-600 mb-1">Eligible Voters</p>
                                <p className="text-2xl font-bold text-blue-900">{election.eligible_voters_count || 0}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-600 mb-1">Total Votes Cast</p>
                                <p className="text-2xl font-bold text-green-900">{election.total_votes_cast || 0}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-600 mb-1">Voter Turnout</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {election.eligible_voters_count > 0
                                        ? `${((election.total_votes_cast / election.eligible_voters_count) * 100).toFixed(1)}%`
                                        : '0%'
                                    }
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-sm text-orange-600 mb-1">Candidates</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {Object.values(resultsByPosition || {}).reduce((sum, results) => sum + results.length, 0)}
                                </p>
                            </div>
                        </div>

                        {/* Download PDF Button */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <a
                                href={route(`${rolePrefix}.committee-elections.results.pdf`, election.id)}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Results (PDF)
                            </a>
                        </div>
                    </div>

                    {/* Results by Position */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Results by Position</h2>

                        {resultsByPosition && Object.keys(resultsByPosition).length > 0 ? (
                            Object.entries(resultsByPosition).map(([position, results]) => (
                                <div key={position} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Position Header */}
                                    <div className="bg-blue-600 px-6 py-4">
                                        <h3 className="text-xl font-bold text-white">
                                            {position.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </h3>
                                    </div>

                                    {/* Candidates for this position */}
                                    <div className="divide-y divide-gray-200">
                                        {results.map((result, index) => (
                                            <div
                                                key={result.id}
                                                className={`flex items-center justify-between p-6 ${index === 0 ? 'bg-green-50 border-l-4 border-green-500' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    {index === 0 && (
                                                        <span className="text-4xl">🏆</span>
                                                    )}
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">
                                                            {result.member?.name || 'Unknown'}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Member ID: {result.member?.membership_id || 'N/A'}
                                                        </p>
                                                        {result.nomination_statement && (
                                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                {result.nomination_statement}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-3xl font-bold text-gray-900">
                                                        {result.vote_count || 0}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {election.total_votes_cast > 0
                                                            ? `${((result.vote_count / election.total_votes_cast) * 100).toFixed(1)}%`
                                                            : '0%'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Download Winner Certificate */}
                                    {results[0] && (
                                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                            <a
                                                href={route(`${rolePrefix}.committee-elections.certificate`, [election.id, results[0].id])}
                                                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Download Winner Certificate
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Available</h3>
                                <p className="text-gray-600">Results will appear here once the election is completed.</p>
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-8">
                        <Link
                            href={route(`${rolePrefix}.committee-elections.index`)}
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
