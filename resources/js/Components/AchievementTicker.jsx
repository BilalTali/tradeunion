export default function AchievementTicker({ messages }) {
    if (!messages || messages.length === 0) return null;

    // Duplicating messages ensures smooth infinite scroll effect
    const displayMessages = [...messages, ...messages];

    return (
        <div className="bg-[#1F2937] text-white overflow-hidden py-3 border-b-4 border-[#FF9933] relative">
            <div className="flex items-center gap-2 absolute left-0 top-0 bottom-0 bg-[#1F2937] px-4 z-10 shadow-lg">
                <span className="bg-[#FF9933] text-xs font-black text-white px-2 py-1 rounded uppercase tracking-widest">
                    Latest
                </span>
                <span className="font-bold text-[#FF9933] animate-pulse">Updates</span>
            </div>

            <div className="animate-marquee whitespace-nowrap flex gap-12 items-center pl-48">
                {displayMessages.map((msg, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm font-medium tracking-wide">
                        <span className="text-[#FF9933] text-lg">•</span>
                        {msg.title}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
