import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ grievances }) {
    const { auth } = usePage().props;
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        admin_response: '',
        status: 'pending'
    });

    const openReplyModal = (grievance) => {
        setSelectedGrievance(grievance);
        setData({
            admin_response: grievance.admin_response || '',
            status: grievance.status || 'pending'
        });
        setShowReplyModal(true);
    };

    const closeReplyModal = () => {
        setShowReplyModal(false);
        setSelectedGrievance(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('state.grievances.update', selectedGrievance.id), {
            preserveScroll: true,
            onSuccess: () => closeReplyModal()
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this grievance?')) {
            router.delete(route('state.grievances.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800">Manage Grievances</h2>
                    <p className="text-sm text-gray-600 mt-1">Review and manage member grievances and complaints.</p>
                </div>
            }
        >
            <Head title="Manage Grievances" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {grievances.data.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-gray-500">No grievances submitted yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {grievances.data.map((grievance) => (
                                <div key={grievance.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${getStatusColor(grievance.status).replace('bg-', 'border-').replace('100', '500').split(' ')[0]}`}>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                                                    {grievance.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{grievance.user.name}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(grievance.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(grievance.status)}`}>
                                                {grievance.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded mr-2 uppercase tracking-wide">{grievance.category}</span>
                                            <span className="font-bold text-lg text-gray-800">{grievance.subject}</span>
                                        </div>

                                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-900 whitespace-pre-wrap">{grievance.message}</p>
                                        </div>

                                        {grievance.admin_response && (
                                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                                <p className="text-sm font-medium text-blue-700 mb-1">
                                                    Admin Response {grievance.responder && `(by ${grievance.responder.name})`}:
                                                </p>
                                                <p className="text-gray-900 whitespace-pre-wrap">{grievance.admin_response}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openReplyModal(grievance)}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                {grievance.admin_response ? 'Update Status/Response' : 'Process Grievance'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(grievance.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-all flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {grievances.links.length > 3 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {grievances.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedGrievance && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Process Grievance</h3>
                            <div className="mt-1 flex gap-2 text-sm text-gray-600">
                                <span>From: {selectedGrievance.user.name}</span>
                                <span>•</span>
                                <span>Category: {selectedGrievance.category}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-1">{selectedGrievance.subject}</h4>
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedGrievance.message}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Response / Resolution Note
                                </label>
                                <textarea
                                    value={data.admin_response}
                                    onChange={e => setData('admin_response', e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your response, resolution details, or reason for rejection..."
                                />
                                {errors.admin_response && (
                                    <p className="mt-1 text-sm text-red-600">{errors.admin_response}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Update Grievance'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeReplyModal}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
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
