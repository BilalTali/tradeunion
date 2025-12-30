import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ profile, entity }) {
    const { auth } = usePage().props;

    const getRolePrefix = () => {
        const role = auth.user.role.toLowerCase();
        if (role === 'super_admin' || role.includes('state')) return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${profile.organization_name} - Office Profile`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{profile.organization_name}</h1>
                            <p className="mt-2 text-gray-600">{profile.tagline}</p>
                        </div>

                        <Link
                            href={route(`${getRolePrefix()}.office-profile.edit`)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {profile.primary_logo_path && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Primary Logo</h3>
                                        <img
                                            src={`/storage/${profile.primary_logo_path}`}
                                            alt="Logo"
                                            className="max-h-32 border border-gray-200 rounded p-2"
                                        />
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Full Address</h3>
                                    <p className="mt-1 text-gray-900">{profile.full_address}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                                    <p className="mt-1 text-gray-900">{profile.primary_email}</p>
                                    {profile.secondary_email && (
                                        <p className="text-gray-900">{profile.secondary_email}</p>
                                    )}
                                    {profile.contact_numbers && profile.contact_numbers.map((num, i) => (
                                        <p key={i} className="text-gray-900">{num}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {profile.affiliation_text && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Affiliation</h3>
                                        <p className="mt-1 text-gray-900">{profile.affiliation_text}</p>
                                    </div>
                                )}

                                {profile.registration_number && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
                                        <p className="mt-1 text-gray-900">{profile.registration_number}</p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Profile Completion</h3>
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-700">
                                                {profile.completion_percentage}%
                                            </span>
                                            {profile.is_complete && (
                                                <span className="text-xs text-green-600 font-medium">
                                                    ✓ Complete
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${profile.completion_percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

