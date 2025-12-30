import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function ImportantLinks({ groupedLinks }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FF9933] via-[#ffffff] via-[#ffffff] to-[#138808] relative font-sans">
            <PublicNavbar />
            <Head title="Important Government Links - JKTU" />

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
                            Important Links
                        </h1>
                        <p className="text-xl text-gray-800 font-bold bg-white/60 backdrop-blur-sm inline-block px-8 py-2 rounded-full shadow-sm">
                            Access Government Resources & Portals
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md overflow-hidden shadow-2xl rounded-2xl border-t-8 border-[#FF9933] border-b-8 border-[#138808]">
                        <div className="p-8">
                            {Object.keys(groupedLinks).length > 0 ? (
                                <div className="space-y-12">
                                    {Object.entries(groupedLinks).map(([department, links]) => (
                                        <div key={department} className="relative">
                                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-[#138808] mb-6 pb-2 border-b-2 border-gray-100 font-serif inline-block">
                                                {department}
                                            </h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {links.map(link => (
                                                    <a
                                                        key={link.id}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="group flex items-center p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:border-[#138808] transition duration-300 transform hover:-translate-y-1"
                                                    >
                                                        {link.icon_path ? (
                                                            <img src={`/storage/${link.icon_path}`} alt="" className="w-12 h-12 object-contain mr-5" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mr-5 group-hover:bg-green-50 transition border border-gray-100 group-hover:border-green-200">
                                                                <svg className="w-6 h-6 text-gray-400 group-hover:text-[#138808]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 overflow-hidden">
                                                            <h3 className="font-bold text-gray-800 group-hover:text-[#138808] transition text-lg truncate">{link.title}</h3>
                                                            <p className="text-xs text-gray-500 truncate max-w-full font-mono mt-1 opacity-80">{link.url}</p>
                                                        </div>
                                                        <svg className="w-5 h-5 ml-2 text-gray-300 group-hover:text-[#FF9933] transition transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                    <h3 className="text-xl font-medium text-gray-900">No Links Found</h3>
                                    <p className="text-gray-500 mt-2">Important useful links will appear here.</p>
                                </div>
                            )}
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
