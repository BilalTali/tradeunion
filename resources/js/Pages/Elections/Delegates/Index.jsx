import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function DelegatesIndex({ election, delegates }) {
    const { auth } = usePage().props;

    const handlePopulate = () => {
        if (confirm('Auto-populate delegates (Tehsil Presidents, District Presidents, Portfolio Holders)?')) {
            router.post(route('elections.delegates.populate', election.id), {}, {
                preserveScroll: true
            });
        }
    };

    const handleRemove = (delegateId) => {
        if (confirm('Remove this delegate?')) {
            router.delete(route('elections.delegates.destroy', [election.id, delegateId]), {
                preserveScroll: true
            });
        }
    };

    const getDelegateTypeBadge = (type) => {
        const badges = {
            zonal_president: 'bg-red-100 text-red-800',
            district_president: 'bg-purple-100 text-purple-800',
            portfolio_holder: 'bg-blue-100 text-blue-800',
            zone_nominated: 'bg-amber-100 text-amber-800',
            district_nominated: 'bg-green-100 text-green-800',
        };
        return badges[type] || 'bg-gray-100 text-gray-800';
    };

    const formatDelegateType = (type) => {
        return type?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Delegates - ${election.title}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('elections.show', election.id)}
                            className="text-red-600 hover:text-red-800 mb-4 inline-block"
                        >
                            ← Back to Election
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Election Delegates</h1>
                                <p className="mt-2 text-gray-600">{election.title}</p>
                            </div>
                            <button
                                onClick={handlePopulate}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Auto-Populate Delegates
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">Delegate Types for {election.election_type?.replace('_', ' ')}</p>
                                <p className="mt-1">
                                    {election.election_type === 'district_president' && 'Tehsil Presidents and tehsil-nominated members can vote in this election.'}
                                    {election.election_type === 'state_president' && 'Tehsil Presidents, District Presidents, and Portfolio Holders can vote in this election.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delegates by Type */}
                    {Object.keys(delegates).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(delegates).map(([type, typeDelegates]) => (
                                <div key={type} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">{formatDelegateType(type)}</h2>
                                            <p className="text-sm text-gray-500">{typeDelegates.length} delegates</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDelegateTypeBadge(type)}`}>
                                            {formatDelegateType(type)}
                                        </span>
                                    </div>
                                    <div className="divide-y">
                                        {typeDelegates.map((delegate) => (
                                            <div key={delegate.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {delegate.member?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{delegate.member?.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {delegate.member?.tehsil?.name}, {delegate.member?.tehsil?.district?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(delegate.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-500">No delegates added yet.</p>
                            <p className="text-sm text-gray-400 mt-1">Click "Auto-Populate Delegates" to add eligible delegates automatically.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

