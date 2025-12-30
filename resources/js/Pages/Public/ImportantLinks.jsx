import { Head, Link, router } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { useState, useEffect } from 'react';

export default function ImportantLinks({ links, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('public.links'), { search }, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FF9933] via-[#ffffff] via-[#ffffff] to-[#138808] relative font-sans">
            <PublicNavbar />
            <Head title="Important Government Links - JKTU" />

            {/* Ashoka Chakra Watermark */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0">
                <svg className="w-[800px] h-[800px] animate-spin-slow" viewBox="0 0 24 24" fill="#000080">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" stroke="#000080" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="py-12 relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md font-serif mb-4">
                            Important Links
                        </h1>
                        <p className="text-xl text-[#000080] font-bold bg-white/80 backdrop-blur-sm inline-block px-8 py-2 rounded-full shadow-sm">
                            Access Government Resources & Portals
                        </p>
                    </div>

                    {/* Search and Table Container */}
                    <div className="bg-white/95 backdrop-blur-md overflow-hidden shadow-2xl rounded-2xl border-t-8 border-[#FF9933] border-b-8 border-[#138808]">

                        {/* Search Bar */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="max-w-md mx-auto relative">
                                <input
                                    type="text"
                                    placeholder="Search links or departments..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Department / Resource
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                            URL
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {links.data.length > 0 ? (
                                        links.data.map((link) => (
                                            <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {link.icon_path ? (
                                                                <img className="h-10 w-10 rounded-full object-cover" src={`/storage/${link.icon_path}`} alt="" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{link.title}</div>
                                                            <div className="text-xs text-[#FF9933] font-semibold">{link.department}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-500 max-w-xs truncate">
                                                        {link.url}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF9933] to-[#138808] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#138808] transition"
                                                    >
                                                        Visit Link
                                                        <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                                No links found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {links.links.length > 3 && (
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {links.prev_page_url ? (
                                        <Link href={links.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Previous
                                        </Link>
                                    ) : <div></div>}
                                    {links.next_page_url && (
                                        <Link href={links.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{links.from}</span> to <span className="font-medium">{links.to}</span> of <span className="font-medium">{links.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {links.links.map((link, key) => (
                                                <Link
                                                    key={key}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                        ${link.active ? 'z-10 bg-[#FF9933] border-[#FF9933] text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
                                                        ${key === 0 ? 'rounded-l-md' : ''}
                                                        ${key === links.links.length - 1 ? 'rounded-r-md' : ''}
                                                        ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                                    `}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    preserveState
                                                    preserveScroll
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
                    to { transform: translateX(-50%) translateY(-50%) rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
            `}</style>
        </div>
    );
}
