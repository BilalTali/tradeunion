import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function TransfersIndex({ transfers, currentStatus, stats }) {
    const { auth } = usePage().props;
    const [status, setStatus] = useState(currentStatus);
    const role = auth.user.role;

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const rolePrefix = getRolePrefix();

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        router.get(route(`${rolePrefix}.transfers.index`), { status: newStatus }, { preserveState: true });
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        recommended: 'bg-blue-100 text-blue-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        completed: 'bg-gray-100 text-gray-800',
    };

    const levelLabels = {
        member: 'Member',
        tehsil: 'Tehsil',
        district: 'District',
        state: 'State',
    };

    const handleAction = (transferId, action) => {
        if (action === 'reject') {
            const reason = prompt('Enter rejection reason:');
            if (!reason) return;
            router.post(route(`${rolePrefix}.transfers.${action}`, transferId), { rejection_reason: reason });
        } else {
            router.post(route(`${rolePrefix}.transfers.${action}`, transferId));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Member Transfers">
            <Head title="Member Transfers" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">🔄 Member Transfers</h1>
                            <p className="mt-2 text-gray-600">
                                Manage member level transfers with approval workflow.
                            </p>
                        </div>
                        <Link
                            href={route(`${rolePrefix}.transfers.create`)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                        >
                            + New Transfer
                        </Link>
                    </div>

                    {/* Status Tabs */}
                    <div className="bg-white rounded-xl shadow-md p-1 mb-6 flex flex-wrap gap-1">
                        {['pending', 'recommended', 'approved', 'completed', 'all'].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleStatusChange(s)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${status === s
                                    ? 'bg-red-600 text-white shadow'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                {s !== 'all' && stats[s] !== undefined && ` (${stats[s]})`}
                            </button>
                        ))}
                    </div>

                    {/* Transfers List */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {transfers.data?.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transfers.data.map((transfer) => (
                                        <tr key={transfer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{transfer.member?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {levelLabels[transfer.from_level]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {levelLabels[transfer.to_level]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[transfer.status]}`}>
                                                    {transfer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transfer.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {transfer.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(transfer.id, 'recommend')}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Recommend
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(transfer.id, 'approve')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(transfer.id, 'reject')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {transfer.status === 'recommended' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(transfer.id, 'approve')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(transfer.id, 'reject')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {transfer.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleAction(transfer.id, 'complete')}
                                                        className="text-green-600 hover:text-green-900 font-semibold"
                                                    >
                                                        Complete ✓
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-gray-500">No transfers found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

