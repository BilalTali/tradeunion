import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ resolutions, committees, filters }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const [activeTab, setActiveTab] = useState(filters?.status || 'all');

    const getRolePrefix = () => {
        if (userRole === 'super_admin' || userRole.includes('state')) return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800 border-gray-200',
            voting: 'bg-blue-100 text-blue-800 border-blue-200',
            passed: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
            executed: 'bg-purple-100 text-purple-800 border-purple-200',
            expired: 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusLabel = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getTypeColor = (type) => {
        const colors = {
            disciplinary: 'bg-red-50 text-red-700',
            administrative: 'bg-blue-50 text-blue-700',
            financial: 'bg-green-50 text-green-700',
            election: 'bg-purple-50 text-purple-700',
            policy: 'bg-yellow-50 text-yellow-700',
        };
        return colors[type] || 'bg-gray-50 text-gray-700';
    };

    const filterResolutionsByStatus = (resolutions, status) => {
        if (status === 'all') return resolutions;
        return resolutions.filter(r => r.status === status);
    };

    const filteredResolutions = filterResolutionsByStatus(resolutions.data || [], activeTab);

    const calculateVoteProgress = (resolution) => {
        const total = resolution.votes_for + resolution.votes_against + resolution.votes_abstain;
        if (total === 0) return 0;
        return (resolution.votes_for / total) * 100;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Resolutions" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Resolutions</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Committee decisions and constitutional actions
                                </p>
                            </div>
                            {(userRole === 'super_admin' || userRole.includes('admin') || auth.user.has_portfolio) && (
                                <Link
                                    href={route(`${rolePrefix}.resolutions.create`)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Propose Resolution
                                </Link>
                            )}
                        </div>

                        {/* Status Tabs */}
                        <div className="mt-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                {['all', 'draft', 'voting', 'passed', 'rejected', 'executed'].map((tab) => {
                                    const count = tab === 'all'
                                        ? resolutions.data?.length
                                        : resolutions.data?.filter(r => r.status === tab).length;

                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`${activeTab === tab
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition`}
                                        >
                                            {tab} ({count || 0})
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Resolutions List */}
                    {filteredResolutions && filteredResolutions.length > 0 ? (
                        <div className="space-y-4">
                            {filteredResolutions.map((resolution) => (
                                <Link
                                    key={resolution.id}
                                    href={route(`${rolePrefix}.resolutions.show`, resolution.id)}
                                    className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                                        {resolution.title}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(resolution.status)}`}>
                                                        {getStatusLabel(resolution.status)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 font-mono">{resolution.resolution_number}</p>
                                            </div>
                                        </div>

                                        {/* Resolution Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Committee</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">
                                                    {resolution.committee?.name || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Type</p>
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-1 ${getTypeColor(resolution.type)}`}>
                                                    {resolution.type}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Proposed By</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">
                                                    {resolution.proposer?.position_title || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">
                                                    {new Date(resolution.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Voting Progress (for voting/passed/rejected resolutions) */}
                                        {(resolution.status === 'voting' || resolution.status === 'passed' || resolution.status === 'rejected') && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-700">Voting Progress</span>
                                                    <span className="text-xs text-gray-600">
                                                        {resolution.votes_for + resolution.votes_against + resolution.votes_abstain} votes cast
                                                    </span>
                                                </div>

                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${resolution.status === 'passed' ? 'bg-green-600' :
                                                            resolution.status === 'rejected' ? 'bg-red-600' :
                                                                'bg-blue-600'
                                                            }`}
                                                        style={{ width: `${calculateVoteProgress(resolution)}%` }}
                                                    ></div>
                                                </div>

                                                <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                                                            For: {resolution.votes_for}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                                                            Against: {resolution.votes_against}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                                                            Abstain: {resolution.votes_abstain}
                                                        </span>
                                                    </div>
                                                    {resolution.quorum_met !== null && (
                                                        <span className={`font-medium ${resolution.quorum_met ? 'text-green-600' : 'text-red-600'}`}>
                                                            Quorum: {resolution.quorum_met ? 'Met ✓' : 'Not Met ✗'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Execution Status */}
                                        {resolution.status === 'executed' && resolution.executed_at && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Executed on {new Date(resolution.executed_at).toLocaleDateString()}
                                                    {resolution.executor && ` by ${resolution.executor.position_title}`}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No resolutions found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'all'
                                    ? 'Get started by proposing a new resolution.'
                                    : `No ${activeTab} resolutions available.`}
                            </p>
                            {(userRole === 'super_admin' || userRole.includes('admin') || auth.user.has_portfolio) && activeTab === 'all' && (
                                <div className="mt-6">
                                    <Link
                                        href={route(`${rolePrefix}.resolutions.create`)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Propose Resolution
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {resolutions.links && resolutions.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {resolutions.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${index === resolutions.links.length - 1 ? 'rounded-r-md' : ''
                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

