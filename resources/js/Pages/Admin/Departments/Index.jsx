import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

export default function Index({ departments }) {
    const { auth, flash } = usePage().props;

    const handleDelete = (department) => {
        if (confirm(`Are you sure you want to delete the department "${department.name}"?`)) {
            router.delete(route('state.departments.destroy', department.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Department Management">
            <Head title="Departments" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto">
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">All Departments</h2>
                            <Link
                                href={route('state.departments.create')}
                                className="bg-union-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                + Add Department
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posting Label</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {departments.data.map((dept) => (
                                        <tr key={dept.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {dept.code}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {dept.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {dept.posting_label || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {dept.icon ? <i className={dept.icon}></i> : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${dept.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {dept.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link
                                                    href={route('state.departments.edit', dept.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(dept)}
                                                    className="text-red-600 hover:text-red-900 ml-3"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {departments.links.length > 3 && (
                            <div className="px-6 py-4 border-t flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Showing {departments.from} to {departments.to} of {departments.total} departments
                                </div>
                                <div className="flex space-x-1">
                                    {departments.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 border rounded ${link.active ? 'bg-union-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
