import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, achievements }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Achievements</h2>}
        >
            <Head title="Achievements" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Achievements List</h3>
                                <Link
                                    href={route('state.achievements.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add New Achievement
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {achievements.length > 0 ? (
                                    achievements.map((item) => (
                                        <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                                            {item.image_path && (
                                                <img src={`/storage/${item.image_path}`} alt={item.title} className="w-full h-48 object-cover" />
                                            )}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {item.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">{new Date(item.date).toLocaleDateString()}</p>
                                                <p className="text-gray-700 line-clamp-3 mb-4">{item.description}</p>
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('state.achievements.edit', item.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
                                                    <Link
                                                        href={route('state.achievements.destroy', item.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        onClick={(e) => { if (!confirm('Are you sure?')) e.preventDefault() }}
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-gray-500">No achievements found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
