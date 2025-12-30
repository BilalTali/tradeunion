import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function BlogShow({ post, officeProfile }) {
    const { auth } = usePage().props;

    const getRoutePrefix = () => {
        const role = auth.user?.role || '';
        if (role === 'member') return 'member';
        if (role === 'super_admin') return 'state';
        if (role.includes('district')) return 'district';
        if (role.includes('tehsil')) return 'tehsil';
        return 'member';
    };

    const prefix = getRoutePrefix();
    const isAdmin = auth.user?.role !== 'member';
    const canEdit = isAdmin; // Will be further restricted by policy on backend

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            router.delete(route(`${prefix}.blog.destroy`, post.id));
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            circular: '📋',
            statement: '📢',
            notice: '📌',
            article: '📰',
            event: '📅',
            announcement: '📣'
        };
        return icons[category] || '📄';
    };

    const getCategoryColor = (category) => {
        const colors = {
            circular: 'bg-blue-100 text-blue-800 border-blue-200',
            statement: 'bg-purple-100 text-purple-800 border-purple-200',
            notice: 'bg-amber-100 text-amber-800 border-amber-200',
            article: 'bg-green-100 text-green-800 border-green-200',
            event: 'bg-red-100 text-red-800 border-red-200',
            announcement: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        };
        return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getScopeColor = (scope) => {
        const colors = {
            tehsil: 'bg-emerald-100 text-emerald-800',
            district: 'bg-cyan-100 text-cyan-800',
            state: 'bg-violet-100 text-violet-800'
        };
        return colors[scope] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout>
            <Head title={post.title} />

            <div className="min-h-screen bg-gray-50">
                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                            <Link href={route(`${prefix}.dashboard`)} className="hover:text-red-600 transition">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href={route(`${prefix}.blog.index`)} className="hover:text-red-600 transition">
                                {post.category === 'event' ? 'Events' : 'Posts'}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-700">{post.title.substring(0, 30)}...</span>
                        </div>

                        {/* Category & Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getCategoryColor(post.category)}`}>
                                <span className="text-lg">{getCategoryIcon(post.category)}</span>
                                {post.category.toUpperCase()}
                            </span>
                            {post.event_scope && (
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${getScopeColor(post.event_scope)}`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {post.event_scope.charAt(0).toUpperCase() + post.event_scope.slice(1)} Level
                                </span>
                            )}
                            {post.priority === 'high' && (
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-800">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    HIGH PRIORITY
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Article Card with Letterhead */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Letterhead Header */}
                        {officeProfile && (
                            <div className="border-b-4 border-red-600 px-8 md:px-12 py-6 bg-white">
                                <div className="flex items-start gap-6">
                                    {/* Logo */}
                                    {officeProfile.primary_logo_path && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={`/storage/${officeProfile.primary_logo_path}`}
                                                alt="Logo"
                                                className="w-20 h-20 object-contain"
                                            />
                                        </div>
                                    )}

                                    {/* Organization Details */}
                                    <div className="flex-1 text-center">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                            {officeProfile.organization_name}
                                        </h1>
                                        {officeProfile.tagline && (
                                            <p className="text-sm text-gray-600 italic mb-2">{officeProfile.tagline}</p>
                                        )}
                                        {officeProfile.full_address && (
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                {officeProfile.full_address}
                                                {officeProfile.pin_code && ` - ${officeProfile.pin_code}`}
                                            </p>
                                        )}
                                        {(officeProfile.primary_email || officeProfile.contact_numbers) && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                {officeProfile.primary_email && <span>Email: {officeProfile.primary_email}</span>}
                                                {officeProfile.primary_email && officeProfile.contact_numbers && Array.isArray(officeProfile.contact_numbers) && officeProfile.contact_numbers.length > 0 && <span className="mx-2">|</span>}
                                                {officeProfile.contact_numbers && Array.isArray(officeProfile.contact_numbers) && officeProfile.contact_numbers.length > 0 && (
                                                    <span>Ph: {officeProfile.contact_numbers.join(', ')}</span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    {/* Second Logo (if exists) */}
                                    {officeProfile.header_logo_path && (
                                        <div className="flex-shrink-0 hidden md:block">
                                            <img
                                                src={`/storage/${officeProfile.header_logo_path}`}
                                                alt="Secondary Logo"
                                                className="w-20 h-20 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Document Reference & Meta Header */}
                        <div className="bg-white px-8 md:px-12 py-4 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm font-medium text-gray-700 font-mono">
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Ref No:</span>
                                    <span>
                                        SSA/{post.category.toUpperCase()}/{post.id}/{new Date().getFullYear()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Date:</span>
                                    <span>
                                        {post.publish_date ? new Date(post.publish_date).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : new Date().toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Article Header */}
                        <div className="bg-white px-8 md:px-12 py-8 pt-6">
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center uppercase underline decoration-2 underline-offset-4 decoration-gray-300">
                                {post.title}
                            </h1>
                        </div>

                        {/* Article Body */}
                        <div className="px-8 md:px-12 py-8">
                            {/* Featured Image */}
                            {post.featured_image && (
                                <div className="mb-8 rounded-xl overflow-hidden shadow-md">
                                    <img
                                        src={`/storage/${post.featured_image}`}
                                        alt={post.title}
                                        className="w-full h-auto max-h-[500px] object-cover"
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            {post.excerpt && (
                                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
                                    <p className="text-lg text-gray-700 italic leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            )}

                            {/* Content */}
                            <div
                                className="prose prose-lg prose-blue max-w-none 
                                         prose-headings:font-bold prose-headings:text-gray-900
                                         prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                         prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                         prose-strong:text-gray-900 prose-strong:font-semibold
                                         prose-ul:text-gray-700 prose-ol:text-gray-700
                                         prose-li:marker:text-blue-600
                                         prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                                         prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
                                         prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* Event Details Section (if event) */}
                        {post.category === 'event' && (post.venue || post.start_date || post.organizer) && (
                            <div className="px-8 md:px-12 py-6 bg-gray-50 border-t border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Event Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {post.venue && (
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase">Venue</p>
                                                <p className="text-gray-900 font-medium">{post.venue}</p>
                                            </div>
                                        </div>
                                    )}

                                    {post.start_date && (
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase">Date & Time</p>
                                                <p className="text-gray-900 font-medium">
                                                    {new Date(post.start_date).toLocaleString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Author/Portfolio Signature Section */}
                        <div className="px-8 md:px-12 py-8 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-200">
                            <div className="flex items-start gap-6 justify-end w-full">



                                {/* Official Signature Block */}
                                <div className="hidden md:block flex-shrink-0 mt-4 md:mt-0">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Issuing Authority</p>

                                        <div className="relative inline-block min-w-[180px]">
                                            <div className="relative z-10">
                                                <h3 className="text-lg font-bold text-gray-900 font-serif">
                                                    {post.author?.name}
                                                </h3>
                                                <p className="text-xs font-bold text-gray-600 uppercase mt-1">
                                                    {post.author?.designation || post.author?.role?.replace('_', ' ').toUpperCase() || 'AUTHORIZED SIGNATORY'}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {officeProfile?.organization_name || 'J&K Employees Association'}
                                                </p>
                                            </div>

                                            {/* Digital Seal Stamp Effect */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[3px] border-red-200 text-red-200 rounded-full w-24 h-24 flex items-center justify-center -rotate-12 pointer-events-none select-none">
                                                <div className="w-20 h-20 border border-red-200 rounded-full flex items-center justify-center">
                                                    <span className="text-[10px] font-bold uppercase text-center leading-tight">
                                                        Official<br />Valid<br />Seal
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="px-8 md:px-12 py-6 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-4">
                            {canEdit && (
                                <Link
                                    href={route(`${prefix}.blog.edit`, post.id)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Post
                                </Link>
                            )}

                            {/* Download PDF Button */}
                            <a
                                href={route(`${prefix}.blog.download-pdf`, post.id)}
                                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-md hover:shadow-lg font-medium"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PDF
                            </a>

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-md hover:shadow-lg font-medium"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>

                            {canEdit && (
                                <>
                                    {post.category === 'event' && (
                                        <Link
                                            href={route(`${prefix}.blog.attendance`, post.id)}
                                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg font-medium"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            Manage Attendance
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg font-medium"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div >
                </div >
            </div>
        </AuthenticatedLayout >
    );
}

