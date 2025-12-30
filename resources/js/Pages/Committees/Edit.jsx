import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';

export default function Edit({ committee, committeeTypes, levels }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const getRolePrefix = () => {
        if (userRole === 'super_admin' || userRole.includes('state')) return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const { data, setData, put, processing, errors } = useForm({
        name: committee.name || '',
        type: committee.type || 'executive',
        min_members: committee.min_members || 5,
        max_members: committee.max_members || 15,
        quorum_percentage: committee.quorum_percentage || 50,
        voting_threshold: committee.voting_threshold || 66.67,
        start_date: committee.start_date || '',
        end_date: committee.end_date || '',
        is_active: committee.is_active ?? true,
        description: committee.description || '',
        constitutional_basis: committee.constitutional_basis || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route(`${rolePrefix}.committees.update`, committee.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this committee? This action cannot be undone.')) {
            router.delete(route(`${rolePrefix}.committees.destroy`, committee.id));
        }
    };

    const typeDescriptions = {
        executive: 'Main decision-making body for general administration',
        election_commission: 'Manages and oversees all electoral processes',
        disciplinary: 'Handles member discipline and code violations',
        finance: 'Manages budget, expenditures, and financial planning',
        audit: 'Reviews financial reports and compliance',
        custom: 'Special-purpose committee with defined objectives',
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${committee.name}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route(`${rolePrefix}.committees.show`, committee.id)}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Committee
                        </Link>

                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Edit Committee</h1>
                                <p className="mt-2 text-sm text-gray-600">{committee.name}</p>
                            </div>

                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Committee
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                            {/* Active Status Toggle */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="text-sm font-medium text-gray-900">Committee Status</span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {data.is_active
                                                ? 'Active committees can propose and vote on resolutions'
                                                : 'Inactive committees cannot propose new resolutions'}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-600"></div>
                                    </div>
                                </label>
                            </div>

                            {/* Committee Type */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Committee Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(committeeTypes).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('type', value)}
                                            className={`p-4 border-2 rounded-lg text-left transition-all ${data.type === value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-medium text-gray-900">{label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{typeDescriptions[value]}</div>
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            {/* Committee Name */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Committee Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="e.g., State Executive Committee"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Level (Read-only) */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Level
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 capitalize">
                                    {committee.level} Level
                                    <p className="text-xs text-gray-500 mt-1">Committee level cannot be changed after creation</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Brief description of the committee's purpose and responsibilities..."
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Constitutional Basis */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Constitutional Basis
                                </label>
                                <input
                                    type="text"
                                    value={data.constitutional_basis}
                                    onChange={(e) => setData('constitutional_basis', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="e.g., As per Constitution Article 5.2, Section 3"
                                />
                                {errors.constitutional_basis && <p className="mt-2 text-sm text-red-600">{errors.constitutional_basis}</p>}
                            </div>

                            {/* Member Limits */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Size</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum Members <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.min_members}
                                            onChange={(e) => setData('min_members', parseInt(e.target.value))}
                                            min="3"
                                            max="50"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Must be at least 3</p>
                                        {errors.min_members && <p className="mt-2 text-sm text-red-600">{errors.min_members}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Maximum Members <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.max_members}
                                            onChange={(e) => setData('max_members', parseInt(e.target.value))}
                                            min="3"
                                            max="50"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Maximum 50 members</p>
                                        {errors.max_members && <p className="mt-2 text-sm text-red-600">{errors.max_members}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Voting Rules */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Rules</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quorum Percentage <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.quorum_percentage}
                                                onChange={(e) => setData('quorum_percentage', parseFloat(e.target.value))}
                                                min="30"
                                                max="100"
                                                step="0.01"
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Minimum members required for meetings (30-100%)</p>
                                        {errors.quorum_percentage && <p className="mt-2 text-sm text-red-600">{errors.quorum_percentage}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Voting Threshold <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.voting_threshold}
                                                onChange={(e) => setData('voting_threshold', parseFloat(e.target.value))}
                                                min="50"
                                                max="100"
                                                step="0.01"
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Votes required to pass resolutions (50-100%)</p>
                                        {errors.voting_threshold && <p className="mt-2 text-sm text-red-600">{errors.voting_threshold}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-900">
                                        <strong>Example:</strong> With {committee.active_members?.length || 10} current members, {data.quorum_percentage}% quorum = {Math.ceil((committee.active_members?.length || 10) * data.quorum_percentage / 100)} members required.
                                        If quorum met, {data.voting_threshold}% threshold = {Math.ceil((committee.active_members?.length || 10) * data.voting_threshold / 100)} votes needed to pass.
                                    </p>
                                </div>
                            </div>

                            {/* Tenure */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Tenure</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        {errors.start_date && <p className="mt-2 text-sm text-red-600">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Leave blank for indefinite tenure</p>
                                        {errors.end_date && <p className="mt-2 text-sm text-red-600">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={route(`${rolePrefix}.committees.show`, committee.id)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
                                >
                                    {processing ? 'Updating...' : 'Update Committee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

