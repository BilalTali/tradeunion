import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ districts, tehsils, roleType, auth }) {
    const role = auth.user.role;

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const rolePrefix = getRolePrefix();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        admin_role: '',
        entity_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route(`${rolePrefix}.admins.store`), {
            onError: (errors) => {

            },
            onSuccess: () => {

            }
        });
    };

    const roleOptions = roleType === 'district'
        ? [
            { value: 'district_admin', label: 'District Admin' },
            { value: 'district_president', label: 'District President' },
        ]
        : [
            { value: 'tehsil_admin', label: 'tehsil Admin' },
            { value: 'tehsil_president', label: 'tehsil President' },
        ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Admin" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href={route(`${rolePrefix}.admins.index`)} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                            ← Back to Admins
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Create {roleType === 'district' ? 'District' : 'Tehsil'} Admin</h1>
                        <p className="mt-2 text-gray-600">Add a new administrator to the system</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8">
                        {/* Display general errors */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <h3 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
                                <ul className="list-disc list-inside text-red-600 text-sm">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setData('phone', val);
                                    }}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    maxLength={10}
                                    pattern="\d{10}"
                                    title="Please enter exactly 10 digits"
                                />
                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Profile Photo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Photo
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('photo', e.target.files[0])}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    accept="image/*"
                                />
                                {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Role *
                                </label>
                                <select
                                    value={data.admin_role}
                                    onChange={(e) => setData('admin_role', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                >
                                    <option value="">Select Role...</option>
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.admin_role && <p className="mt-2 text-sm text-red-600">{errors.admin_role}</p>}
                            </div>

                            {/* Entity Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {roleType === 'district' ? 'District' : 'Tehsil'} *
                                </label>
                                <select
                                    value={data.entity_id}
                                    onChange={(e) => setData('entity_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                >
                                    <option value="">Select {roleType === 'district' ? 'District' : 'Tehsil'}...</option>
                                    {roleType === 'district' && districts?.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name}
                                        </option>
                                    ))}
                                    {roleType === 'tehsil' && tehsils?.map((tehsil) => (
                                        <option key={tehsil.id} value={tehsil.id}>
                                            {tehsil.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.entity_id && <p className="mt-2 text-sm text-red-600">{errors.entity_id}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={route(`${rolePrefix}.admins.index`)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors font-bold shadow-lg"
                                >
                                    {processing ? 'Creating...' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

