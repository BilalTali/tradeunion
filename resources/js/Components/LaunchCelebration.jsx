import { useState, useEffect } from 'react';

export default function LaunchCelebration({ config }) {
    // Config should have: is_active, button_text, launch_message, chief_guest_name, guest_designation, image_path (via parent check)
    // We expect config to be the raw 'content' array/object + image_path from the model

    // Parse config (it might be an array with one item if coming from 'list' schema)
    // Parse config content (it comes as JSON string from DB/Inertia if not cast in model)
    let contentData = config?.content;
    if (typeof contentData === 'string') {
        try {
            contentData = JSON.parse(contentData);
        } catch (e) {
            contentData = [];
        }
    }

    const settings = Array.isArray(contentData) && contentData.length > 0 ? contentData[0] : {};

    // Config logic: Check both boolean true/false and string "true"/"false"
    // The CMS saves it as a string "true" or "false" in the JSON content
    const isActive = String(settings.is_active).toLowerCase().trim() === 'true';

    const imagePath = config?.image_path;

    const [launched, setLaunched] = useState(false);
    const [visible, setVisible] = useState(isActive);
    const [flowers, setFlowers] = useState([]);

    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isActive]);

    if (!visible || !isActive) return null;

    const handleLaunch = () => {
        setLaunched(true);
        // Generate Tricolor Confetti
        const newFlowers = Array.from({ length: 75 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            animationDuration: Math.random() * 3 + 2 + 's',
            delay: Math.random() * 2 + 's',
            // Saffron, White, Green hearts/circles
            emoji: ['🧡', '🤍', '💚', '🇮🇳', '✨'][Math.floor(Math.random() * 5)]
        }));
        setFlowers(newFlowers);
    };

    const handleEnter = () => {
        setVisible(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Tricolor Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50 opacity-95"></div>

            {/* Decorative Borders */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-orange-500 shadow-md"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-600 shadow-md"></div>

            {/* Spinning Chakra Background (Subtle) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border-[20px] border-blue-900 animate-spin-slow border-dashed"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">

                {!launched ? (
                    <div className="space-y-8 p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100">
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 drop-shadow-sm">
                                Ready to Launch?
                            </h1>
                            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-orange-500 via-gray-200 to-green-600 rounded-full"></div>
                        </div>

                        <p className="text-xl md:text-2xl text-gray-600 font-medium">
                            The new JKEC portal is production-ready for Jammu Kashmir teachers.
                        </p>

                        <button
                            onClick={handleLaunch}
                            className="group relative inline-flex items-center justify-center px-12 py-5 text-2xl font-bold text-white transition-all duration-300 transform rounded-full hover:scale-105 active:scale-95 shadow-xl hover:shadow-orange-500/25 overflow-hidden"
                            style={{ background: 'linear-gradient(90deg, #FF9933 0%, #FF8822 100%)' }}
                        >
                            {/* Tricolor shine effect */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

                            <span className="mr-3 filter drop-shadow">🚀</span>
                            <span className="filter drop-shadow">{settings.button_text || "LAUNCH PORTAL"}</span>
                        </button>


                    </div>
                ) : (
                    <div className="space-y-4 md:space-y-6 animate-pop-in bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-orange-100 relative overflow-hidden max-h-[80vh] w-[95vw] md:w-auto md:max-w-3xl overflow-y-auto custom-scrollbar mx-4">
                        {/* Decorative corner ribbons */}
                        <div className="absolute top-0 left-0 w-24 h-24 -translate-x-12 -translate-y-12 bg-orange-500 rotate-45 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 translate-x-12 translate-y-12 bg-green-600 rotate-45 pointer-events-none"></div>

                        {/* Close/Skip Button (Top Right) */}
                        <button
                            onClick={handleEnter}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-20"
                            title="Close"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Chief Guest Image */}
                        {imagePath ? (
                            <div className="mx-auto w-32 h-32 md:w-48 md:h-48 rounded-full p-2 bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-xl relative mb-4 group hover:scale-105 transition-transform duration-500">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-gray-50">
                                    <img
                                        src={`/storage/${imagePath}`}
                                        alt="Chief Guest"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        ) : null}

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 drop-shadow-sm pb-1 leading-tight">
                                {settings.launch_message || "Congratulations!"}
                            </h2>
                            <div className="flex justify-center gap-2">
                                <div className="h-1.5 w-12 bg-orange-500 rounded-full"></div>
                                <div className="h-1.5 w-12 bg-gray-300 rounded-full flex justify-center items-center"><div className="w-1.5 h-1.5 bg-blue-800 rounded-full"></div></div>
                                <div className="h-1.5 w-12 bg-green-600 rounded-full"></div>
                            </div>
                        </div>

                        <div className="rounded-xl p-2 md:p-4">
                            {settings.chief_guest_name && (
                                <h3 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 leading-tight">
                                    Inaugurated by <span className="text-blue-900 block md:inline mt-1 md:mt-0">{settings.chief_guest_name}</span>
                                </h3>
                            )}
                            {settings.guest_designation && (
                                <p className="text-sm md:text-lg text-green-700 font-semibold tracking-wide uppercase mt-2">
                                    {settings.guest_designation}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 md:mt-8 pb-2">
                            <button
                                onClick={handleEnter}
                                className="px-8 py-3 bg-blue-900 text-white font-bold rounded-full hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/30 text-base md:text-lg flex items-center gap-2 mx-auto"
                            >
                                <span>Continue to Website</span>
                                <span>&rarr;</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Falling Flowers Animation */}
            {launched && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    {flowers.map((flower) => (
                        <div
                            key={flower.id}
                            className="absolute top-0 text-3xl animate-fall filter drop-shadow-sm"
                            style={{
                                left: flower.left,
                                animationDuration: flower.animationDuration,
                                animationDelay: flower.delay,
                                opacity: 0.9
                            }}
                        >
                            {flower.emoji}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                @keyframes pop-in {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fade-in-up {
                    0% { transform: translateY(30px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
