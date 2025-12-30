import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyAttendance({ records, message }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Attendance" />

            <div className="py-8 bg-slate-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Attendance History</h1>
                        <p className="text-gray-600 mt-2">View your event participation records and download official documents</p>
                    </div>

                    {/* Empty State */}
                    {records && records.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Attendance Records</h3>
                            <p className="text-gray-500">
                                {message || 'You haven\'t been enrolled in any events yet.'}
                            </p>
                        </div>
                    ) : (
                        /* Attendance Table */
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Event Title
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Venue
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                                Documents
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {records && records.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50 transition">
                                                {/* Date */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {record.event.start_date ? new Date(record.event.start_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        }) : 'TBA'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {record.event.start_date ? new Date(record.event.start_date).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit'
                                                        }) : ''}
                                                    </div>
                                                </td>

                                                {/* Event Title */}
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('member.blog.show', record.event.id)}
                                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {record.event.title}
                                                    </Link>
                                                </td>

                                                {/* Event Type */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-purple-100 text-purple-800 uppercase">
                                                        {record.event.event_type || 'Meeting'}
                                                    </span>
                                                </td>

                                                {/* Venue */}
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">{record.event.venue}</div>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {record.status === 'present' && (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 border-2 border-green-300">
                                                            ✅ Present
                                                        </span>
                                                    )}
                                                    {record.status === 'absent' && (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-800 border-2 border-red-300">
                                                            ❌ Absent
                                                        </span>
                                                    )}
                                                    {record.status === 'excused' && (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                                                            ⚠️ Excused
                                                        </span>
                                                    )}
                                                    {record.status === 'pending' && (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-600 border-2 border-gray-300">
                                                            ⏳ Pending
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Download Buttons */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        {/* Duty Slip - Always Available */}
                                                        <a
                                                            href={route('member.attendance.dutyslip', record.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm transition transform hover:scale-105"
                                                            title="Download Duty Slip"
                                                        >
                                                            📩 Duty Slip
                                                        </a>

                                                        {/* Absent Notice - Only for Absent */}
                                                        {record.status === 'absent' && (
                                                            <a
                                                                href={route('member.attendance.absentnotice', record.id)}
                                                                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-sm transition transform hover:scale-105"
                                                                title="Download Absent Notice"
                                                            >
                                                                ⚠️ Notice
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer with Summary */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div>
                                        <strong>Total Events:</strong> {records ? records.length : 0}
                                    </div>
                                    <div className="flex gap-6">
                                        <span>
                                            <strong className="text-green-700">Present:</strong>{' '}
                                            {records ? records.filter(r => r.status === 'present').length : 0}
                                        </span>
                                        <span>
                                            <strong className="text-red-700">Absent:</strong>{' '}
                                            {records ? records.filter(r => r.status === 'absent').length : 0}
                                        </span>
                                        <span>
                                            <strong className="text-yellow-700">Excused:</strong>{' '}
                                            {records ? records.filter(r => r.status === 'excused').length : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
