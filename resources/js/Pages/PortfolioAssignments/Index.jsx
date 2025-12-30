import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function PortfolioAssignmentsIndex({ assignments, portfolios, level }) {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const rolePrefix = getRolePrefix();

    const typeColors = {
        executive: 'bg-blue-100 text-blue-800',
        administrative: 'bg-green-100 text-green-800',
        financial: 'bg-yellow-100 text-yellow-800',
        legal: 'bg-purple-100 text-purple-800',
        election_commission: 'bg-red-100 text-red-800',
    };

    const handleRemove = (id) => {
        if (confirm('Are you sure you want to remove this portfolio assignment?')) {
            router.delete(route(`${rolePrefix}.portfolio-assignments.destroy`, id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Portfolio Assignments">
            <Head title="Portfolio Assignments" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                👔 {level.charAt(0).toUpperCase() + level.slice(1)} Portfolio Assignments
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Manage portfolio assignments for {level} level members.
                            </p>
                        </div>
                        <Link
                            href={route(`${rolePrefix}.portfolio-assignments.create`)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                        >
                            + Assign Portfolio
                        </Link>
                    </div>

                    {/* Current Assignments */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-gray-50 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Current Assignments</h2>
                        </div>
                        {assignments.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portfolio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {assignments.map((assignment) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{assignment.portfolio?.name || assignment.position_title}</div>
                                                <div className="text-sm text-gray-500 font-mono">{assignment.portfolio?.code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{assignment.member?.name}</div>
                                                <div className="text-sm text-gray-500">{assignment.member?.membership_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${typeColors[assignment.portfolio?.type] || 'bg-gray-100'}`}>
                                                    {assignment.portfolio?.type?.replace('_', ' ') || 'Custom'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {assignment.start_date ? new Date(assignment.start_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleRemove(assignment.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-gray-500">No portfolio assignments yet.</p>
                                <Link
                                    href={route(`${rolePrefix}.portfolio-assignments.create`)}
                                    className="mt-4 inline-block text-red-600 hover:text-red-800"
                                >
                                    Assign your first portfolio →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Available Portfolios */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Available Portfolios at {level.charAt(0).toUpperCase() + level.slice(1)} Level</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {portfolios.map((portfolio) => {
                                    const isAssigned = assignments.some(a => a.portfolio_id === portfolio.id);
                                    return (
                                        <div
                                            key={portfolio.id}
                                            className={`border rounded-lg p-4 ${isAssigned ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
                                                    <p className="text-sm text-gray-500 font-mono">{portfolio.code}</p>
                                                </div>
                                                {isAssigned && (
                                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                                                        ✓ Assigned
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${typeColors[portfolio.type]}`}>
                                                {portfolio.type?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

