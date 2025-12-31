import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function DistrictManager({ auth, districts, states }) {
    const [showModal, setShowModal] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        state_id: states.length > 0 ? states[0].id : '',
        office_address: '',
        contact_details: '',
    });

    const openCreateModal = () => {
        setEditingDistrict(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEditModal = (district) => {
        setEditingDistrict(district);
        setData({
            name: district.name,
            code: district.code,
            state_id: district.state_id,
            office_address: district.office_address || '',
            contact_details: district.contact_details ? JSON.stringify(district.contact_details) : '',
        });
        clearErrors();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Parse contact_details if needed, but for now sending as null if empty or string
        // The controller casts it to array, so we might need to send it as JSON string or handle it
        // For simplicity, let's treat it as a JSON string field that the user inputs manually if they want,
        // or just ignore if it's too complex for now. The requirement was "update tehsil, district".

        let payload = { ...data };
        try {
            if (payload.contact_details) {
                payload.contact_details = JSON.parse(payload.contact_details);
            } else {
                payload.contact_details = null;
            }
        } catch (e) {
            // If invalid JSON, let it fail or handle
            // For now, let's just send it as is if it fails parsing?
            // Actually, backend expects cast array. If we send string it might fail validation or cast.
            // Let's assume user inputs valid JSON or we provide simple fields.
            // To be safe, let's omit contact_details from this basic manager unless requested.
            // Or just make it a text field.
            delete payload.contact_details; // Skipping complex field for basic CRUD
        }

        if (editingDistrict) {
            put(route('state.districts.update', editingDistrict.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('state.districts.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (district) => {
        if (confirm('Are you sure you want to delete this district? This action cannot be undone.')) {
            destroy(route('state.districts.destroy', district.id));
        }
    };

    const filteredDistricts = districts.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">District Master Data</h2>}
        >
            <Head title="District Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-1/3">
                                <TextInput
                                    placeholder="Search Districts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <PrimaryButton onClick={openCreateModal}>
                                + Add District
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tehsils</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredDistricts.map((district) => (
                                        <tr key={district.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.state?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {district.tehsils_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(district)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(district)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingDistrict ? 'Edit District' : 'Add New District'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="District Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="code" value="District Code" />
                            <TextInput
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            {errors.code && <div className="text-red-600 text-sm mt-1">{errors.code}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="state_id" value="State" />
                            <select
                                id="state_id"
                                value={data.state_id}
                                onChange={(e) => setData('state_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Select State</option>
                                {states.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                            {errors.state_id && <div className="text-red-600 text-sm mt-1">{errors.state_id}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="office_address" value="Office Address (Optional)" />
                            <TextInput
                                id="office_address"
                                value={data.office_address}
                                onChange={(e) => setData('office_address', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            {errors.office_address && <div className="text-red-600 text-sm mt-1">{errors.office_address}</div>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingDistrict ? 'Update District' : 'Create District'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
