import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ committees, filters }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const [activeTab, setActiveTab] = useState(filters?.status || 'all');

    const getRolePrefix = () => {
        // Prioritize active portfolio level if available
        if (auth.portfolioLevel) {
            return auth.portfolioLevel;
        }

        const role = userRole.toLowerCase();
        if (role === 'super_admin' || role.includes('state')) return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';

        // Default fallback
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const getTypeColor = (type) => {
        const colors = {
            executive: 'bg-purple-100 text-purple-800 border-purple-200',
            election_commission: 'bg-blue-100 text-blue-800 border-blue-200',
            disciplinary: 'bg-red-100 text-red-800 border-red-200',
            finance: 'bg-green-100 text-green-800 border-green-200',
            audit: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            custom: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getTypeLabel = (type) => {
        const labels = {
            executive: 'Executive',
            election_commission: 'Election Commission',
            disciplinary: 'Disciplinary',
            finance: 'Finance',
            audit: 'Audit',
            custom: 'Custom',
        };
        return labels[type] || type;
    };

    const getLevelIcon = (level) => {
        const icons = {
            state: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
            ),
            district: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            tehsil: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        };
        return icons[level] || icons.state;
    };

    const filterCommitteesByStatus = (committees, status) => {
        if (status === 'all') return committees;
        if (status === 'active') return committees.filter(c => c.is_active);
        if (status === 'inactive') return committees.filter(c => !c.is_active);
        return committees;
    };

    const filteredCommittees = filterCommitteesByStatus(committees.data || [], activeTab);

    return (
        <AuthenticatedLayout>
            <Head title="Committees" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Committees</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Constitutional bodies for collective decision-making
                                </p>
                            </div>
                            {(userRole === 'super_admin' || userRole.includes('admin')) && (
                                <Link
                                    href={route(`${rolePrefix}.committees.create`)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Committee
                                </Link>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="mt-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {['all', 'active', 'inactive'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`${activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition`}
                                    >
                                        {tab} ({tab === 'all' ? committees.data?.length : filterCommitteesByStatus(committees.data || [], tab).length})
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Committees Grid */}
                    {filteredCommittees && filteredCommittees.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCommittees.map((committee) => (
                                <Link
                                    key={committee.id}
                                    href={route(`${rolePrefix}.committees.show`, committee.id)}
                                    className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 overflow-hidden group"
                                >
                                    {/* Status Bar */}
                                    <div className={`h-2 ${committee.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                                    <div className="p-6">
                                        {/* Type Badge */}
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(committee.type)}`}>
                                                {getTypeLabel(committee.type)}
                                            </span>
                                            {!committee.is_active && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>

                                        {/* Committee Name */}
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                                            {committee.name}
                                        </h3>

                                        {/* Description */}
                                        {committee.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {committee.description}
                                            </p>
                                        )}

                                        {/* Meta Information */}
                                        <div className="space-y-2 text-sm text-gray-600">
                                            {/* Level */}
                                            <div className="flex items-center gap-2">
                                                {getLevelIcon(committee.level)}
                                                <span className="font-medium capitalize">
                                                    {committee.level} Level
                                                </span>
                                            </div>

                                            {/* Members */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>
                                                    {committee.active_members_count || 0} / {committee.max_members} Members
                                                </span>
                                            </div>

                                            {/* Quorum */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    Quorum: {committee.quorum_percentage}% | Threshold: {committee.voting_threshold}%
                                                </span>
                                            </div>

                                            {/* Tenure */}
                                            {committee.start_date && (
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>
                                                        {new Date(committee.start_date).toLocaleDateString()}
                                                        {committee.end_date && ` - ${new Date(committee.end_date).toLocaleDateString()}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No committees found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'all'
                                    ? 'Get started by creating a new committee.'
                                    : `No ${activeTab} committees available.`}
                            </p>
                            {(userRole === 'super_admin' || userRole.includes('admin')) && activeTab === 'all' && (
                                <div className="mt-6">
                                    <Link
                                        href={route(`${rolePrefix}.committees.create`)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Committee
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {committees.links && committees.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {committees.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${index === committees.links.length - 1 ? 'rounded-r-md' : ''
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

