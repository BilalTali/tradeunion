import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState, useEffect } from 'react';

export default function Create({ auth, user: userData }) {
    const { data, setData, post, processing, errors } = useForm({
        category: '',
        subject: '',
        message: '',
        incident_date: '',
        grievance_level: '',
        attachment: null,
        is_declaration_accepted: false,
    });

    const [charCount, setCharCount] = useState(0);

    const categories = [
        'Service Matter',
        'Transfer / Posting',
        'Pay / Allowances',
        'Promotion / Seniority',
        'Disciplinary Action',
        'Welfare / Benefits',
        'Other'
    ];

    const needsEvidence = ['Pay / Allowances', 'Promotion / Seniority', 'Disciplinary Action'].includes(data.category);

    const submit = (e) => {
        e.preventDefault();
        post(route('grievances.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Submit New Grievance</h2>}
        >
            <Head title="Submit Grievance" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8">

                        {/* 1. Member Identification */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">1. Member Identification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel value="Member Name" />
                                    <TextInput value={userData.name} className="mt-1 block w-full bg-gray-50" disabled />
                                </div>
                                <div>
                                    <InputLabel value="Member ID" />
                                    <TextInput value={userData.member?.membership_id || 'N/A'} className="mt-1 block w-full bg-gray-50" disabled />
                                </div>
                                <div>
                                    <InputLabel value="Designation" />
                                    <TextInput value={userData.member?.designation || 'N/A'} className="mt-1 block w-full bg-gray-50" disabled />
                                </div>
                                <div>
                                    <InputLabel value="Current Place of Posting" />
                                    <TextInput value={userData.member?.place_of_posting || 'N/A'} className="mt-1 block w-full bg-gray-50" disabled />
                                </div>
                            </div>
                        </div>

                        {/* 2. Grievance Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">2. Grievance Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <InputLabel htmlFor="category" value="Grievance Category *" />
                                    <select
                                        id="category"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <InputError message={errors.category} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="incident_date" value="Date of Incident / Cause *" />
                                    <TextInput
                                        id="incident_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.incident_date}
                                        onChange={(e) => setData('incident_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.incident_date} className="mt-2" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="subject" value="Subject / Title (Max 150 chars) *" />
                                <TextInput
                                    id="subject"
                                    className="mt-1 block w-full"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    maxLength={150}
                                    required
                                />
                                <InputError message={errors.subject} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="message" value="Detailed Description (Min 100 chars) *" />
                                <textarea
                                    id="message"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-40"
                                    value={data.message}
                                    onChange={(e) => {
                                        setData('message', e.target.value);
                                        setCharCount(e.target.value.length);
                                    }}
                                    required
                                ></textarea>
                                <div className={`text-xs mt-1 text-right ${charCount < 100 ? 'text-red-500' : 'text-green-600'}`}>
                                    {charCount} / 100 minimum characters
                                </div>
                                <InputError message={errors.message} className="mt-2" />
                            </div>
                        </div>

                        {/* 3. Jurisdiction */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">3. Jurisdiction & Routing</h3>
                            <div className="max-w-md">
                                <InputLabel htmlFor="grievance_level" value="Grievance Level *" />
                                <select
                                    id="grievance_level"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.grievance_level}
                                    onChange={(e) => setData('grievance_level', e.target.value)}
                                    required
                                >
                                    <option value="">Select Level</option>
                                    <option value="tehsil">Tehsil Level</option>
                                    <option value="district">District Level</option>
                                    <option value="state">State Level</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">This determines which authority will handle your grievance.</p>
                                <InputError message={errors.grievance_level} className="mt-2" />
                            </div>
                        </div>

                        {/* 4. Evidence */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">4. Supporting Evidence</h3>

                            {needsEvidence && (
                                <div className="mb-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                                    <p className="text-sm text-yellow-800 font-medium">
                                        Note: For {data.category}, supporting documents are <strong>MANDATORY</strong>.
                                    </p>
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="attachment" value={`Supporting Document ${needsEvidence ? '(Required)' : '(Optional)'}`} />
                                <input
                                    type="file"
                                    id="attachment"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => setData('attachment', e.target.files[0])}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required={needsEvidence}
                                />
                                <p className="text-xs text-gray-500 mt-1">Max 2MB. formats: PDF, JPG, PNG.</p>
                                <InputError message={errors.attachment} className="mt-2" />
                            </div>
                        </div>

                        {/* 5. Declaration */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">5. Declaration</h3>

                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 mt-1"
                                    checked={data.is_declaration_accepted}
                                    onChange={(e) => setData('is_declaration_accepted', e.target.checked)}
                                    required
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that submitting false information may attract disciplinary action.
                                </span>
                            </label>
                            <InputError message={errors.is_declaration_accepted} className="mt-2" />
                        </div>

                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing} className="px-8 py-3 text-lg">
                                {processing ? 'Submitting...' : 'Submit Grievance'}
                            </PrimaryButton>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
