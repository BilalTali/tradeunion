import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ election, hasECPortfolio, userLevel }) {
    const { auth } = usePage().props;
    const role = auth.user.role;



    const getRolePrefix = () => {
        // If user has EC portfolio, use portfolio level + ec prefix
        if (hasECPortfolio && userLevel) {
            return `${userLevel}.ec`;
        }

        // Otherwise use role-based prefix
        if (role === 'super_admin') return 'state';
        if (role.includes('district') && !role.includes('member')) return 'district';
        if (role.includes('tehsil') && !role.includes('member')) return 'tehsil';
        return 'member';
    };

    const rolePrefix = getRolePrefix();

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { data, setData, put, processing, errors } = useForm({
        title: election.title,
        description: election.description || '',
        nomination_start: formatDateTimeLocal(election.nomination_start),
        nomination_end: formatDateTimeLocal(election.nomination_end),
        voting_start: formatDateTimeLocal(election.voting_start),
        voting_end: formatDateTimeLocal(election.voting_end),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use dynamic route prefix for update logic if needed, but resource usually uses 'elections.update'
        // However, if we are under 'tehsil.elections.update', we should use that.
        // Let's use the dynamic prefix to match the rest of the app standardization.
        put(route(`${rolePrefix}.elections.update`, election.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800">Edit Election</h2>
                        <p className="text-sm text-gray-600 mt-1">Update election details and timeline</p>
                    </div>
                    <Link
                        href={route(`${rolePrefix}.elections.show`, election.id)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Election
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${election.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-xl">
                        <form onSubmit={handleSubmit} className="p-8">

                            {/* Read-only Info */}
                            <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Immutable Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600 font-medium">Level:</span>
                                        <span className="ml-2 text-gray-900 capitalize">{election.level}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium">Type:</span>
                                        <span className="ml-2 text-gray-900 capitalize">{election.election_type.replace('_', ' ')}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        <span className="ml-2 text-gray-900 capitalize">{election.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Election Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="e.g., State President Election 2024"
                                    required
                                />
                                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Describe the election..."
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Timeline */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Timeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🗳 Nomination Start
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.nomination_start}
                                            onChange={(e) => setData('nomination_start', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        {errors.nomination_start && <p className="mt-2 text-sm text-red-600">{errors.nomination_start}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🗳 Nomination End
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.nomination_end}
                                            onChange={(e) => setData('nomination_end', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        {errors.nomination_end && <p className="mt-2 text-sm text-red-600">{errors.nomination_end}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ✅ Voting Start
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.voting_start}
                                            onChange={(e) => setData('voting_start', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        {errors.voting_start && <p className="mt-2 text-sm text-red-600">{errors.voting_start}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ✅ Voting End
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.voting_end}
                                            onChange={(e) => setData('voting_end', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            required
                                        />
                                        {errors.voting_end && <p className="mt-2 text-sm text-red-600">{errors.voting_end}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={route(`${rolePrefix}.elections.show`, election.id)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

