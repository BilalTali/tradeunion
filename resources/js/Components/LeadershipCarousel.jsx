import { useState, useEffect } from 'react';

export default function LeadershipCarousel({ messages }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);

    // Reset expansion when message changes
    useEffect(() => {
        setExpanded(false);
    }, [currentIndex]);

    // Auto-advance
    useEffect(() => {
        if (!messages || messages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 6000); // 6 seconds

        return () => clearInterval(interval);
    }, [messages]);

    if (!messages || messages.length === 0) return null;

    const currentMessage = messages[currentIndex];
    const isLongText = currentMessage.message && currentMessage.message.length > 150;

    return (
        <section className="bg-white py-12 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 shadow-sm border border-blue-100 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Photo */}
                        <div className="flex justify-center md:justify-end">
                            <div className="relative">
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    {currentMessage.photo_path ? (
                                        <img
                                            src={`/storage/${currentMessage.photo_path}`}
                                            alt={currentMessage.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-5xl">
                                            {currentMessage.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md">
                                    {currentMessage.designation}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Message from Leadership</h2>
                            <div className={`prose prose-lg text-gray-700 mb-4 italic transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
                                &quot;{currentMessage.message}&quot;
                            </div>

                            {isLongText && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="text-blue-600 font-bold text-sm uppercase mb-6 hover:underline focus:outline-none"
                                >
                                    {expanded ? 'Read Less' : 'Read More'}
                                </button>
                            )}

                            {!isLongText && <div className="mb-6"></div>}


                            <h3 className="text-xl font-bold text-blue-900">{currentMessage.name}</h3>

                            {/* Dots Navigation */}
                            {messages.length > 1 && (
                                <div className="flex justify-center md:justify-start gap-2 mt-6">
                                    {messages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-blue-600' : 'bg-blue-200 hover:bg-blue-400'}`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
