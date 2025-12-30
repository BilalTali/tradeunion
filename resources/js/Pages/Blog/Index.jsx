import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function BlogIndex({ posts, filters }) {
    const { auth } = usePage().props;
    const [status, setStatus] = useState(filters?.status || 'all');
    const [category, setCategory] = useState(filters?.category || 'all');

    const getRoutePrefix = () => {
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const prefix = getRoutePrefix();

    const handleFilter = (type, value) => {
        const newFilters = { ...filters };
        if (type === 'status') {
            setStatus(value);
            newFilters.status = value;
        } else {
            setCategory(value);
            newFilters.category = value;
        }
        router.get(route(`${prefix}.blog.index`), newFilters, { preserveState: true });
    };

    const statusColors = {
        draft: 'bg-yellow-100 text-yellow-800',
        published: 'bg-green-100 text-green-800',
        archived: 'bg-gray-100 text-gray-800',
    };

    const categoryColors = {
        circular: 'bg-blue-100 text-blue-800',
        statement: 'bg-purple-100 text-purple-800',
        notice: 'bg-red-100 text-red-800',
        article: 'bg-indigo-100 text-indigo-800',
        event: 'bg-pink-100 text-pink-800',
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            router.delete(route(`${prefix}.blog.destroy`, id));
        }
    };

    const headerInfo = {
        event: { title: '📅 Events', description: 'Manage upcoming and past events.' },
        notice: { title: '📢 Announcements', description: 'Manage important announcements and notices.' },
        circular: { title: '⭕ Circulars', description: 'Official circulars and memos.' },
        statement: { title: '🗣️ Statements', description: 'Press statements and releases.' },
        article: { title: '📰 Articles', description: 'General news and articles.' },
    }[category] || { title: '📝 Blog Posts', description: 'Manage circulars, statements, notices, and articles.' };

    return (
        <AuthenticatedLayout user={auth.user} header={headerInfo.title}>
            <Head title={headerInfo.title.replace(/^[^\s]+\s/, '')} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{headerInfo.title}</h1>
                            <p className="mt-2 text-gray-600">
                                {headerInfo.description}
                            </p>
                        </div>
                        <Link
                            href={route(`${prefix}.blog.create`, category !== 'all' ? { category } : {})}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>New {headerInfo.title.replace(/[\u{1F300}-\u{1F6FF}\s]/gu, '').replace(/s$/, '')}</span>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="border-gray-300 rounded-lg"
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => handleFilter('category', e.target.value)}
                                className="border-gray-300 rounded-lg"
                            >
                                <option value="all">All Categories</option>
                                <option value="circular">Circular</option>
                                <option value="statement">Statement</option>
                                <option value="notice">Notice</option>
                                <option value="article">Article</option>
                                <option value="event">Event</option>
                            </select>
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {posts.data?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.data.map((post) => (
                                <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                                    {post.featured_image && (
                                        <img
                                            src={`/storage/${post.featured_image}`}
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[post.status]}`}>
                                                {post.status}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[post.category]}`}>
                                                {post.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                                        )}
                                        <div className="text-xs text-gray-500 mb-4">
                                            By {post.author?.name || 'Unknown'} • {post.publish_date ? new Date(post.publish_date).toLocaleDateString() : 'Not published'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route(`${prefix}.blog.show`, post.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route(`${prefix}.blog.edit`, post.id)}
                                                className="text-green-600 hover:text-green-800 text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-500 mb-4">No blog posts yet.</p>
                            <Link
                                href={route(`${prefix}.blog.create`)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Create your first post →
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.links && posts.data?.length > 0 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {posts.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg ${link.active
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

