import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function BlogPublicShow({ post }) {
    const { auth } = usePage().props;

    // Reuse similar templates but remove Admin Actions

    // 1. Event View
    const EventView = () => (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in">
            {/* Banner */}
            {post.featured_image ? (
                <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-3xl mb-6">
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-auto max-h-[600px] object-contain"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase shadow-lg">
                            {post.event_type || 'Event'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-48 flex items-center justify-center text-white">
                    <span className="text-4xl">📅 {post.event_type?.toUpperCase() || 'EVENT'}</span>
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Content */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{post.title}</h1>
                        {post.excerpt && (
                            <p className="text-xl text-gray-500 italic mb-8 border-l-4 border-pink-500 pl-4">{post.excerpt}</p>
                        )}
                        <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Right: Event Meta Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100 sticky top-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                ℹ️ Event Details
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-pink-600 uppercase mb-1">Venue</p>
                                    <p className="font-bold text-gray-900 text-lg">{post.venue || 'TBA'}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-pink-600 uppercase mb-1">Start Time</p>
                                        <div className="bg-white px-3 py-2 rounded-lg border border-pink-100">
                                            <p className="font-bold text-gray-800">
                                                {post.start_date ? new Date(post.start_date).toLocaleDateString() : 'TBA'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {post.start_date ? new Date(post.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-pink-600 uppercase mb-1">End Time</p>
                                        <div className="bg-white px-3 py-2 rounded-lg border border-pink-100">
                                            <p className="font-bold text-gray-800">
                                                {post.end_date ? new Date(post.end_date).toLocaleDateString() : 'TBA'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {post.end_date ? new Date(post.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {post.organizer && (
                                    <div>
                                        <p className="text-xs font-bold text-pink-600 uppercase mb-1">Organizer</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">👤</span>
                                            <span className="font-bold text-gray-900">{post.organizer.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 2. Official View (Notice, etc.)
    const OfficialView = () => (
        <div className="bg-white shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto animate-in scale-in-95 duration-300" style={{ minHeight: '800px' }}>
            {/* Header Stripe */}
            <div className={`p-4 text-center text-white font-bold uppercase tracking-[0.2em] ${post.priority === 'urgent' ? 'bg-red-700' : 'bg-blue-900'
                }`}>
                OFFICIAL {post.category.toUpperCase()}
                {post.priority === 'urgent' && <span className="ml-2 animate-pulse">⚠️ URGENT</span>}
            </div>

            <div className="p-12 md:p-16 relative">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <span className="text-[15rem] font-black uppercase transform -rotate-12">{post.category}</span>
                </div>

                {/* Letterhead Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase">Employees Union Portal</h2>
                        <p className="text-gray-600 font-serif">State Headquarters</p>
                    </div>
                    <div className="text-right text-sm font-mono text-gray-600">
                        <p>Ref No: <span className="font-bold text-black">{post.id.toString().padStart(6, '0')}</span></p>
                        <p>Date: <span className="font-bold text-black">{new Date(post.created_at).toLocaleDateString()}</span></p>
                    </div>
                </div>

                {/* Subject */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 underline decoration-2 decoration-gray-400 underline-offset-8 leading-tight">
                        {post.title}
                    </h1>
                </div>

                {/* Body */}
                <div className="prose prose-xl max-w-none text-gray-900 font-serif leading-relaxed text-justify mb-16" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Footer / Signature */}
                <div className="flex justify-between items-end mt-20 pt-10">
                    <div className="text-sm text-gray-500">
                        <p>cc: File</p>
                    </div>
                    <div className="text-center pr-10">
                        {post.organizer ? (
                            <>
                                <p className="font-bold text-gray-900 text-lg uppercase">{post.organizer.name}</p>
                                <p className="text-gray-600">Authorized Signatory</p>
                            </>
                        ) : (
                            <>
                                <p className="font-bold text-gray-900 text-lg uppercase">{post.author?.name || 'Admin'}</p>
                                <p className="text-gray-600">General Secretary</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // 3. Standard Article View
    const ArticleView = () => (
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto animate-in fade-in">
            {post.featured_image && (
                <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-gray-100">
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-auto max-h-[600px] object-contain"
                    />
                </div>
            )}
            <div className="p-8 md:p-12">
                <div className="flex gap-2 mb-6 text-sm font-bold text-blue-600 uppercase tracking-wider">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

                {post.excerpt && (
                    <p className="text-xl text-gray-500 italic mb-8 border-l-4 border-blue-500 pl-4">
                        {post.excerpt}
                    </p>
                )}

                <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </article>
    );

    const renderContent = () => {
        if (post.category === 'event') return <EventView />;
        if (['notice', 'circular', 'statement', 'announcement'].includes(post.category)) return <OfficialView />;
        return <ArticleView />;
    };

    return (
        <AuthenticatedLayout user={auth.user} header="News & Updates">
            <Head title={post.title} />

            <div className="py-8 bg-slate-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('dashboard')} className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2">
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {renderContent()}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
