import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import { useState } from 'react';

export default function BlogCreate({ categories, initialCategory, portfolios = [] }) {
    const { auth } = usePage().props;
    const [previewMode, setPreviewMode] = useState(false);

    // Initial state setup
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        category: initialCategory || 'article',
        publish_date: '',
        status: 'draft',
        visibility: 'members_only',
        featured_image: null,
        // Enterprise fields
        event_type: 'meeting',
        event_scope: 'tehsil',
        start_date: '',
        end_date: '',
        venue: '',
        organizer_portfolio_id: '',
        priority: 'normal',
        expiry_date: '',
    });

    const getRoutePrefix = () => {
        const role = auth.user?.role || '';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'state';
    };

    const prefix = getRoutePrefix();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${prefix}.blog.store`));
    };

    const getPreviewImage = () => {
        if (data.featured_image instanceof File) {
            return URL.createObjectURL(data.featured_image);
        }
        return null;
    };

    // --- RENDER HELPERS ---

    // 1. Event Form Rendering
    const renderEventForm = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Type</label>
                        <select
                            value={data.event_type}
                            onChange={(e) => setData('event_type', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        >
                            <option value="meeting">Meeting</option>
                            <option value="election">Election</option>
                            <option value="rally">Rally/Protest</option>
                            <option value="program">Cultural Program</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Venue</label>
                        <input
                            type="text"
                            value={data.venue}
                            onChange={(e) => setData('venue', e.target.value)}
                            placeholder="e.g. Town Hall, Main Office"
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                        <input
                            type="datetime-local"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Organizer (Portfolio)</label>
                        <select
                            value={data.organizer_portfolio_id}
                            onChange={(e) => setData('organizer_portfolio_id', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        >
                            <option value="">Select Organizer...</option>
                            {portfolios.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    // 2. Official Form Rendering (Notice, Circular, Announcement)
    const renderOfficialForm = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📢 Official Communication Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                        <select
                            value={data.priority}
                            onChange={(e) => setData('priority', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="normal">Normal</option>
                            <option value="high">High Priority</option>
                            <option value="urgent">Urgent / Immediate</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            value={data.expiry_date}
                            onChange={(e) => setData('expiry_date', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto-archive after this date (optional)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issuing Authority</label>
                        <select
                            value={data.organizer_portfolio_id}
                            onChange={(e) => setData('organizer_portfolio_id', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Select Authority...</option>
                            {portfolios.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    // 3. Preview Rendering
    const renderPreview = () => (
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in duration-300 border border-gray-200">
            {/* Dynamic Header based on Category */}
            {['notice', 'circular', 'announcement'].includes(data.category) && (
                <div className={`p-4 text-center text-white font-bold uppercase tracking-widest ${data.priority === 'urgent' ? 'bg-red-600' : 'bg-blue-900'
                    }`}>
                    OFFICIAL {data.category} {data.priority === 'urgent' && '- URGENT'}
                </div>
            )}

            {data.featured_image && (
                <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg mb-6">
                    <img
                        src={getPreviewImage()}
                        alt="Preview"
                        className="w-full h-auto max-h-[600px] object-contain"
                    />
                </div>
            )}

            <div className="p-8 md:p-12">
                {/* Meta Data */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm font-bold text-gray-500 border-b pb-4">
                    <span className="uppercase text-blue-600">{data.category}</span>
                    <span>•</span>
                    <span>No: {Date.now().toString().slice(-6)} (Ref)</span>
                    <span>•</span>
                    <span>{data.publish_date ? new Date(data.publish_date).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight font-serif">
                    {data.title || 'Untitled Post'}
                </h1>

                {/* Specific Event Block in Preview */}
                {data.category === 'event' && (
                    <div className="mb-8 p-6 bg-pink-50 rounded-xl border border-pink-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs font-bold text-pink-500 uppercase">Venue</p>
                            <p className="font-semibold text-gray-900">{data.venue || 'TBA'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-pink-500 uppercase">Starts</p>
                            <p className="font-semibold text-gray-900">{data.start_date ? new Date(data.start_date).toLocaleString() : 'TBA'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-pink-500 uppercase">Ends</p>
                            <p className="font-semibold text-gray-900">{data.end_date ? new Date(data.end_date).toLocaleString() : 'TBA'}</p>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: data.content || '<p>No content...</p>' }} />

                {/* Signature Block for Official */}
                {['notice', 'circular', 'announcement'].includes(data.category) && (
                    <div className="mt-12 pt-8 border-t border-gray-200 flex justify-end">
                        <div className="text-center">
                            <p className="font-bold text-gray-900">Authorized Signatory</p>
                            <p className="text-sm text-gray-500">Employees Union Portal</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-gray-50 p-6 text-center border-t">
                <button
                    onClick={() => setPreviewMode(false)}
                    className="text-blue-600 font-bold hover:underline"
                >
                    Exit Preview to Continue Editing
                </button>
            </div>
        </article>
    );

    return (
        <AuthenticatedLayout user={auth.user} header={`Create ${data.category.charAt(0).toUpperCase() + data.category.slice(1)}`}>
            <Head title={`New ${data.category}`} />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Bar */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link href={route(`${prefix}.blog.index`)} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium mb-1">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {data.category === 'event' ? '🗓️ Schedule Event' :
                                    ['notice', 'circular', 'announcement'].includes(data.category) ? '📢 Issue Official Post' :
                                        '✍️ Write Article'}
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            {/* Category Switcher (Quick) */}
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setData('category', cat)}
                                        className={`px-3 py-1.5 rounded text-xs font-bold capitalize transition ${data.category === cat ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 border ${previewMode
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {previewMode ? '✏️ Edit' : '👁️ Preview'}
                            </button>
                        </div>
                    </div>

                    {previewMode ? renderPreview() : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
                            {/* LEFT COLUMN (Main Content) */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Title */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title / Subject</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder={data.category === 'circular' ? 'e.g. Circular regarding Annual Meet...' : 'Enter title...'}
                                        className="w-full text-xl font-bold border-gray-200 rounded-lg focus:ring-black focus:border-black"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                {/* Conditional Professional Forms */}
                                {data.category === 'event' && renderEventForm()}
                                {['notice', 'circular', 'announcement'].includes(data.category) && renderOfficialForm()}

                                {/* Editor */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Content Body</span>
                                    </div>
                                    <div className="min-h-[400px]">
                                        <RichTextEditor
                                            content={data.content}
                                            onChange={(val) => setData('content', val)}
                                        />
                                    </div>
                                    {errors.content && <p className="p-4 text-red-500 text-sm">{errors.content}</p>}
                                </div>
                                {/* Event Specific Fields */}
                                {data.category === 'event' && (
                                    <div className="mb-6 bg-pink-50 p-6 rounded-xl border border-pink-100">
                                        <h3 className="text-lg font-bold text-pink-700 mb-4 flex items-center gap-2">
                                            📅 Event Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="target_audience"
                                                            value="all_members"
                                                            checked={data.target_audience === 'all_members'}
                                                            onChange={(e) => setData('target_audience', e.target.value)}
                                                            className="text-pink-600 focus:ring-pink-500"
                                                        />
                                                        <span className="text-gray-900">All Members</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="target_audience"
                                                            value="portfolio_holders"
                                                            checked={data.target_audience === 'portfolio_holders'}
                                                            onChange={(e) => setData('target_audience', e.target.value)}
                                                            className="text-pink-600 focus:ring-pink-500"
                                                        />
                                                        <span className="text-gray-900 font-bold">Portfolio Holders Only</span>
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {data.target_audience === 'all_members'
                                                        ? 'Invite everyone in your jurisdiction (tehsil/District/State).'
                                                        : 'Invite only Office Bearers / Portfolio holders.'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Excerpt */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Short Summary</label>
                                    <textarea
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        rows="2"
                                        className="w-full border-gray-200 rounded-lg focus:ring-black focus:border-black"
                                    ></textarea>
                                </div>
                            </div>

                            {/* RIGHT COLUMN (Settings) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Publish Action */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                                    <div className="mb-6">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${data.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            Status: {data.status}
                                        </span>
                                        <h3 className="font-bold text-gray-900">Publishing</h3>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full rounded-lg border-gray-200"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Visibility</label>
                                            <select
                                                value={data.visibility}
                                                onChange={(e) => setData('visibility', e.target.value)}
                                                className="w-full rounded-lg border-gray-200"
                                            >
                                                <option value="members_only">Members Only</option>
                                                <option value="public">Public</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Publish Date</label>
                                            <input
                                                type="datetime-local"
                                                value={data.publish_date}
                                                onChange={(e) => setData('publish_date', e.target.value)}
                                                className="w-full rounded-lg border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
                                    >
                                        {processing ? 'Saving...' : '💾 Save & Publish'}
                                    </button>
                                </div>

                                {/* Banner Image */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-black transition cursor-pointer relative bg-gray-50">
                                        <input
                                            type="file"
                                            onChange={(e) => setData('featured_image', e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                        {data.featured_image ? (
                                            <div>
                                                <p className="text-green-600 font-bold text-sm">✓ Image Selected</p>
                                                <p className="text-xs text-gray-500 truncate mt-1">{data.featured_image.name}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="text-2xl block mb-2">📷</span>
                                                <p className="text-xs text-gray-500">Click to upload</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

