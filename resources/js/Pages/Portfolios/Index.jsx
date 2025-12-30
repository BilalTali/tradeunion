import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PortfoliosIndex({ portfolios, currentLevel, stats }) {
    const { auth } = usePage().props;
    const role = auth.user?.role || '';
    const canFilter = role === 'super_admin' || role.includes('state');
    const [level, setLevel] = useState(currentLevel);

    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        router.get(route('state.portfolios.index'), { level: newLevel }, { preserveState: true });
    };

    const typeLabels = {
        executive: { label: 'Executive', color: 'bg-blue-100 text-blue-800', icon: '👔' },
        administrative: { label: 'Administrative', color: 'bg-green-100 text-green-800', icon: '📋' },
        financial: { label: 'Financial', color: 'bg-yellow-100 text-yellow-800', icon: '💰' },
        legal: { label: 'Legal', color: 'bg-purple-100 text-purple-800', icon: '⚖️' },
        election_commission: { label: 'Election Commission', color: 'bg-red-100 text-red-800', icon: '🗳️' },
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Portfolio Management">
            <Head title="Portfolios" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">📊 Portfolio Master Data</h1>
                        <p className="mt-2 text-gray-600">
                            View all organizational portfolios. These are seeded master data and cannot be edited.
                        </p>
                    </div>

                    {/* Level Tabs (Only for State/Super Admin) */}
                    {canFilter && (
                        <div className="bg-white rounded-xl shadow-md p-1 mb-6 inline-flex">
                            {['Tehsil', 'district', 'state'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => handleLevelChange(l)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${level === l
                                        ? 'bg-red-600 text-white shadow'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {l.charAt(0).toUpperCase() + l.slice(1)} ({stats[l]})
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Portfolio Groups */}
                    <div className="space-y-8">
                        {Object.entries(portfolios).map(([type, items]) => (
                            <div key={type} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className={`px-6 py-4 ${typeLabels[type]?.color || 'bg-gray-100'}`}>
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <span>{typeLabels[type]?.icon}</span>
                                        {typeLabels[type]?.label || type}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {items.map((portfolio) => (
                                            <div
                                                key={portfolio.id}
                                                className="border rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {portfolio.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 font-mono">
                                                            {portfolio.code}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                        Rank: {portfolio.authority_rank}
                                                    </span>
                                                </div>
                                                {portfolio.description && (
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {portfolio.description}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex flex-wrap gap-1">
                                                    {portfolio.can_assign_portfolios && (
                                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                                            Can Assign
                                                        </span>
                                                    )}
                                                    {portfolio.can_conduct_elections && (
                                                        <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">
                                                            Can Conduct Elections
                                                        </span>
                                                    )}
                                                    {portfolio.is_financial_role && (
                                                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                                                            Financial
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {Object.keys(portfolios).length === 0 && (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <p className="text-gray-500">No portfolios found for this level.</p>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">About Portfolios</p>
                                <p className="mt-1">
                                    Portfolios are master data seeded into the system. Election Commission roles cannot be held
                                    simultaneously with Executive roles to ensure independence and neutrality.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

