import { useState } from 'react';

export default function AchievementsSection({ achievements }) {
    if (!achievements || achievements.length === 0) return null;

    // Duplicate logic for smooth infinite scroll
    // We need enough items to fill the screen and then some to loop smoothly.
    // If few items, duplicate more times.
    let displayItems = [...achievements];
    // Ensure we have at least 6 items for smooth scrolling on large screens
    while (displayItems.length < 6) {
        displayItems = [...displayItems, ...achievements];
    }
    // Double it for the seamless loop (A + B -> A' + B')
    const finalItems = [...displayItems, ...displayItems];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif">Our Achievements</h2>
                    <p className="mt-4 text-xl text-gray-500">Celebrating our milestones and successes together</p>
                </div>
            </div>

            {/* Continuous Marquee Container */}
            <div className="group relative">
                {/* Gradient Masks for Fade Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <div
                    className="flex gap-8 animate-marquee-cards w-max px-4 group-hover:[animation-play-state:paused]"
                    style={{ willChange: 'transform' }} // Optimization
                >
                    {finalItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="w-[300px] md:w-[380px] flex-shrink-0 transform transition-transform duration-300 hover:scale-[1.02]">
                            <AchievementCard item={item} />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee-cards {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-cards {
                    animation: marquee-cards 60s linear infinite;
                }
                /* Mobile optimization: faster scroll if needed, or keep same speed */
                @media (max-width: 768px) {
                    .animate-marquee-cards {
                        animation-duration: 45s; 
                    }
                }
            `}</style>
        </section>
    );
}

function AchievementCard({ item }) {
    const [expanded, setExpanded] = useState(false);
    const isLongText = item.description && item.description.length > 100;

    return (
        <div className="group/card bg-white rounded-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Image */}
            <div className="h-56 overflow-hidden relative bg-gray-50">
                {item.image_path ? (
                    <img
                        src={`/storage/${item.image_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-20 h-20 opacity-40" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="m10 14-1-1-3 4h12l-5-7z"></path></svg>
                    </div>
                )}

                {/* Date Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur shadow-sm text-gray-800 border border-gray-100">
                        {new Date(item.date).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/card:text-[#FF9933] transition-colors leading-tight font-serif">
                    {item.title}
                </h3>

                <div className={`text-gray-600 text-sm mb-4 flex-1 relative leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
                    {item.description}
                </div>

                {isLongText && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[#138808] font-bold text-xs uppercase tracking-wide hover:underline self-start mt-auto flex items-center gap-1 group/btn"
                    >
                        {expanded ? 'Read Less' : 'Read More'}
                        <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                )}
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] to-[#138808] transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
}
