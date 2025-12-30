import { useState } from 'react';

export default function AchievementsSection({ achievements }) {
    if (!achievements || achievements.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Achievements</h2>
                    <p className="mt-4 text-xl text-gray-500">Celebrating our milestones and successes together</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {achievements.map((item) => (
                        <AchievementCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function AchievementCard({ item }) {
    const [expanded, setExpanded] = useState(false);
    const isLongText = item.description && item.description.length > 100;

    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Image */}
            <div className="h-48 overflow-hidden relative bg-gray-100">
                {item.image_path ? (
                    <img
                        src={`/storage/${item.image_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="m10 14-1-1-3 4h12l-5-7z"></path></svg>
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                    {new Date(item.date).toLocaleDateString()}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                </h3>
                <p className={`text-gray-600 text-sm mb-4 flex-1 ${expanded ? '' : 'line-clamp-2'}`}>
                    {item.description}
                </p>

                {isLongText && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-union-primary font-bold text-xs uppercase tracking-wide hover:underline self-start mt-auto"
                    >
                        {expanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </div>
        </div>
    );
}
