import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CommissionIndex({ election, commission, availableMembers }) {
    const { auth } = usePage().props;
    const [selectedMember, setSelectedMember] = useState('');
    const [role, setRole] = useState('member');

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!selectedMember) return;

        router.post(route('elections.commission.store', election.id), {
            member_id: selectedMember,
            role: role,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedMember('');
                setRole('member');
            }
        });
    };

    const handleRemove = (commissionId) => {
        if (confirm('Remove this member from the Election Commission?')) {
            router.delete(route('elections.commission.destroy', [election.id, commissionId]), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Election Commission - ${election.title}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('elections.show', election.id)}
                            className="text-red-600 hover:text-red-800 mb-4 inline-block"
                        >
                            ← Back to Election
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Election Commission</h1>
                        <p className="mt-2 text-gray-600">{election.title}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Current Commission Members */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Commission Members</h2>
                            {commission.length > 0 ? (
                                <div className="space-y-3">
                                    {commission.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${member.role === 'chief' ? 'bg-red-600' : 'bg-amber-500'}`}>
                                                    {member.member?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{member.member?.name}</p>
                                                    <p className="text-sm text-gray-500 capitalize">{member.role === 'chief' ? '👑 Chief Commissioner' : 'Member'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(member.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No commission members yet</p>
                            )}
                        </div>

                        {/* Add Member Form */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Add Commission Member</h2>
                            <form onSubmit={handleAddMember} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                                    <select
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">Choose a member...</option>
                                        {availableMembers.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name} - {member.tehsil?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="member">Member</option>
                                        <option value="chief">Chief Commissioner</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Add to Commission
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">About the Election Commission</p>
                                <p className="mt-1">Commission members are responsible for approving or rejecting candidate nominations. The Chief Commissioner has final authority.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

