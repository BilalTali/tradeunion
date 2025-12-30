import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function MembersList({ auth, election, members, filters, tehsils }) {
    const [search, setSearch] = useState(filters.search || '');
    const [zoneFilter, setZoneFilter] = useState(filters.tehsil_id || '');
    const [eligibilityFilter, setEligibilityFilter] = useState(filters.eligibility || '');

    // Determine route prefix (EC or admin)
    const getRoutePrefix = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/election-commissioner/') || currentPath.includes('/chief-election-commissioner/')) {
            return `${election.level}.ec`;
        }
        return election.level;
    };

    const routePrefix = getRoutePrefix();

    const handleFilter = () => {
        router.get(route(`${routePrefix}.eligible-members`, election.id), {
            search,
            tehsil_id: zoneFilter,
            eligibility: eligibilityFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setZoneFilter('');
        setEligibilityFilter('');
        router.get(route(`${routePrefix}.eligible-members`, election.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Eligible Members - {election.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Total: {members.total} members
                    </p>
                </div>
            }
        >
            <Head title="Eligible Members" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Name or Membership ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>

                            {/* tehsil Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    tehsil
                                </label>
                                <select
                                    value={zoneFilter}
                                    onChange={(e) => setZoneFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">All tehsils</option>
                                    {tehsils.map(tehsil => (
                                        <option key={tehsil.id} value={tehsil.id}>{tehsil.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Eligibility Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Eligibility
                                </label>
                                <select
                                    value={eligibilityFilter}
                                    onChange={(e) => setEligibilityFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">All Members</option>
                                    <option value="vote">Can Vote Only</option>
                                    <option value="contest">Can Contest Only</option>
                                    <option value="both">Can Vote & Contest</option>
                                    <option value="neither">Neither</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            S.No
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Photo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Membership ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            tehsil
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Age
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Service Years
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Union Years
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Star Grade
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Designation
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Can Vote
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Can Contest
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                                                No members found matching your criteria
                                            </td>
                                        </tr>
                                    ) : (
                                        members.data.map((member, index) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(members.current_page - 1) * 50 + index + 1}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {member.photo_path ? (
                                                        <img
                                                            src={`/storage/${member.photo_path}`}
                                                            alt={member.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-xs">
                                                                {member.name?.charAt(0) || '?'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {member.membership_id}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {member.tehsil}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {member.age || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {member.service_years || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {member.union_years || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                    {member.star_grade ? (
                                                        <span>{'⭐'.repeat(member.star_grade)}</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    <div className="max-w-xs truncate">{member.designation || 'N/A'}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                    {member.can_vote ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            ✓ Yes
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            ✗ No
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                    {member.can_contest ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            ✓ Yes
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            ✗ No
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {members.last_page > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => router.get(members.prev_page_url)}
                                        disabled={!members.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => router.get(members.next_page_url)}
                                        disabled={!members.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(members.current_page - 1) * 50 + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(members.current_page * 50, members.total)}
                                            </span>{' '}
                                            of <span className="font-medium">{members.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => router.get(members.prev_page_url)}
                                                disabled={!members.prev_page_url}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                Page {members.current_page} of {members.last_page}
                                            </span>
                                            <button
                                                onClick={() => router.get(members.next_page_url)}
                                                disabled={!members.next_page_url}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-start">
                        <a
                            href={route(`${routePrefix}.eligibility-criteria.index`, election.id)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            ← Back to Criteria
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

