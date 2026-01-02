import { Head, Link, router } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { useState } from 'react';

export default function GovernmentOrders({ orders, departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('public.govt-orders'), { search, department }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FF9933] via-[#ffffff] via-[#ffffff] to-[#138808] relative font-sans">
            <PublicNavbar />
            <Head title="Government Orders - JKECC" />

            {/* Ashoka Chakra Watermark */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
                <svg className="w-[800px] h-[800px] animate-spin-slow" viewBox="0 0 24 24" fill="#6B7280">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" stroke="#6B7280" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="py-12 relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md font-serif mb-4">
                            Government Orders
                        </h1>
                        <p className="text-xl text-gray-800 font-bold bg-white/60 backdrop-blur-sm inline-block px-8 py-2 rounded-full shadow-sm">
                            Official Notifications & Circulars
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md overflow-hidden shadow-2xl rounded-2xl border-t-8 border-[#FF9933] border-b-8 border-[#138808]">
                        <div className="p-8">

                            {/* Search & Filter */}
                            <form onSubmit={handleSearch} className="mb-8 flex flex-col md:flex-row gap-4 bg-gray-50/50 p-6 rounded-xl border border-gray-200 shadow-inner">
                                <input
                                    type="text"
                                    placeholder="Search by title or keyword..."
                                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-[#138808] focus:ring-[#138808] py-3 px-4 text-gray-700 font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="rounded-lg border-gray-300 shadow-sm focus:border-[#138808] focus:ring-[#138808] py-3 px-4 text-gray-700 font-medium"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:-translate-y-0.5"
                                >
                                    Search
                                </button>
                                <Link
                                    href={route('public.govt-orders')}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition text-center"
                                >
                                    Reset
                                </Link>
                            </form>

                            {/* Orders List */}
                            <div className="space-y-4">
                                {orders.data.length > 0 ? (
                                    orders.data.map(order => (
                                        <div key={order.id} className="group border-l-4 border-gray-300 hover:border-[#FF9933] bg-white p-6 rounded-r-xl shadow-sm hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-x-1">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#138808] transition-colors">{order.title}</h3>
                                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <span className="mr-2">📅</span>
                                                            <span className="font-semibold">{new Date(order.order_date).toLocaleDateString()}</span>
                                                        </span>
                                                        <span className="flex items-center">
                                                            <span className="mr-2">🏢</span>
                                                            <span className="font-semibold">{order.department}</span>
                                                        </span>
                                                    </div>
                                                    {order.description && (
                                                        <p className="text-gray-600 mt-3 text-sm leading-relaxed">{order.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <a
                                                        href={`/storage/${order.file_path}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center px-6 py-2.5 bg-white border-2 border-[#138808] rounded-lg font-bold text-sm text-[#138808] uppercase tracking-wide shadow-sm hover:bg-[#138808] hover:text-white transition-all duration-300 group-hover:shadow-md"
                                                    >
                                                        <span className="mr-2">⬇️</span> Download
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-xl text-gray-500 font-medium">No government orders found matching your criteria.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="mt-10">
                                {orders.links && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {orders.links.map((link, i) => (
                                            link.url ? (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${link.active
                                                        ? 'bg-[#138808] text-white border-[#138808]'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-[#FF9933]'
                                                        }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={i}
                                                    className="px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 font-medium"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
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
