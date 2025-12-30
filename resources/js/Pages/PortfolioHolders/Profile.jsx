import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Profile({ position, member, portfolio }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role !== 'member';

    const getRolePrefix = () => {
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const prefix = getRolePrefix();

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('en-IN') : 'Not set';
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            relieved: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Portfolio Holder - ${member.name}`} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
                                <p className="text-lg text-gray-600 mt-1">{position.position_title}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusBadge(position.status)}`}>
                                    {position.status?.toUpperCase()}
                                </span>
                            </div>
                            {isAdmin && (
                                <Link
                                    href={route(`${prefix}.portfolio-holders.edit`, position.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                >
                                    Edit Authority Data
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                            <div className="space-y-3">
                                <InfoRow label="Member ID" value={member.membership_number || 'N/A'} />
                                <InfoRow label="Portfolio" value={portfolio.name} />
                                <InfoRow label="Level" value={position.level?.charAt(0).toUpperCase() + position.level?.slice(1)} />
                                <InfoRow label="Position Type" value={position.is_elected ? 'Elected' : 'Appointed'} />
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Details</h2>
                            <div className="space-y-3">
                                <InfoRow label="Order Number" value={position.appointment_order_number || 'Not set'} />
                                <InfoRow label="Appointment Date" value={formatDate(position.appointment_date)} />
                                <InfoRow label="Appointing Authority" value={position.appointing_authority || 'Not set'} />
                                <InfoRow label="Accepted At" value={formatDate(position.portfolio_accepted_at)} />
                            </div>
                        </div>

                        {/* Tenure  */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Tenure</h2>
                            <div className="space-y-3">
                                <InfoRow label="Start Date" value={formatDate(position.start_date)} />
                                <InfoRow label="End Date" value={formatDate(position.end_date) || 'Ongoing'} />
                                <InfoRow label="Current Position" value={position.is_current ? 'Yes' : 'No'} />
                            </div>
                        </div>

                        {/* Signature & Seal */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Signature & Seal</h2>
                            <div className="space-y-3">
                                <InfoRow
                                    label="Signature Status"
                                    value={position.signature_path ? '✅ Uploaded' : '❌ Not uploaded'}
                                />
                                {position.signature_path && (
                                    <>
                                        <InfoRow label="Valid From" value={formatDate(position.signature_valid_from)} />
                                        <InfoRow label="Valid To" value={formatDate(position.signature_valid_to)} />
                                    </>
                                )}
                                <InfoRow
                                    label="Official Seal"
                                    value={position.seal_image_path ? '✅ Uploaded' : '❌ Not uploaded'}
                                />
                                <InfoRow
                                    label="Digital Signature"
                                    value={position.digital_signature_enabled ? 'Enabled' : 'Disabled'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Admin Remarks (Admin Only) */}
                    {isAdmin && position.admin_remarks && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Remarks</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{position.admin_remarks}</p>
                        </div>
                    )}



                    {/* Back Button */}
                    <div className="mt-6">
                        <Link
                            href={route(`${prefix}.dashboard`)}
                            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper component for info rows
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className="text-sm text-gray-900 font-semibold">{value}</span>
        </div>
    );
}

