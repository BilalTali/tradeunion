import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Create({ committeeTypes, levels }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const getRolePrefix = () => {
        if (userRole === 'super_admin' || userRole.includes('state')) return 'state';
        if (userRole.includes('district')) return 'district';
        if (userRole.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const rolePrefix = getRolePrefix();

    const getInitialEntityId = () => {
        const user = auth.user;
        if (rolePrefix === 'tehsil') return user.tehsil_id || user.member?.tehsil_id;
        if (rolePrefix === 'district') return user.district_id || user.member?.district_id;
        return 1; // Default for state
    };

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'executive',
        level: Object.keys(levels)[0] || 'state',
        entity_id: getInitialEntityId(),
        min_members: 5,
        max_members: 15,
        quorum_percentage: 50,
        voting_threshold: 66.67,
        start_date: '',
        end_date: '',
        description: '',
        constitutional_basis: '',
    });

    // Update entity_id if level changes (though level is mostly tied to role)
    useEffect(() => {
        const user = auth.user;
        let newEntityId = 1;

        if (rolePrefix === 'tehsil') {
            newEntityId = user.tehsil_id || user.member?.tehsil_id;
        } else if (rolePrefix === 'district') {
            newEntityId = user.district_id || user.member?.district_id;
        }

        if (data.entity_id !== newEntityId) {
            setData('entity_id', newEntityId);
        }
    }, [rolePrefix, auth.user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${rolePrefix}.committees.store`));
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
            <Head title="Create Committee" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route(`${rolePrefix}.committees.index`)}
                            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Committees
                        </Link>

                        <div>
                            <h1 className="text-3xl font-extrabold text-indigo-900">Create Committee</h1>
                            <p className="mt-2 text-sm text-gray-800 font-medium">
                                Establish a new constitutional body for collective decision-making
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-indigo-800 flex items-center">
                                <span className="mr-2">📝</span> Committee Details
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                            {/* Committee Type */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Committee Type <span className="text-red-600">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(committeeTypes).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('type', value)}
                                            className={`p-4 border-2 rounded-lg text-left transition-all shadow-sm ${data.type === value
                                                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                                                : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`font-bold ${data.type === value ? 'text-indigo-900' : 'text-gray-900'}`}>{label}</div>
                                            <div className="text-xs text-gray-600 mt-1 font-medium">{typeDescriptions[value]}</div>
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p className="mt-2 text-sm text-red-600 font-bold">{errors.type}</p>}
                            </div>

                            {/* Committee Name */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Committee Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white placeholder-gray-500 font-medium"
                                    placeholder="e.g., State Executive Committee"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600 font-bold">{errors.name}</p>}
                            </div>

                            {/* Level Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Level <span className="text-red-600">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(levels).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('level', value)}
                                            className={`p-3 border-2 rounded-lg font-bold capitalize transition-all shadow-sm ${data.level === value
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                                                : 'border-gray-300 bg-white hover:border-indigo-300 text-gray-800 hover:bg-gray-50'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                {errors.level && <p className="mt-2 text-sm text-red-600 font-bold">{errors.level}</p>}
                            </div>

                            {/* Entity ID (hidden, will be dynamic based on level in future) */}
                            <input type="hidden" value={data.entity_id} />

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white placeholder-gray-500 font-medium"
                                    placeholder="Brief description of the committee's purpose and responsibilities..."
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600 font-bold">{errors.description}</p>}
                            </div>

                            {/* Constitutional Basis */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Constitutional Basis
                                </label>
                                <input
                                    type="text"
                                    value={data.constitutional_basis}
                                    onChange={(e) => setData('constitutional_basis', e.target.value)}
                                    className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white placeholder-gray-500 font-medium"
                                    placeholder="e.g., As per Constitution Article 5.2, Section 3"
                                />
                                {errors.constitutional_basis && <p className="mt-2 text-sm text-red-600 font-bold">{errors.constitutional_basis}</p>}
                            </div>

                            {/* Member Limits */}
                            <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                    <span className="mr-2">👥</span> Committee Size
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Minimum Members <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.min_members}
                                            onChange={(e) => setData('min_members', parseInt(e.target.value))}
                                            min="3"
                                            max="50"
                                            className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white font-medium"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-600 font-medium">Must be at least 3</p>
                                        {errors.min_members && <p className="mt-2 text-sm text-red-600 font-bold">{errors.min_members}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Maximum Members <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.max_members}
                                            onChange={(e) => setData('max_members', parseInt(e.target.value))}
                                            min="3"
                                            max="50"
                                            className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white font-medium"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-600 font-medium">Maximum 50 members</p>
                                        {errors.max_members && <p className="mt-2 text-sm text-red-600 font-bold">{errors.max_members}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Voting Rules */}
                            <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                    <span className="mr-2">🗳️</span> Voting Rules
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Quorum Percentage <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.quorum_percentage}
                                                onChange={(e) => setData('quorum_percentage', parseFloat(e.target.value))}
                                                min="30"
                                                max="100"
                                                step="0.01"
                                                className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white font-medium"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold">%</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-600 font-medium">Minimum members required for meetings (30-100%)</p>
                                        {errors.quorum_percentage && <p className="mt-2 text-sm text-red-600 font-bold">{errors.quorum_percentage}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Voting Threshold <span className="text-red-600">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.voting_threshold}
                                                onChange={(e) => setData('voting_threshold', parseFloat(e.target.value))}
                                                min="50"
                                                max="100"
                                                step="0.01"
                                                className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white font-medium"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold">%</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-600 font-medium">Votes required to pass resolutions (50-100%)</p>
                                        {errors.voting_threshold && <p className="mt-2 text-sm text-red-600 font-bold">{errors.voting_threshold}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-indigo-100 border border-indigo-200 rounded-lg">
                                    <p className="text-sm text-indigo-900">
                                        <strong>Example:</strong> With 10 members, {data.quorum_percentage}% quorum = {Math.ceil(10 * data.quorum_percentage / 100)} members required.
                                        If quorum met, {data.voting_threshold}% threshold = {Math.ceil(10 * data.voting_threshold / 100)} votes needed to pass.
                                    </p>
                                </div>
                            </div>

                            {/* Tenure */}
                            <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                    <span className="mr-2">📅</span> Committee Tenure
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Start Date <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white font-medium"
                                            required
                                        />
                                        {errors.start_date && <p className="mt-2 text-sm text-red-600 font-bold">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full border-gray-400 rounded-lg shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 text-black bg-white font-medium"
                                        />
                                        <p className="mt-1 text-xs text-gray-600 font-medium">Leave blank for indefinite tenure</p>
                                        {errors.end_date && <p className="mt-2 text-sm text-red-600 font-bold">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    href={route(`${rolePrefix}.committees.index`)}
                                    className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-bold"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 transition-all font-bold shadow-lg transform hover:scale-105"
                                >
                                    {processing ? 'Creating...' : 'Create Committee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

