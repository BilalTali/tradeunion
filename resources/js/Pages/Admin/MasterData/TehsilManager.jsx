import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function TehsilManager({ auth, tehsils, districts }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTehsil, setEditingTehsil] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        district_id: districts.length > 0 ? districts[0].id : '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingTehsil(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEditModal = (tehsil) => {
        setEditingTehsil(tehsil);
        setData({
            name: tehsil.name,
            code: tehsil.code,
            district_id: tehsil.district_id,
            description: tehsil.description || '',
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
        if (editingTehsil) {
            put(route('state.tehsils.update', editingTehsil.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('state.tehsils.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (tehsil) => {
        if (confirm('Are you sure you want to delete this tehsil? This action cannot be undone.')) {
            destroy(route('state.tehsils.destroy', tehsil.id));
        }
    };

    const filteredTehsils = tehsils.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tehsil Master Data</h2>}
        >
            <Head title="Tehsil Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-1/3">
                                <TextInput
                                    placeholder="Search Tehsils..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <PrimaryButton onClick={openCreateModal}>
                                + Add Tehsil
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTehsils.map((tehsil) => (
                                        <tr key={tehsil.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tehsil.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tehsil.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tehsil.district?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {tehsil.members_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(tehsil)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tehsil)}
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
                        {editingTehsil ? 'Edit Tehsil' : 'Add New Tehsil'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Tehsil Name" />
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
                            <InputLabel htmlFor="code" value="Tehsil Code" />
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
                            <InputLabel htmlFor="district_id" value="District" />
                            <select
                                id="district_id"
                                value={data.district_id}
                                onChange={(e) => setData('district_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </select>
                            {errors.district_id && <div className="text-red-600 text-sm mt-1">{errors.district_id}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description (Optional)" />
                            <TextInput
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingTehsil ? 'Update Tehsil' : 'Create Tehsil'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
