import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ admin, districts, tehsils, auth }) {
    const role = auth.user.role;

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        return 'tehsil';
    };

    const rolePrefix = getRolePrefix();

    const { data, setData, put, processing, errors } = useForm({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        is_active: admin.is_active ?? true,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route(`${rolePrefix}.admins.update`, admin.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Admin" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href={route(`${rolePrefix}.admins.index`)} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                            ← Back to Admins
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Admin</h1>
                        <p className="mt-2 text-gray-600">Update administrator details</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8">
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
                                <div className="flex items-center space-x-4 mb-4">
                                    {admin.photo_path && (
                                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                            <img
                                                src={`/storage/${admin.photo_path}`}
                                                alt={admin.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => setData('photo', e.target.files[0])}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        accept="image/*"
                                    />
                                </div>
                                {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active Admin</span>
                                </label>
                            </div>

                            {/* Role Info (Read-only) */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Current Role</p>
                                <p className="text-sm text-gray-900 capitalize">{admin.role.replace('_', ' ')}</p>
                                {admin.district && (
                                    <p className="text-sm text-gray-600 mt-1">District: {admin.district.name}</p>
                                )}
                                {admin.tehsil && (
                                    <p className="text-sm text-gray-600 mt-1">tehsil: {admin.tehsil.name}</p>
                                )}
                            </div>

                            {/* Change Password Section */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                <p className="text-sm text-gray-600 mb-4">Leave blank to keep current password</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                    </div>
                                </div>
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
                                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
                                >
                                    {processing ? 'Updating...' : 'Update Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

