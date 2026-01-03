import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

export default function Create() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        icon: '',
        posting_label: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('state.departments.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Add Department">
            <Head title="Add Department" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                        placeholder="e.g. School Education"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                        placeholder="e.g. SE"
                                        maxLength="20"
                                    />
                                    {errors.code && (
                                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                    rows="3"
                                    placeholder="Department description (optional)"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon Class
                                    </label>
                                    <input
                                        type="text"
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg"
                                        placeholder="e.g. fas fa-graduation-cap"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Font Awesome or similar icon class</p>
                                    {errors.icon && (
                                        <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Posting Label
                                    </label>
                                    <input
                                        type="text"
                                        value={data.posting_label}
                                        onChange={(e) => setData('posting_label', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg"
                                        placeholder="e.g. School, Hospital, Office"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Used in member registration forms</p>
                                    {errors.posting_label && (
                                        <p className="mt-1 text-sm text-red-600">{errors.posting_label}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-union-primary focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Active
                                </label>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                                <Link
                                    href={route('state.departments.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-union-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
