import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Index({ auth, calendars }) {
    const { flash } = usePage().props;
    const [selectedCalendar, setSelectedCalendar] = useState(calendars[0] || null);

    // Calendar Form
    const { data: calData, setData: setCalData, post: postCal, processing: calProcessing, errors: calErrors, reset: resetCal } = useForm({
        year: new Date().getFullYear(),
        file: null,
        is_active: true,
    });

    const submitCalendar = (e) => {
        e.preventDefault();
        postCal(route('state.calendars.store'), {
            onSuccess: () => resetCal(),
        });
    };

    // Event Form
    const { data: eventData, setData: setEventData, post: postEvent, processing: eventProcessing, errors: eventErrors, reset: resetEvent } = useForm({
        title: '',
        start_date: '',
        end_date: '',
        description: '',
        is_holiday: false,
    });

    const submitEvent = (e) => {
        e.preventDefault();
        if (!selectedCalendar) return;
        postEvent(route('state.calendars.events.store', selectedCalendar.id), {
            onSuccess: () => resetEvent(),
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Academic Calendar Managment</h2>}
        >
            <Head title="Academic Calendar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    {/* Add Calendar Year Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Add New Calendar Year</h3>
                        <form onSubmit={submitCalendar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <InputLabel htmlFor="year" value="Year" />
                                <TextInput
                                    id="year"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={calData.year}
                                    onChange={(e) => setCalData('year', e.target.value)}
                                    required
                                />
                                <InputError message={calErrors.year} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="file" value="PDF (Optional)" />
                                <input
                                    type="file"
                                    id="file"
                                    className="mt-1 block w-full text-sm"
                                    onChange={(e) => setCalData('file', e.target.files[0])}
                                    accept=".pdf"
                                />
                                <InputError message={calErrors.file} className="mt-1" />
                            </div>
                            <div>
                                <label className="flex items-center mt-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={calData.is_active}
                                        onChange={(e) => setCalData('is_active', e.target.checked)}
                                    />
                                    <span className="ml-2 text-gray-600">Active</span>
                                </label>
                            </div>
                            <div>
                                <PrimaryButton disabled={calProcessing}>Add Calendar</PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Calendar List & Event Management */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                            {calendars.map(cal => (
                                <button
                                    key={cal.id}
                                    onClick={() => setSelectedCalendar(cal)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedCalendar?.id === cal.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {cal.year} ({cal.events.length} Events)
                                </button>
                            ))}
                        </div>

                        {selectedCalendar ? (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">Events for {selectedCalendar.year}</h3>
                                    {selectedCalendar.file_path && (
                                        <div className="flex items-center gap-3">
                                            <a href={`/storage/${selectedCalendar.file_path}`} target="_blank" className="text-blue-600 hover:underline">View PDF</a>
                                            <Link
                                                href={route('state.calendars.file.destroy', selectedCalendar.id)}
                                                method="delete"
                                                as="button"
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                onClick={(e) => { if (!confirm('Are you sure you want to remove the PDF?')) e.preventDefault() }}
                                            >
                                                Delete PDF
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Add Event Form */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                                    <h4 className="text-sm font-semibold mb-3 uppercase text-gray-500">Add Event</h4>
                                    <form onSubmit={submitEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <TextInput placeholder="Event Title" className="w-full" value={eventData.title} onChange={(e) => setEventData('title', e.target.value)} required />
                                            <InputError message={eventErrors.title} className="mt-1" />
                                        </div>
                                        <div>
                                            <InputLabel value="Start Date" />
                                            <TextInput type="date" className="w-full" value={eventData.start_date} onChange={(e) => setEventData('start_date', e.target.value)} required />
                                            <InputError message={eventErrors.start_date} className="mt-1" />
                                        </div>
                                        <div>
                                            <InputLabel value="End Date (Optional)" />
                                            <TextInput type="date" className="w-full" value={eventData.end_date} onChange={(e) => setEventData('end_date', e.target.value)} />
                                            <InputError message={eventErrors.end_date} className="mt-1" />
                                        </div>
                                        <div className="md:col-span-2 flex items-center justify-between">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="rounded border-gray-300" checked={eventData.is_holiday} onChange={(e) => setEventData('is_holiday', e.target.checked)} />
                                                <span className="ml-2">Is Holiday</span>
                                            </label>
                                            <PrimaryButton disabled={eventProcessing}>Add Event</PrimaryButton>
                                        </div>
                                    </form>
                                </div>

                                {/* Events List */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Event</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                                <th className="px-4 py-2 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {selectedCalendar.events.length > 0 ? (
                                                selectedCalendar.events.map(event => (
                                                    <tr key={event.id}>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            {new Date(event.start_date).toLocaleDateString()}
                                                            {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString()}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm font-medium">{event.title}</td>
                                                        <td className="px-4 py-2">
                                                            {event.is_holiday && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Holiday</span>}
                                                        </td>
                                                        <td className="px-4 py-2 text-right">
                                                            <Link
                                                                href={route('state.calendars.events.destroy', event.id)}
                                                                method="delete"
                                                                as="button"
                                                                className="text-red-500 hover:text-red-700 text-sm"
                                                                onClick={(e) => { if (!confirm('Remove event?')) e.preventDefault() }}
                                                            >
                                                                Remove
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-500">No events added yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Select a calendar year to manage events.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
