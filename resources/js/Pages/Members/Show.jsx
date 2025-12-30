import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

export default function Show({ member }) {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const getRoutePrefix = () => {
        if (!role) return 'member';
        const lowerRole = role.toLowerCase();
        if (lowerRole === 'super_admin') return 'state';
        if (lowerRole.includes('district') && !lowerRole.includes('member')) return 'district';
        if (lowerRole.includes('tehsil') && !lowerRole.includes('member')) return 'tehsil';
        return 'member';
    };

    const prefix = getRoutePrefix();

    const [selectedStarGrade, setSelectedStarGrade] = useState(member.star_grade || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    // Sync state with prop when it changes (e.g. after update)
    useEffect(() => {
        setSelectedStarGrade(member.star_grade || 0);
    }, [member.star_grade]);

    const handleStarGradeUpdate = () => {
        if (selectedStarGrade === member.star_grade) return;
        setIsUpdating(true);
        router.patch(`/members/${member.id}/star-grade`, {
            star_grade: selectedStarGrade,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Star grade updated successfully!');
                setIsUpdating(false);
            },
            onError: () => {
                setIsUpdating(false);
            },
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-red-100 text-red-800',
            resigned: 'bg-gray-100 text-gray-800',
            deceased: 'bg-black text-white',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout user={auth.user} header={`Member: ${member.name}`}>
            <Head title={`Member: ${member.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto">
                    {/* Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <Link
                            href={`/${prefix}/members`}
                            className="text-union-primary hover:text-red-900"
                        >
                            ← Back to Members
                        </Link>
                        <div className="flex gap-4">
                            <a
                                href={`/members/${member.id}/icard/download`}
                                className="bg-union-secondary text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                📥 Download I-Card
                            </a>
                            <Link
                                href={`/${prefix}/members/${member.id}/edit`}
                                className="bg-union-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Edit Member
                            </Link>
                        </div>
                    </div>

                    {/* Member Card */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <div className="flex gap-8 mb-8">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                {member.photo_path ? (
                                    <img
                                        src={`/storage/${member.photo_path}`}
                                        alt={member.name}
                                        className="w-40 h-40 rounded-lg object-cover border-4 border-union-primary"
                                    />
                                ) : (
                                    <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                        <span className="text-gray-500">No Photo</span>
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h2>
                                <p className="text-xl text-union-primary font-semibold mb-4">{member.membership_id}</p>

                                <div className="flex gap-4 items-center mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(member.status)}`}>
                                        {member.status.toUpperCase()}
                                    </span>

                                    <div className="relative">
                                        <select
                                            onChange={(e) => {
                                                if (confirm(`Are you sure you want to change status to ${e.target.value}?`)) {
                                                    router.patch(`/members/${member.id}/status`, { status: e.target.value });
                                                }
                                            }}
                                            value=""
                                            className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-union-primary focus:ring focus:ring-union-primary focus:ring-opacity-50 py-1 pl-2 pr-8"
                                            style={{ width: '130px' }}
                                        >
                                            <option value="" disabled>Change Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="resigned">Resigned</option>
                                            <option value="deceased">Deceased</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Star Grade */}
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Star Grade
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setSelectedStarGrade(star)}
                                                    className={`transition focus:outline-none ${star <= selectedStarGrade
                                                        ? 'text-yellow-400 hover:text-yellow-500'
                                                        : 'text-gray-300 hover:text-gray-400'
                                                        }`}
                                                    title={`Rate ${star} Stars`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setSelectedStarGrade(0)}
                                                className="text-xs text-red-500 hover:text-red-700 underline ml-2"
                                                title="Clear Rating"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        {selectedStarGrade !== member.star_grade && (
                                            <button
                                                onClick={handleStarGradeUpdate}
                                                disabled={isUpdating}
                                                className="bg-union-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                            >
                                                {isUpdating ? 'Updating...' : 'Save Grade'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                <dl className="space-y-3">
                                    {member.dob && (
                                        <>
                                            <dt className="text-sm text-gray-600">Date of Birth</dt>
                                            <dd className="text-gray-800 font-medium">{new Date(member.dob).toLocaleDateString()}</dd>
                                        </>
                                    )}
                                    {member.contact_email && (
                                        <>
                                            <dt className="text-sm text-gray-600">Email</dt>
                                            <dd className="text-gray-800 font-medium">{member.contact_email}</dd>
                                        </>
                                    )}
                                    {member.contact_phone && (
                                        <>
                                            <dt className="text-sm text-gray-600">Phone</dt>
                                            <dd className="text-gray-800 font-medium">{member.contact_phone}</dd>
                                        </>
                                    )}
                                </dl>
                            </div>

                            {/* Location */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                                <dl className="space-y-3">
                                    <dt className="text-sm text-gray-600">State</dt>
                                    <dd className="text-gray-800 font-medium">{member.tehsil.district.state.name}</dd>

                                    <dt className="text-sm text-gray-600">District</dt>
                                    <dd className="text-gray-800 font-medium">{member.tehsil.district.name}</dd>

                                    <dt className="text-sm text-gray-600">Tehsil</dt>
                                    <dd className="text-gray-800 font-medium">{member.tehsil.name}</dd>
                                </dl>
                            </div>

                            {/* Professional Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
                                <dl className="space-y-3">
                                    <dt className="text-sm text-gray-600">Department</dt>
                                    <dd className="text-gray-800 font-medium">{member.school_name}</dd>

                                    <dt className="text-sm text-gray-600">Designation</dt>
                                    <dd className="text-gray-800 font-medium">{member.designation}</dd>

                                    {member.subject && (
                                        <>
                                            <dt className="text-sm text-gray-600">Subject</dt>
                                            <dd className="text-gray-800 font-medium">{member.subject}</dd>
                                        </>
                                    )}

                                    {member.service_join_year && (
                                        <>
                                            <dt className="text-sm text-gray-600">Service Join Year</dt>
                                            <dd className="text-gray-800 font-medium">{member.service_join_year}</dd>
                                        </>
                                    )}
                                </dl>
                            </div>

                            {/* Union Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Union Information</h3>
                                <dl className="space-y-3">
                                    <dt className="text-sm text-gray-600">Union Join Date</dt>
                                    <dd className="text-gray-800 font-medium">
                                        {new Date(member.union_join_date).toLocaleDateString()}
                                    </dd>

                                    <dt className="text-sm text-gray-600">Membership Duration</dt>
                                    <dd className="text-gray-800 font-medium">
                                        {new Date().getFullYear() - new Date(member.union_join_date).getFullYear()} years
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        {/* Leadership Positions */}
                        {member.current_positions && member.current_positions.length > 0 && (
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Leadership Positions</h3>
                                <ul className="space-y-2">
                                    {member.current_positions.map((position, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-union-primary rounded-full mr-3"></span>
                                            <span className="font-medium">{position.position_title}</span>
                                            <span className="text-gray-600 ml-2">({position.level})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

