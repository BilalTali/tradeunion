import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';

export default function Edit({ position, member, portfolio }) {
    const { auth, errors: serverErrors } = usePage().props;

    const getRolePrefix = () => {
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const prefix = getRolePrefix();

    const { data, setData, put, processing, errors } = useForm({
        appointment_order_number: position.appointment_order_number || '',
        appointment_date: position.appointment_date || '',
        appointing_authority: position.appointing_authority || '',
        status: position.status || 'active',
        signature_valid_from: position.signature_valid_from || '',
        signature_valid_to: position.signature_valid_to || '',
        portfolio_accepted_at: position.portfolio_accepted_at || '',
        admin_remarks: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route(`${prefix}.portfolio-holders.update`, position.id));
    };

    const hasUploads = position.signature_path && position.seal_image_path;

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Authority Data - ${member.name}`} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
                        <p className="text-lg text-gray-600 mt-1">{position.position_title}</p>
                        <p className="text-sm text-gray-500 mt-2">Portfolio: {portfolio.name}</p>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Warning:</strong> Changes to authority data are logged and require mandatory remarks for audit purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Signature Upload - Separate Form (Moved to Top) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Signature Specimen Upload</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Signature */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Signature</h3>
                                {position.signature_path ? (
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg inline-block">
                                        <div className="bg-white border rounded p-2">
                                            <img
                                                src={route(`${prefix}.portfolio-holders.image`, [position.id, 'signature']) + `?t=${new Date(position.updated_at).getTime()}`}
                                                alt="Current Signature"
                                                className="h-[80px] w-[300px] object-contain"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Last Updated: {new Date(position.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="h-[100px] w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                                        No signature uploaded
                                    </div>
                                )}
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                router.post(route(`${prefix}.portfolio-holders.signature`, position.id), formData, {
                                    forceFormData: true,
                                    onSuccess: () => {
                                        // Inertia handles reload, cache-buster relies on updated_at
                                    }
                                });
                            }}
                            encType="multipart/form-data"
                            className="mt-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Signature Image <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="signature"
                                        accept="image/*"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    document.getElementById('signature-preview').src = e.target.result;
                                                    document.getElementById('signature-preview-container').style.display = 'block';
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">size: 300x80px (recommended)</p>

                                    {/* Client-side Preview */}
                                    <div id="signature-preview-container" className="mt-2 hidden">
                                        <p className="text-xs font-semibold text-blue-600 mb-1">New Selection Preview:</p>
                                        <img id="signature-preview" className="h-[80px] w-auto border border-blue-300 rounded bg-white" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid From <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        required
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid To <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_to"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin Remarks <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="admin_remarks"
                                        rows={2}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Reason for signature upload..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Upload Signature
                            </button>
                        </form>
                    </div>

                    {/* Seal Upload - Separate Form (Moved to Second) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Official Seal Upload</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Seal */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Seal</h3>
                                {position.seal_image_path ? (
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg inline-block">
                                        <div className="bg-white border rounded p-2">
                                            <img
                                                src={route(`${prefix}.portfolio-holders.image`, [position.id, 'seal']) + `?t=${new Date(position.updated_at).getTime()}`}
                                                alt="Current Seal"
                                                className="h-[150px] w-[150px] object-contain"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[150px] w-[150px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                                        No seal uploaded
                                    </div>
                                )}
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                router.post(route(`${prefix}.portfolio-holders.seal`, position.id), formData, { forceFormData: true });
                            }}
                            encType="multipart/form-data"
                            className="mt-6"
                        >
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Seal Image <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="seal"
                                        accept="image/*"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    document.getElementById('seal-preview').src = e.target.result;
                                                    document.getElementById('seal-preview-container').style.display = 'block';
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">High Resolution (1000x1000px)</p>

                                    {/* Client-side Preview */}
                                    <div id="seal-preview-container" className="mt-2 hidden">
                                        <p className="text-xs font-semibold text-green-600 mb-1">New Selection Preview:</p>
                                        <img id="seal-preview" className="h-[150px] w-auto border border-green-300 rounded bg-white" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin Remarks <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="admin_remarks"
                                        rows={2}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Reason for seal upload..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                            >
                                Upload Seal
                            </button>
                        </form>
                    </div>

                    {/* Main Form for Basic Details (Moved to Bottom) */}
                    <form onSubmit={handleSubmit} className="space-y-6 mb-6">
                        {/* Appointment Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Appointment Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Appointment Order Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.appointment_order_number}
                                        onChange={e => setData('appointment_order_number', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., ORD/2024/001"
                                    />
                                    {errors.appointment_order_number && (
                                        <p className="text-red-600 text-sm mt-1">{errors.appointment_order_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Appointment Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.appointment_date}
                                        onChange={e => setData('appointment_date', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.appointment_date && (
                                        <p className="text-red-600 text-sm mt-1">{errors.appointment_date}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Appointing Authority
                                    </label>
                                    <input
                                        type="text"
                                        value={data.appointing_authority}
                                        onChange={e => setData('appointing_authority', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., State Secretary"
                                    />
                                    {errors.appointing_authority && (
                                        <p className="text-red-600 text-sm mt-1">{errors.appointing_authority}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Portfolio Accepted Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.portfolio_accepted_at}
                                        onChange={e => setData('portfolio_accepted_at', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="relieved">Relieved</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-red-600 text-sm mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mandatory Admin Remarks */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Admin Remarks <span className="text-red-500">*</span>
                            </h2>
                            <p className="text-sm text-gray-600 mb-3">
                                Provide a detailed reason for these changes (minimum 10 characters). This will be logged for audit.
                            </p>
                            <textarea
                                value={data.admin_remarks}
                                onChange={e => setData('admin_remarks', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Explain the reason for these changes..."
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {data.admin_remarks.length} / 10 minimum characters
                            </p>
                            {errors.admin_remarks && (
                                <p className="text-red-600 text-sm mt-1">{errors.admin_remarks}</p>
                            )}
                        </div>

                        {/* Validation Error Message */}
                        {!hasUploads && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            <strong>Incomplete Profile:</strong> You must upload both a Signature and an Official Seal before you can save these details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing || data.admin_remarks.length < 10 || !hasUploads}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link
                                href={route(`${prefix}.portfolio-holders.show`, position.id)}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

