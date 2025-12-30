import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ResponsiveTable from '@/Components/ResponsiveTable';
import { useState } from 'react';

export default function Index({ members, filters, districts, statuses, canCreate, userRole, auth, showingTransferredOnly }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [districtId, setDistrictId] = useState(filters.district_id || '');
    const [tehsilId, setTehsilId] = useState(filters.tehsil_id || '');

    const role = auth?.user?.role || userRole;
    const isTehsilAdmin = role?.toLowerCase().includes('tehsil') && !role?.toLowerCase().includes('member');

    const getRoutePrefix = () => {
        if (!role) return 'member';
        const lowerRole = role.toLowerCase();
        if (lowerRole === 'super_admin') return 'state';
        if (lowerRole.includes('district') && !lowerRole.includes('member')) return 'district';
        if (lowerRole.includes('tehsil') && !lowerRole.includes('member')) return 'tehsil';
        return 'member';
    };

    const prefix = getRoutePrefix();

    const handleFilter = () => {
        router.get(route(`${prefix}.members.index`), {
            search,
            status: status !== 'all' ? status : undefined,
            district_id: districtId || undefined,
            tehsil_id: tehsilId || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setDistrictId('');
        setTehsilId('');
        router.get(route(`${prefix}.members.index`));
    };

    const getStatusBadge = (memberStatus) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-red-100 text-red-800',
            resigned: 'bg-gray-100 text-gray-800',
            deceased: 'bg-black text-white',
        };
        return badges[memberStatus] || 'bg-gray-100 text-gray-800';
    };

    const selectedDistrict = districts.find(d => d.id == districtId);

    return (
        <AuthenticatedLayout user={auth.user} header="Member Management">
            <Head title="Members" />

            <div className="py-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Members</h2>
                    {canCreate && (
                        <Link
                            href={route('tehsil.members.create')}
                            className="bg-union-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Add New Member
                        </Link>
                    )}
                </div>

                {/* District Admin Notice */}
                {showingTransferredOnly && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">Viewing District Members</p>
                                <p className="mt-1">This list shows all members from your specific district. The <strong>tehsil 📍</strong> column shows which tehsil each member belongs to.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters - Hide for tehsil admins as they only see their tehsil */}
                {!isTehsilAdmin && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Name or ID..."
                                    className="w-full border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                >
                                    <option value="all">All Statuses</option>
                                    {statuses.map(s => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    District
                                </label>
                                <select
                                    value={districtId}
                                    onChange={(e) => {
                                        setDistrictId(e.target.value);
                                        setTehsilId('');
                                    }}
                                    className="w-full border-gray-300 rounded-lg"
                                >
                                    <option value="">All Districts</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tehsil
                                </label>
                                <select
                                    value={tehsilId}
                                    onChange={(e) => setTehsilId(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                    disabled={!districtId}
                                >
                                    <option value="">All Tehsils</option>
                                    {selectedDistrict?.tehsils?.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleFilter}
                                className="bg-union-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={handleReset}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {/* Members Table */}
                <ResponsiveTable
                    data={members.data}
                    keyField="id"
                    columns={[
                        {
                            key: 'membership_id',
                            label: 'Member ID',
                            render: (member) => (
                                <span className="font-medium text-gray-900">{member.membership_id}</span>
                            )
                        },
                        {
                            key: 'name',
                            label: 'Name',
                        },
                        {
                            key: 'email',
                            label: 'Email',
                            render: (member) => (
                                <span className="text-gray-600 truncate max-w-[150px] inline-block" title={member.contact_email || member.user?.email}>
                                    {member.contact_email || member.user?.email || 'N/A'}
                                </span>
                            )
                        },
                        {
                            key: 'tehsil',
                            label: `Tehsil ${showingTransferredOnly ? '📍' : ''}`,
                            render: (member) => (
                                <span className={showingTransferredOnly ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                                    {member.tehsil?.name}
                                </span>
                            )
                        },
                        {
                            key: 'school_name',
                            label: 'Department',
                        },
                        {
                            key: 'star_grade',
                            label: 'Star Grade',
                            render: (member) => (
                                <span className="text-yellow-500">
                                    {'⭐'.repeat(member.star_grade)}
                                </span>
                            )
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            render: (member) => (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(member.status)}`}>
                                    {member.status}
                                </span>
                            )
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            render: (member) => (
                                <div className="flex justify-end gap-2">
                                    {member.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => router.post(route(`${prefix}.members.approve`, member.id), {}, {
                                                    preserveScroll: true,
                                                    onSuccess: () => alert('Member approved successfully!'),
                                                })}
                                                className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition text-xs min-h-touch"
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to reject this member?')) {
                                                        router.post(route(`${prefix}.members.reject`, member.id), {}, {
                                                            preserveScroll: true,
                                                            onSuccess: () => alert('Member rejected successfully.'),
                                                        });
                                                    }
                                                }}
                                                className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition text-xs min-h-touch"
                                            >
                                                ✗ Reject
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={route(`${prefix}.members.show`, member.id)}
                                                className="text-union-primary hover:text-red-900 font-medium"
                                            >
                                                View
                                            </Link>
                                            {prefix !== 'member' && (
                                                <Link
                                                    href={route(`${prefix}.members.edit`, member.id)}
                                                    className="text-union-secondary hover:text-amber-700 font-medium"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            )
                        }
                    ]}
                    mobileCardRenderer={(member) => (
                        <div className="bg-white shadow rounded-lg p-4 space-y-3">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b pb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-500">{member.membership_id}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(member.status)}`}>
                                    {member.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tehsil:</span>
                                    <span className={showingTransferredOnly ? 'font-semibold text-blue-600' : 'text-gray-900'}>
                                        {member.tehsil?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Department:</span>
                                    <span className="text-gray-900 text-right">{member.school_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="text-gray-900 truncate ml-2 font-medium">{member.contact_email || member.user?.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Rating:</span>
                                    <span className="text-yellow-500">
                                        {'⭐'.repeat(member.star_grade)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t">
                                {member.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => router.post(route(`${prefix}.members.approve`, member.id), {}, {
                                                preserveScroll: true,
                                                onSuccess: () => alert('Member approved successfully!'),
                                            })}
                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium min-h-touch"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to reject this member?')) {
                                                    router.post(route(`${prefix}.members.reject`, member.id), {}, {
                                                        preserveScroll: true,
                                                        onSuccess: () => alert('Member rejected successfully.'),
                                                    });
                                                }
                                            }}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium min-h-touch"
                                        >
                                            ✗ Reject
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route(`${prefix}.members.show`, member.id)}
                                            className="flex-1 text-center bg-union-primary text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium min-h-touch"
                                        >
                                            View Details
                                        </Link>
                                        {prefix !== 'member' && (
                                            <Link
                                                href={route(`${prefix}.members.edit`, member.id)}
                                                className="flex-1 text-center bg-union-secondary text-white px-4 py-2 rounded hover:bg-amber-700 transition text-sm font-medium min-h-touch"
                                            >
                                                Edit
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                />

                {/* Pagination */}
                {members.links.length > 3 && (
                    <div className="bg-white px-4 py-3 mt-4 rounded-lg shadow sm:px-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{members.from}</span> to{' '}
                                <span className="font-medium">{members.to}</span> of{' '}
                                <span className="font-medium">{members.total}</span> results
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {members.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded min-h-touch ${link.active
                                            ? 'bg-union-primary text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveState
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

