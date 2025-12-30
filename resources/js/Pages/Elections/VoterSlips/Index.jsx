import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function VoterSlipsIndex({ election, voterSlips, totalSlips, usedSlips }) {
    const { auth } = usePage().props;

    const handleGenerate = () => {
        if (confirm('Generate voter slips for all eligible voters?')) {
            router.post(route('elections.voter-slips.generate', election.id), {}, {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Voter Slips - ${election.title}`} />

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
                                <h1 className="text-3xl font-bold text-gray-900">Voter Slips</h1>
                                <p className="mt-2 text-gray-600">{election.title}</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleGenerate}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Generate Slips
                                </button>
                                {totalSlips > 0 && (
                                    <a
                                        href={route('elections.voter-slips.download-all', election.id)}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Download All (PDF)
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                            <p className="text-3xl font-bold">{totalSlips}</p>
                            <p className="text-red-100">Total Slips</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                            <p className="text-3xl font-bold">{usedSlips}</p>
                            <p className="text-green-100">Used (Voted)</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                            <p className="text-3xl font-bold">{totalSlips - usedSlips}</p>
                            <p className="text-amber-100">Pending</p>
                        </div>
                    </div>

                    {/* Voter Slips Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Slip Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            tehsil
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Verification
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {voterSlips.data?.map((slip) => (
                                        <tr key={slip.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm font-medium text-gray-900">
                                                    {slip.slip_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm">
                                                        {slip.member?.name?.charAt(0)}
                                                    </div>
                                                    <span className="ml-3 text-sm text-gray-900">{slip.member?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {slip.member?.tehsil?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${slip.is_used ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {slip.is_used ? 'Voted' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                                                {slip.verification_code}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {(!voterSlips.data || voterSlips.data.length === 0) && (
                            <div className="p-12 text-center">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                <p className="text-gray-500">No voter slips generated yet.</p>
                                <p className="text-sm text-gray-400 mt-1">Click "Generate Slips" to create voter slips for eligible voters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

