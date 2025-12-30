import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ committee, availableMembers, occupiedRoles }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedRole, setSelectedRole] = useState('member');

    const getRolePrefix = () => {
        if (userRole === 'super_admin' || userRole.includes('state')) return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const handleAddMember = (e) => {
        e.preventDefault();
        router.post(route(`${rolePrefix}.committees.add-member`, committee.id), {
            member_id: selectedMember,
            role: selectedRole,
        }, {
            onSuccess: () => {
                setShowAddMemberModal(false);
                setSelectedMember('');
                setSelectedRole('member');
            },
        });
    };

    const roles = [
        { value: 'chair', label: 'Chair' },
        { value: 'vice_chair', label: 'Vice Chair' },
        { value: 'secretary', label: 'Secretary' },
        { value: 'convener', label: 'Convener' },
        { value: 'member', label: 'Member' },
    ];

    const getTypeColor = (type) => {
        const colors = {
            executive: 'bg-purple-100 text-purple-800',
            election_commission: 'bg-blue-100 text-blue-800',
            disciplinary: 'bg-red-100 text-red-800',
            finance: 'bg-green-100 text-green-800',
            audit: 'bg-yellow-100 text-yellow-800',
            custom: 'bg-gray-100 text-gray-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type) => {
        const labels = {
            executive: 'Executive Committee',
            election_commission: 'Election Commission',
            disciplinary: 'Disciplinary Committee',
            finance: 'Finance Committee',
            audit: 'Audit Committee',
            custom: 'Custom Committee',
        };
        return labels[type] || type;
    };

    const getRoleLabel = (role) => {
        const labels = {
            chair: 'Chair',
            vice_chair: 'Vice Chair',
            member: 'Member',
            secretary: 'Secretary',
            convener: 'Convener',
        };
        return labels[role] || role;
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            chair: 'bg-purple-100 text-purple-800 border border-purple-200',
            vice_chair: 'bg-blue-100 text-blue-800 border border-blue-200',
            secretary: 'bg-green-100 text-green-800 border border-green-200',
            convener: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            member: 'bg-gray-100 text-gray-800 border border-gray-200',
        };
        return colors[role] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    const quorumRequired = Math.ceil((committee.active_members?.length || 0) * (committee.quorum_percentage / 100));

    return (
        <AuthenticatedLayout>
            <Head title={committee.name} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route(`${rolePrefix}.committees.index`)}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Committees
                        </Link>

                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{committee.name}</h1>
                                    {!committee.is_active && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(committee.type)}`}>
                                        {getTypeLabel(committee.type)}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 capitalize">
                                        {committee.level} Level
                                    </span>
                                </div>
                            </div>

                            {(userRole === 'super_admin' || userRole.includes('admin')) && (
                                <div className="flex gap-2">
                                    <Link
                                        href={route(`${rolePrefix}.committees.edit`, committee.id)}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Committee Info Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Committee Details</h2>

                                {committee.description && (
                                    <div className="mb-4">
                                        <p className="text-gray-700">{committee.description}</p>
                                    </div>
                                )}

                                {committee.constitutional_basis && (
                                    <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                        <p className="text-sm font-medium text-blue-900">Constitutional Basis</p>
                                        <p className="text-sm text-blue-700 mt-1">{committee.constitutional_basis}</p>
                                    </div>
                                )}

                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tenure Period</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(committee.start_date).toLocaleDateString()}
                                            {committee.end_date && ` - ${new Date(committee.end_date).toLocaleDateString()}`}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {committee.creator?.name || 'N/A'}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Member Limits</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            Min: {committee.min_members} | Max: {committee.max_members}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Current Members</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {committee.active_members?.length || 0} / {committee.max_members}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Members List */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Committee Members</h2>
                                    {(userRole === 'super_admin' || userRole.includes('admin')) && (
                                        <button
                                            onClick={() => setShowAddMemberModal(true)}
                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Member
                                        </button>
                                    )}
                                </div>

                                {committee.active_members && committee.active_members.length > 0 ? (
                                    <div className="space-y-3">
                                        {committee.active_members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-gray-900">
                                                        {member.member?.name || 'Unknown Member'}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {member.member?.membership_id || 'No ID'} - {member.member?.tehsil?.name || 'No tehsil'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Appointed: {new Date(member.appointed_date).toLocaleDateString()}
                                                        {member.term_end_date && ` - ${new Date(member.term_end_date).toLocaleDateString()}`}
                                                    </p>
                                                </div>
                                                <span className={`ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                    {getRoleLabel(member.role)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No members yet</h3>
                                        <p className="mt-1 text-sm text-gray-500">Add members to this committee to get started.</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Resolutions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Resolutions</h2>
                                    <Link
                                        href={route(`${rolePrefix}.resolutions.index`, { committee_id: committee.id })}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View All →
                                    </Link>
                                </div>

                                {committee.resolutions && committee.resolutions.length > 0 ? (
                                    <div className="space-y-3">
                                        {committee.resolutions.map((resolution) => (
                                            <Link
                                                key={resolution.id}
                                                href={route(`${rolePrefix}.resolutions.show`, resolution.id)}
                                                className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-blue-300 transition"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-900">{resolution.title}</h4>
                                                        <p className="text-xs text-gray-600 mt-1">{resolution.resolution_number}</p>
                                                    </div>
                                                    <span className={`ml-4 px-2 py-1 rounded text-xs font-medium ${resolution.status === 'passed' ? 'bg-green-100 text-green-800' :
                                                        resolution.status === 'voting' ? 'bg-blue-100 text-blue-800' :
                                                            resolution.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {resolution.status}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No resolutions yet</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Stats */}
                        <div className="space-y-6">
                            {/* Quorum Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quorum Settings</h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-600">Quorum Required</span>
                                            <span className="text-sm font-medium text-gray-900">{committee.quorum_percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${committee.quorum_percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {quorumRequired} of {committee.active_members?.length || 0} members must be present
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-600">Voting Threshold</span>
                                            <span className="text-sm font-medium text-gray-900">{committee.voting_threshold}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${committee.voting_threshold}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Required for resolutions to pass
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Committee Statistics</h3>

                                <dl className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">Total Resolutions</dt>
                                        <dd className="text-sm font-semibold text-gray-900">{committee.resolutions?.length || 0}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">Active Members</dt>
                                        <dd className="text-sm font-semibold text-gray-900">{committee.active_members?.length || 0}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">Meetings Held</dt>
                                        <dd className="text-sm font-semibold text-gray-900">{committee.meetings?.length || 0}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Status Card */}
                            <div className={`rounded-lg shadow-sm border p-6 ${committee.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 ${committee.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className={`text-sm font-medium ${committee.is_active ? 'text-green-800' : 'text-gray-600'}`}>
                                            {committee.is_active ? 'Active Committee' : 'Inactive Committee'}
                                        </h3>
                                        <div className={`mt-1 text-xs ${committee.is_active ? 'text-green-700' : 'text-gray-500'}`}>
                                            {committee.is_active ? 'Can propose and vote on resolutions' : 'Cannot propose new resolutions'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Add Member to Committee</h3>
                                <button
                                    onClick={() => setShowAddMemberModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAddMember} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Member
                                    </label>
                                    <select
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="">Choose a member...</option>
                                        {availableMembers?.map((member) => {
                                            const isAlreadyInCommittee = committee.active_members?.some(m => m.member_id === member.id);
                                            return (
                                                <option
                                                    key={member.id}
                                                    value={member.id}
                                                    disabled={isAlreadyInCommittee}
                                                    style={isAlreadyInCommittee ? { color: '#9CA3AF', fontStyle: 'italic' } : {}}
                                                >
                                                    {member.name} - {member.membership_id} ({member.tehsil?.name})
                                                    {isAlreadyInCommittee ? ' ✓ Already added' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Committee Role
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                    >
                                        {roles.map((role) => {
                                            const isOccupied = occupiedRoles?.includes(role.value);
                                            return (
                                                <option
                                                    key={role.value}
                                                    value={role.value}
                                                    disabled={isOccupied && role.value !== 'member'}
                                                    style={isOccupied && role.value !== 'member' ? { color: '#9CA3AF', fontStyle: 'italic' } : {}}
                                                >
                                                    {role.label}
                                                    {isOccupied && role.value !== 'member' ? ' (Occupied)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Occupied roles are disabled. Multiple members can have the 'Member' role.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Add Member
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddMemberModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

