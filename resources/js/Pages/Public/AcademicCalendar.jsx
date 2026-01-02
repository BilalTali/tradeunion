import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function AcademicCalendar({ calendar }) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FF9933] via-[#ffffff] via-[#ffffff] to-[#138808] relative font-sans">
            <PublicNavbar />
            <Head title="Academic Calendar - JKECC" />

            {/* Ashoka Chakra Watermark */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
                <svg className="w-[800px] h-[800px] animate-spin-slow" viewBox="0 0 24 24" fill="#6B7280">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" stroke="#6B7280" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="py-12 relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/90 backdrop-blur-md overflow-hidden shadow-2xl rounded-2xl border-t-8 border-[#FF9933] border-b-8 border-[#138808] p-8">
                        {calendar ? (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200 pb-6">
                                    <div className="text-center md:text-left">
                                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808] font-serif mb-2">
                                            Academic Calendar {calendar.year}
                                        </h1>
                                        <p className="text-gray-600 font-medium text-lg">Schedule of Events & Holidays</p>
                                    </div>

                                    {calendar.file_path && (
                                        <a
                                            href={`/storage/${calendar.file_path}`}
                                            target="_blank"
                                            className="mt-4 md:mt-0 bg-[#138808] text-white px-8 py-3 rounded-full hover:bg-green-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            <span className="font-bold">Download PDF</span>
                                        </a>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {months.map((month, index) => {
                                        const monthEvents = calendar.events.filter(e => new Date(e.start_date).getMonth() === index);

                                        return (
                                            <div key={month} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                                                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFB766] text-white py-3 px-4 font-bold text-center text-lg uppercase tracking-wide">
                                                    {month}
                                                </div>
                                                <div className="p-5 min-h-[140px] bg-white">
                                                    {monthEvents.length > 0 ? (
                                                        <ul className="space-y-4">
                                                            {monthEvents.map(event => (
                                                                <li key={event.id} className="border-b last:border-0 border-gray-100 pb-3 last:pb-0">
                                                                    <div className="flex justify-between items-start w-full gap-3">
                                                                        <div className="flex flex-col items-center bg-gray-100 rounded p-1 min-w-[3rem]">
                                                                            <span className="font-bold text-lg text-gray-800">{new Date(event.start_date).getDate()}</span>
                                                                            <span className="text-[10px] uppercase text-gray-500 font-semibold">{new Date(event.start_date).toLocaleString('default', { weekday: 'short' })}</span>
                                                                        </div>

                                                                        <div className="flex-1">
                                                                            <p className={`font-medium text-sm ${event.is_holiday ? 'text-[#FF9933] font-bold' : 'text-gray-700'}`}>
                                                                                {event.title}
                                                                            </p>
                                                                            {event.is_holiday && (
                                                                                <span className="inline-block mt-1 text-[10px] border border-[#FF9933] text-[#FF9933] px-2 py-0.5 rounded-full font-bold">
                                                                                    HOLIDAY
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                            <span className="text-3xl mb-1 opacity-20">📅</span>
                                                            <span className="text-sm italic">No scheduled events</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-24">
                                <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-400 font-serif">Season's Preparation</h2>
                                <p className="text-gray-500 mt-2 text-lg">The academic calendar for this year is being finalized.</p>
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
