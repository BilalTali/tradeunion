import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Attendance({ post, roster }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    // Initialize form with roster data
    // We map roster to attendance array: [{ member_id, status, notes }]
    const { data, setData, post: submit, processing, recentlySuccessful } = useForm({
        attendance: roster.map(r => ({
            member_id: r.member_id,
            status: r.status || 'pending', // pending, present, absent, excused
            notes: r.notes || ''
        }))
    });

    const handleStatusChange = (memberId, newStatus) => {
        setData('attendance', data.attendance.map(item =>
            item.member_id === memberId ? { ...item, status: newStatus } : item
        ));
    };

    const handleSave = () => {
        // Find correct prefix based on role
        const prefix = auth.user.role === 'super_admin' ? 'state' :
            auth.user.role.includes('district') ? 'district' : 'tehsil';

        submit(route(`${prefix}.blog.attendance.store`, post.id));
    };

    const handleNotify = (type) => {
        const prefix = auth.user.role === 'super_admin' ? 'state' :
            auth.user.role.includes('district') ? 'district' : 'tehsil';

        if (confirm(`Are you sure you want to send ${type === 'duty_slip' ? 'DUTY SLIPS' : 'ABSENT NOTICES'}? This will email members.`)) {
            submit(route(`${prefix}.blog.attendance.notify`, post.id), {
                data: { type },
                preserveScroll: true,
            });
        }
    };

    // Filtering for display
    const filteredRoster = roster.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header={`Attendance: ${post.title}`}>
            <Head title="Manage Attendance" />

            <div className="py-8 bg-slate-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                                <p className="text-gray-500 mt-1">
                                    {new Date(post.start_date).toLocaleDateString()} • {post.venue}
                                </p>
                                <div className="mt-2 text-sm">
                                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md font-bold text-xs uppercase mr-2">
                                        {post.target_audience === 'portfolio_holders' ? 'Portfolio Holders Only' : 'All Members'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleNotify('duty_slip')}
                                    className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-bold text-sm flex items-center gap-2"
                                >
                                    📩 Send Duty Slips
                                </button>
                                <button
                                    onClick={() => handleNotify('absent_notice')}
                                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-bold text-sm flex items-center gap-2"
                                >
                                    ⚠️ Send Absent Notices
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Save */}
                    <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-slate-100 py-4">
                        <input
                            type="text"
                            placeholder="🔍 Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition transform hover:scale-105"
                        >
                            {processing ? 'Saving...' : '💾 Save Attendance'}
                        </button>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Notifications</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRoster.map((member) => {
                                    // Get current status from form data (reactive)
                                    const currentStatus = data.attendance.find(a => a.member_id === member.member_id)?.status || 'pending';

                                    return (
                                        <tr key={member.member_id} className={currentStatus === 'absent' ? 'bg-red-50' : currentStatus === 'present' ? 'bg-green-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {member.photo_url ? (
                                                            <img className="h-10 w-10 rounded-full object-cover" src={member.photo_url} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">?</div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                        <div className="text-sm text-gray-500">{member.designation} • {member.school_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="inline-flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                                                    <button
                                                        onClick={() => handleStatusChange(member.member_id, 'present')}
                                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${currentStatus === 'present' ? 'bg-green-500 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(member.member_id, 'absent')}
                                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${currentStatus === 'absent' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                                                    >
                                                        Absent
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(member.member_id, 'excused')}
                                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${currentStatus === 'excused' ? 'bg-yellow-500 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                                                    >
                                                        Excused
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-500">
                                                <div className="flex flex-col gap-1 items-center">
                                                    {member.notification_sent && (
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                            📩 Slip Sent
                                                        </span>
                                                    )}
                                                    {member.absent_notice_sent && (
                                                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                            ⚠️ Notice Sent
                                                        </span>
                                                    )}
                                                    {!member.notification_sent && !member.absent_notice_sent && (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredRoster.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No members found for this audience.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Creating a floating success toast for feedback */}
            {recentlySuccessful && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce">
                    ✅ Saved Successfully!
                </div>
            )}
        </AuthenticatedLayout>
    );
}

