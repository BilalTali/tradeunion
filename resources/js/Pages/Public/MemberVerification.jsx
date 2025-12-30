import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function MemberVerification({ member, verified }) {
    return (
        <GuestLayout>
            <Head title="Member Verification" />

            <div className="min-h-screen bg-gray-100 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {verified ? (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">✓ Verified Member</h2>
                                <p className="text-gray-600 mt-2">This is an authentic member of {member.tehsil.district.state.name}</p>
                            </div>

                            <div className="border-t border-b border-gray-200 py-6 my-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 text-center">
                                        {member.photo_path && (
                                            <img
                                                src={`/storage/${member.photo_path}`}
                                                alt={member.name}
                                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-union-primary"
                                            />
                                        )}
                                        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                        <p className="text-union-primary font-semibold">{member.membership_id}</p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-gray-600">Designation</p>
                                        <p className="font-semibold text-gray-800">{member.designation}</p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-gray-600">School</p>
                                        <p className="font-semibold text-gray-800">{member.school_name}</p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-gray-600">Tehsil</p>
                                        <p className="font-semibold text-gray-800">{member.tehsil.name}</p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-gray-600">District</p>
                                        <p className="font-semibold text-gray-800">{member.tehsil.district.name}</p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-gray-600">Star Grade</p>
                                        <p className="text-yellow-500 text-lg">
                                            {'⭐'.repeat(member.star_grade)}
                                        </p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${member.status === 'active' ? 'bg-green-100 text-green-800' :
                                                member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {member.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {member.current_positions && member.current_positions.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 mb-2">Current Positions</h4>
                                    <ul className="space-y-2">
                                        {member.current_positions.map((position, index) => (
                                            <li key={index} className="flex items-center text-sm">
                                                <span className="w-2 h-2 bg-union-primary rounded-full mr-2"></span>
                                                <span className="font-medium">{position.position_title}</span>
                                                <span className="text-gray-600 ml-2">({position.level})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="text-center text-sm text-gray-500">
                                <p>Verified at {new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Member Not Found</h2>
                            <p className="text-gray-600">The membership ID could not be verified.</p>
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}

