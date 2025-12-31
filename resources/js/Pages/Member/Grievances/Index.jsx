import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, grievances }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">My Grievances</h2>
                    <Link
                        href={route('grievances.create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Submit New Grievance
                    </Link>
                </div>
            }
        >
            <Head title="My Grievances" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {grievances.data.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-12 text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-medium text-gray-900">No Grievances Found</h3>
                            <p className="text-gray-500 mt-2 mb-6">You haven't submitted any grievances yet.</p>
                            <Link
                                href={route('grievances.create')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Submit your first grievance &rarr;
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Grievance Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {grievances.data.map((grievance) => (
                                            <tr key={grievance.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="mb-1">
                                                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mr-2">
                                                            {grievance.ticket_id || `#${grievance.id}`}
                                                        </span>
                                                        <span className="font-bold text-gray-900">{grievance.subject}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed" title={grievance.message}>
                                                        {grievance.message}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap align-top pt-5">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        {grievance.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top pt-5">
                                                    {new Date(grievance.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap align-top pt-5">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${grievance.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                        grievance.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            grievance.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {grievance.status === 'in_progress' ? 'In Progress' :
                                                            grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top pt-5">
                                                    <Link
                                                        href={route('grievances.show', grievance.id)}
                                                        className="text-blue-600 hover:text-blue-900 font-semibold hover:underline"
                                                    >
                                                        Read More &rarr;
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {grievances.links && grievances.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex justify-center">
                                        {grievances.links.map((link, k) => (
                                            <Link
                                                key={k}
                                                href={link.url || '#'}
                                                className={`mx-1 px-3 py-1 rounded-md text-sm ${link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
