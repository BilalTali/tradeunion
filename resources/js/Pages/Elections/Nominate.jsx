import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Nominate({ election }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        position_title: election.election_type === 'zonal_president' ? 'President' :
            election.election_type === 'district_president' ? 'President' : 'President',
        vision_statement: '',
        qualifications: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('elections.nominate', election.id));
    };

    // Check if nominations are open
    const isNominationsOpen = election.status === 'nominations_open';
    // Check if nominations are open (Source of Truth: Backend Status)
    // const isNominationsOpen = election.status === 'nominations_open'; // Already declared above

    if (!isNominationsOpen) {
        return (
            <AuthenticatedLayout>
                <Head title="File Nomination" />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                        <h2 className="text-xl font-bold text-yellow-800 mb-2">Nominations Not Open</h2>
                        <p className="text-yellow-700">
                            Nomination period: {new Date(election.nomination_start).toLocaleString()} - {new Date(election.nomination_end).toLocaleString()}
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="File Nomination" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">File Nomination</h1>
                        <p className="text-gray-600">
                            {election.title} - {election.level.charAt(0).toUpperCase() + election.level.slice(1)} Level
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Nomination deadline: {new Date(election.nomination_end).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="space-y-6">
                            {/* Position Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    value={data.position_title}
                                    onChange={(e) => setData('position_title', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.position_title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.position_title}</p>
                                )}
                            </div>

                            {/* Vision Statement */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Vision Statement <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Describe your vision and plans if elected (minimum 50 characters)
                                </p>
                                <textarea
                                    value={data.vision_statement}
                                    onChange={(e) => setData('vision_statement', e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Share your vision for the union, key priorities, and how you plan to serve members..."
                                    required
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.vision_statement && (
                                        <p className="text-sm text-red-600">{errors.vision_statement}</p>
                                    )}
                                    <p className="text-xs text-gray-500 ml-auto">
                                        {data.vision_statement.length} / 50 minimum
                                    </p>
                                </div>
                            </div>

                            {/* Qualifications */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Qualifications & Experience
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    List your relevant qualifications, experience, and achievements (optional)
                                </p>
                                <textarea
                                    value={data.qualifications}
                                    onChange={(e) => setData('qualifications', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Education, years of service, previous positions, contributions..."
                                />
                                {errors.qualifications && (
                                    <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Important Information:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Your nomination will be reviewed by the Election Commission</li>
                                            <li>You will be notified once your nomination is approved or rejected</li>
                                            <li>Only approved candidates will appear on the ballot</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || data.vision_statement.length < 50}
                                    className="px-6 py-3 bg-blue-600 text-black rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
                                >
                                    {processing ? 'Submitting...' : 'Submit Nomination'}
                                </button>
                                <a
                                    href={route('elections.show', election.id)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
