import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function PortfolioAssignmentsCreate({ portfolios, members, level, assignedPortfolioIds, preselectedMemberId, preselectedPositionTitle }) {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const rolePrefix = getRolePrefix();

    // Auto-select portfolio if title matches
    const matchingPortfolio = preselectedPositionTitle
        ? portfolios.find(p => p.name.toLowerCase() === preselectedPositionTitle.toLowerCase())
        : null;

    const { data, setData, post, processing, errors } = useForm({
        member_id: preselectedMemberId || '',
        portfolio_id: matchingPortfolio ? matchingPortfolio.id : '',
    });

    const typeColors = {
        executive: 'bg-blue-100 text-blue-800',
        administrative: 'bg-green-100 text-green-800',
        financial: 'bg-yellow-100 text-yellow-800',
        legal: 'bg-purple-100 text-purple-800',
        election_commission: 'bg-red-100 text-red-800',
    };

    const selectedPortfolio = portfolios.find(p => p.id == data.portfolio_id);
    const selectedMember = members.find(m => m.id == data.member_id);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${rolePrefix}.portfolio-assignments.store`));
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Assign Portfolio">
            <Head title="Assign Portfolio" />

            <div className="py-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route(`${rolePrefix}.portfolio-assignments.index`)}
                            className="text-red-600 hover:text-red-800"
                        >
                            ← Back to Assignments
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            👔 Assign {level.charAt(0).toUpperCase() + level.slice(1)} Portfolio
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Portfolio Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Portfolio <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.portfolio_id}
                                    onChange={(e) => setData('portfolio_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    required
                                >
                                    <option value="">Choose a portfolio...</option>
                                    {portfolios.map((portfolio) => {
                                        const isAssigned = assignedPortfolioIds.includes(portfolio.id);
                                        return (
                                            <option
                                                key={portfolio.id}
                                                value={portfolio.id}
                                                disabled={isAssigned}
                                            >
                                                {portfolio.name} ({portfolio.type?.replace('_', ' ')})
                                                {isAssigned && ' - Already Assigned'}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.portfolio_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.portfolio_id}</p>
                                )}
                            </div>

                            {/* Portfolio Info */}
                            {selectedPortfolio && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{selectedPortfolio.name}</h4>
                                            <p className="text-sm text-gray-500">{selectedPortfolio.description}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${typeColors[selectedPortfolio.type]}`}>
                                            {selectedPortfolio.type?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {selectedPortfolio.type === 'election_commission' && (
                                        <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                                            ⚠️ Election Commission role - Cannot be assigned to members with executive positions
                                        </div>
                                    )}
                                </div>
                            )}

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
                                        <option key={member.id} value={member.id}>
                                            {member.name} - {member.tehsil?.name || 'No tehsil'} ({member.membership_id})
                                        </option>
                                    ))}
                                </select>
                                {errors.member_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.member_id}</p>
                                )}
                            </div>

                            {/* Member Info */}
                            {selectedMember && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="font-semibold text-gray-900">{selectedMember.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {selectedMember.tehsil?.district?.name} → {selectedMember.tehsil?.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Membership ID: {selectedMember.membership_id}
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex justify-end gap-4 pt-4">
                                <Link
                                    href={route(`${rolePrefix}.portfolio-assignments.index`)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Assigning...' : 'Assign Portfolio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

