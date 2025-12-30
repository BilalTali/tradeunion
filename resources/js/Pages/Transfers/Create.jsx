import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function TransfersCreate({ members, levels }) {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const rolePrefix = getRolePrefix();

    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        to_level: '',
        reason: '',
    });

    const levelLabels = {
        member: 'Base Member',
        tehsil: 'tehsil Level',
        district: 'District Level',
        state: 'State/UT Level',
    };

    const selectedMember = members.find((m) => m.id == data.member_id);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${rolePrefix}.transfers.store`));
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Initiate Member Transfer">
            <Head title="New Transfer" />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route(`${rolePrefix}.transfers.index`)}
                            className="text-red-600 hover:text-red-800"
                        >
                            ← Back to Transfers
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔄 New Transfer Request</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Member Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Member <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.member_id}
                                    onChange={(e) => setData('member_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                >
                                    <option value="">Choose a member...</option>
                                    {members.map((member) => (
                                        <option
                                            key={member.id}
                                            value={member.id}
                                            disabled={member.has_active_transfer}
                                            className={member.has_active_transfer ? 'text-gray-400 italic' : ''}
                                        >
                                            {member.name} - {member.tehsil?.name} ({member.member_level || 'member'})
                                            {member.has_active_transfer && ` - Transfer ${member.active_transfer_status} ⏳`}
                                        </option>
                                    ))}
                                </select>
                                {errors.member_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.member_id}</p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    ℹ️ Members with pending, recommended, or approved transfers are disabled and shown in gray
                                </p>
                            </div>

                            {/* Current Level Info */}
                            {selectedMember && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Current Level:</span>{' '}
                                        {levelLabels[selectedMember.member_level || 'member']}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">tehsil:</span>{' '}
                                        {selectedMember.tehsil?.name}
                                    </p>
                                </div>
                            )}

                            {/* To Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transfer To Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.to_level}
                                    onChange={(e) => setData('to_level', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                >
                                    <option value="">Select target level...</option>
                                    {levels.map((level) => (
                                        <option
                                            key={level}
                                            value={level}
                                            disabled={selectedMember?.member_level === level}
                                        >
                                            {levelLabels[level]}
                                            {selectedMember?.member_level === level && ' (current)'}
                                        </option>
                                    ))}
                                </select>
                                {errors.to_level && (
                                    <p className="mt-1 text-sm text-red-600">{errors.to_level}</p>
                                )}
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Transfer <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    rows={4}
                                    placeholder="Explain why this transfer is being requested..."
                                    required
                                />
                                {errors.reason && (
                                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                                )}
                            </div>

                            {/* Warning */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium">Important</p>
                                        <p>Upon transfer completion, all portfolios at the old level will be automatically released.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('state.transfers.index')}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Transfer Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

