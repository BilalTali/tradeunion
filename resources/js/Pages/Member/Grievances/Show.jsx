import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, grievance }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Grievance #{grievance.ticket_id || grievance.id}
                    </h2>
                    <Link
                        href={route('grievances.index')}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        &larr; Back to List
                    </Link>
                </div>
            }
        >
            <Head title={`Grievance #${grievance.ticket_id || grievance.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">

                        {/* Status Banner */}
                        <div className="flex justify-between items-start mb-8 border-b pb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{grievance.subject}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
                                    <span>&bull;</span>
                                    <span>{grievance.category}</span>
                                    <span>&bull;</span>
                                    <span className="capitalize">{grievance.grievance_level} Level</span>
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${statusColors[grievance.status] || 'bg-gray-100'}`}>
                                {grievance.status.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Detailed Description</h4>
                                <div className="prose prose-sm max-w-none text-gray-800 bg-gray-50 p-4 rounded-lg">
                                    {grievance.message.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Incident Date</h4>
                                    <p className="text-gray-900 font-medium">
                                        {grievance.incident_date ? new Date(grievance.incident_date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>

                                {grievance.attachment_path && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Supporting Evidence</h4>
                                        <a
                                            href={`/storage/${grievance.attachment_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                        >
                                            <svg className="mr-2 -ml-1 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            View Attachment
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Response */}
                        {grievance.admin_response && (
                            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-blue-900 mb-4">Official Response</h4>
                                <div className="prose prose-blue max-w-none text-blue-800">
                                    {grievance.admin_response}
                                </div>
                                <div className="mt-4 pt-4 border-t border-blue-200 text-sm text-blue-600 flex justify-between items-center">
                                    <span>Responded by: {grievance.responder?.name || 'Admin'}</span>
                                    {grievance.updated_at && <span>{new Date(grievance.updated_at).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
