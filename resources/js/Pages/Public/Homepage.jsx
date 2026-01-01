import PublicNavbar from '@/Components/PublicNavbar';
import HomeHeroSlider from '@/Components/HomeHeroSlider';
import LeadershipCarousel from '@/Components/LeadershipCarousel';
import AchievementsSection from '@/Components/AchievementsSection';
import AchievementTicker from '@/Components/AchievementTicker';
import FeedbacksSection from '@/Components/FeedbacksSection';
import LaunchCelebration from '@/Components/LaunchCelebration';
import PublicFooter from '@/Components/PublicFooter';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Homepage({ officeProfile, heroSlides, contents, feedbacks = [], messages, achievements }) {
    const { auth } = usePage().props;
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        category: 'Other',
        message: ''
    });
    // Helper to get text/JSON content safely
    const getContent = (key, defaultText = '') => {
        return contents?.[key]?.content || defaultText;
    };

    // Helper to get parsed JSON list
    const getList = (key) => {
        try {
            const val = contents?.[key]?.content;
            if (!val) return [];
            return typeof val === 'string' ? JSON.parse(val) : val;
        } catch (e) {

            return [];
        }
    };

    // Helper to get settings
    const getSettings = (key) => contents?.[key]?.settings || {};

    // Helper to get title/subtitle
    const getSectionInfo = (key, defaultTitle, defaultSubtitle) => ({
        title: contents?.[key]?.title || defaultTitle,
        subtitle: contents?.[key]?.subtitle || defaultSubtitle
    });

    // Theme Configuration
    const theme = {
        primary: '#FF9933', // Saffron
        secondary: '#138808', // India Green
        navy: '#1F2937', // Neutral Dark Gray (replacing Navy)
        font: '"Merriweather", serif' // Authoritative font
    };

    // Data Sections
    const missionCards = getList('mission_cards');
    const structure = getList('structure');
    const journey = getList('journey');
    const features = getList('features');


    const missionInfo = getSectionInfo('mission_cards', 'Our Mission & Services', 'Dedicated to the welfare of every state employee');
    const structureInfo = getSectionInfo('structure', 'Organizational Hierarchy', 'A transparent, democratic framework');
    const journeyInfo = getSectionInfo('journey', 'Membership Journey', 'From registration to leadership');
    const featuresInfo = getSectionInfo('features', 'Digital Infrastructure', 'Modernizing union operations');

    // Voice of Unity Config
    const voiceInfo = getSectionInfo('voice_of_unity', 'The Voice of Unity', 'Join the conversation and make your voice heard.');
    const voiceList = getList('voice_of_unity');
    const voiceConfig = voiceList.length > 0 ? voiceList[0] : {};

    // LATEST UPDATES TICKER (From CMS)
    const tickerUpdates = getList('latest_updates');
    // If no ticker updates found, fallback to achievements or empty
    const displayTicker = tickerUpdates.length > 0 ? tickerUpdates : (achievements ? achievements.slice(0, 3) : []);

    const aboutInfo = getSectionInfo('about', 'About the Association', '');
    const aboutText = getContent('about');

    // Prepare Footer Configuration (Merge Content + Settings)
    const footerConfig = (() => {
        const row = contents?.['footer_global'];
        if (!row) return {};
        try {
            const parsed = typeof row.content === 'string' ? JSON.parse(row.content) : (row.content || {});
            return { ...parsed, settings: row.settings };
        } catch (e) { return {}; }
    })();

    return (
        <div className="min-h-screen font-sans text-gray-900" style={{ fontFamily: theme.font }}>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    :root {
                        --color-saffron: #FF9933;
                        --color-white: #ffffff;
                        --color-green: #138808;
                        --color-navy: #1F2937;
                    }
                    .font-serif { font-family: 'Merriweather', serif; }
                    .font-sans { font-family: 'Inter', sans-serif; }
                    
                    .bg-tricolor-gradient {
                        background: linear-gradient(90deg, var(--color-saffron) 0%, #ffffff 50%, var(--color-green) 100%);
                    }
                    .border-tricolor-top {
                        border-top: 4px solid transparent;
                        border-image: linear-gradient(to right, var(--color-saffron), #ffffff, var(--color-green)) 1;
                    }
                    .text-saffron { color: var(--color-saffron); }
                    .text-navy { color: var(--color-navy); }
                    .text-green { color: var(--color-green); }
                `}</style>
                <title>{officeProfile?.organization_name || 'JKECC'}</title>
            </Head>

            <PublicNavbar />

            {/* PORTAL LAUNCH CELEBRATION OVERLAY */}
            <LaunchCelebration config={{ ...contents?.['portal_launch'], ...getSettings('portal_launch') }} />

            {/* UPDATES TICKER */}
            <AchievementTicker messages={displayTicker} />

            {/* HERO SLIDER */}
            <HomeHeroSlider
                slides={heroSlides}
                defaultTitle={officeProfile?.short_name || officeProfile?.organization_name}
                defaultSubtitle={officeProfile?.tagline}
            />

            {/* TRICOLOR SEPARATOR LINE */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

            {/* QUICK LINKS BAR */}
            <div className="relative bg-gradient-to-r from-[#FF9933] via-white to-[#138808] py-10 overflow-hidden border-y border-gray-200 shadow-md">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <Link href="/government-orders" className="flex items-center justify-center p-4 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 transition-all group backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1">
                            <span className="p-3 bg-white rounded-full group-hover:scale-110 transition-transform mr-4 shadow-md">
                                <svg className="w-6 h-6 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </span>
                            <span className="font-bold text-lg font-serif tracking-wide text-gray-900">Government Orders</span>
                        </Link>
                        <Link href="/academic-calendar" className="flex items-center justify-center p-4 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 transition-all group backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1">
                            <span className="p-3 bg-white rounded-full group-hover:scale-110 transition-transform mr-4 shadow-md">
                                <svg className="w-6 h-6 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </span>
                            <span className="font-bold text-lg font-serif tracking-wide text-gray-900">Academic Calendar</span>
                        </Link>
                        <Link href="/important-links" className="flex items-center justify-center p-4 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 transition-all group backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1">
                            <span className="p-3 bg-white rounded-full group-hover:scale-110 transition-transform mr-4 shadow-md">
                                <svg className="w-6 h-6 text-[#138808]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            </span>
                            <span className="font-bold text-lg font-serif tracking-wide text-gray-900">Important Links</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* LEADERSHIP CAROUSEL */}
            <div className="bg-gradient-to-b from-orange-50 to-white">
                <LeadershipCarousel messages={messages} />
            </div>

            {/* EMPLOYEE VOICES / FEEDBACK SECTION (Moved) */}
            {/* Voice of Unity (Grievances) Section - PREMIUM TRICOLOR DESIGN */}
            <section className="relative py-24 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 via-white to-green-50/50 z-0"></div>
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

                {/* Floating Elements for Texture */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF9933] opacity-5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#138808] opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-[#E65100] text-xs font-bold tracking-widest uppercase mb-4 border border-orange-200 shadow-sm">
                            Platform for Change
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-serif tracking-tight">
                            {voiceInfo.title}
                        </h2>

                        <div className="flex items-center justify-center gap-2 mb-8">
                            <div className="h-1.5 w-16 bg-[#FF9933] rounded-full"></div>
                            <div className="h-1.5 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-1.5 w-16 bg-[#138808] rounded-full"></div>
                        </div>

                        <p className="text-center text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed font-light">
                            {feedbacks.length > 0
                                ? (voiceConfig.placeholder_title || "Real experiences from our members serving the nation.")
                                : voiceInfo.subtitle}
                        </p>
                    </div>

                    {/* Feedbacks Carousel or Empty State */}
                    {feedbacks && feedbacks.length > 0 ? (
                        <FeedbacksSection feedbacks={feedbacks} />
                    ) : (
                        <div className="text-center py-16 mb-12 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm max-w-3xl mx-auto relative overflow-hidden group hover:border-[#FF9933]/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-50 rounded-tr-full opacity-50 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                                    <svg className="w-10 h-10 text-gray-400 group-hover:text-[#FF9933] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No feedbacks shared yet</h3>
                                <p className="text-gray-500 font-medium">{voiceConfig.empty_message || "Be the first to share your voice!"}</p>
                            </div>
                        </div>
                    )}


                    {/* CTA Section - The "We will solve it" focus */}
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-[#138808] to-[#0B5C04] p-1 rounded-2xl shadow-2xl transform transition-transform hover:scale-[1.02]">
                            <div className="bg-white rounded-[13px] px-8 py-10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Have a Grievance? We Will Solve It.</h3>
                                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                    Your issues are our priority. Submit your grievance securely and we guarantee a response.
                                </p>

                                <button
                                    onClick={() => {
                                        if (auth.user) {
                                            setShowFeedbackModal(true);
                                        } else {
                                            router.visit('/login');
                                        }
                                    }}
                                    className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#FF9933] to-[#E65100] font-serif rounded-full focus:outline-none hover:shadow-lg hover:shadow-orange-500/30 transform active:scale-95"
                                >
                                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                    <span className="relative flex items-center gap-3 text-lg">
                                        {voiceConfig.button_text || "Submit Your Grievance"}
                                        <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                </button>

                                {!auth.user && (
                                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-full inline-block mx-auto">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">{voiceConfig.auth_note || "Authenticated Members only"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACHIEVEMENTS SECTION (Re-styled wrapper) */}
            <div className="border-t border-gray-100">
                <AchievementsSection achievements={achievements} />
            </div>

            {/* WHAT WE DO (Mission Cards) */}
            <section
                className="py-16 sm:py-20 relative overflow-hidden"
                style={{ backgroundColor: '#fff' }}
            >
                {/* Subtle Ashoka Chakra Watermark */}
                <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
                    <svg className="w-[400px] h-[400px] animate-spin-slow" viewBox="0 0 24 24" fill="#6B7280"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 bg-orange-50 text-[#FF9933] border border-orange-100 rounded-full text-xs font-bold tracking-widest uppercase mb-3">Our Core Mandate</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2937] mb-4 font-serif">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">
                                {missionInfo.title}
                            </span>
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mx-auto rounded-full mb-4"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                            {missionInfo.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {missionCards.length > 0 ? missionCards.map((card, idx) => (
                            <ServiceCard
                                key={idx}
                                icon={card.icon}
                                title={card.title}
                                description={card.description}
                                index={idx}
                            />
                        )) : (
                            <div className="col-span-4 text-center text-gray-500 italic bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300">
                                Mission services will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ORGANIZATIONAL STRUCTURE */}
            <section
                className="py-16 sm:py-20 bg-gray-50"
                style={{ backgroundColor: getSettings('structure').bg_color || '#f9fafb' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-serif">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">
                                {structureInfo.title}
                            </span>
                        </h2>
                        <div className="h-1 w-24 bg-gray-300 mx-auto rounded-full mb-4"></div>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                            {structureInfo.subtitle}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {structure.map((level, idx) => (
                            <HierarchyLevel
                                key={idx}
                                level={level.level}
                                color={level.color || 'border-gray-300'}
                                description={level.description}
                                scope={level.scope}
                                index={idx}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* MEMBER JOURNEY */}
            <section
                className="py-16 sm:py-20 bg-white"
                style={{ backgroundColor: getSettings('journey').bg_color || '#ffffff' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 bg-green-50 text-[#138808] border border-green-100 rounded-full text-xs font-bold tracking-widest uppercase mb-3">Path to Leadership</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-serif">
                            {journeyInfo.title}
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mx-auto rounded-full mb-4"></div>
                        <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            {journeyInfo.subtitle}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#FF9933] via-[#ffffff] to-[#138808] opacity-30"></div>
                            <div className="space-y-12">
                                {journey.map((step, idx) => (
                                    <JourneyStep
                                        key={idx}
                                        number={step.number}
                                        title={step.title}
                                        description={step.description}
                                        timeline={step.timeline}
                                        position={step.position || (idx % 2 === 0 ? 'left' : 'right')}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DIGITAL FEATURES */}
            <section
                className="py-16 sm:py-20 relative overflow-hidden transition-all duration-500"
                style={{
                    background: 'linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)'
                }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                {/* White Overlay for Readability */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 font-serif text-gray-900 drop-shadow-sm">
                            {featuresInfo.title}
                        </h2>
                        <div className="h-1 w-24 bg-gray-800 mx-auto rounded-full mb-4"></div>
                        <p className="text-center text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                            {featuresInfo.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <DigitalFeature
                                key={idx}
                                icon={feature.title.includes('ID Card') ? (
                                    <svg className="w-12 h-12 mx-auto text-[#FF9933] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                ) : feature.title.includes('Voting') ? (
                                    <svg className="w-12 h-12 mx-auto text-[#138808] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                ) : feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </section>



            {/* ABOUT / FOOTER PREVIEW */}
            <section
                className="py-16 sm:py-20"
                style={{ backgroundColor: getSettings('about').bg_color || '#f9fafb' }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 font-serif">
                        {aboutInfo.title}
                    </h2>
                    <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed text-justify px-4 md:px-0">
                        <p>{aboutText}</p>
                    </div>

                    <div className="mt-12 flex justify-center gap-6">
                        <Link href="/about" className="text-[#FF9933] font-bold text-lg hover:text-[#e08020] transition flex items-center gap-2">
                            Read Constitution <span className="text-xl">&rarr;</span>
                        </Link>
                        <Link href="/contact" className="text-[#138808] font-bold text-lg hover:text-[#0f6b06] transition flex items-center gap-2">
                            Contact Us <span className="text-xl">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
                <div className="bg-gradient-to-r from-union-primary to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <h2 className="text-3xl font-bold mb-4 relative z-10">Start Your Journey Today</h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto relative z-10">Join thousands of colleagues making a difference.</p>
                    <Link
                        href="/register"
                        className="inline-block bg-white text-union-primary font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg relative z-10"
                    >
                        Become a Member
                    </Link>
                </div>
            </div>


            {/* Global Footer */}
            <PublicFooter
                officeProfile={officeProfile}
                content={footerConfig}
            />

            {/* Grievance Submission Modal */}
            {
                showFeedbackModal && auth.user && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-[#138808]">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    Submit Grievance / Feedback
                                </h3>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    post(route('grievances.store'), {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setShowFeedbackModal(false);
                                            reset();
                                        }
                                    });
                                }}
                                className="p-6 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#138808] focus:border-[#138808] transition-shadow bg-gray-50 focus:bg-white"
                                        placeholder="Brief subject of your grievance"
                                        required
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600 font-medium">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#138808] focus:border-[#138808] transition-shadow bg-gray-50 focus:bg-white"
                                    >
                                        <option value="Other">Other</option>
                                        <option value="Transfer">Transfer</option>
                                        <option value="Pay Related">Pay Related</option>
                                        <option value="Harassment">Harassment</option>
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-600 font-medium">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#138808] focus:border-[#138808] transition-shadow bg-gray-50 focus:bg-white resize-none"
                                        placeholder="Share your thoughts, suggestions, or experiences..."
                                        required
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-6 py-3 bg-[#138808] text-white rounded-lg hover:bg-green-800 font-semibold transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Grievance'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowFeedbackModal(false); reset(); }}
                                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// ------------------- INLINE COMPONENTS (Reused) ------------------- //

// ------------------- INLINE COMPONENTS (Reused) ------------------- //

function ServiceCard({ icon, title, description, index }) {
    const borderColor = index % 3 === 0 ? 'border-[#FF9933]' : index % 3 === 1 ? 'border-[#FFFFFF]' : 'border-[#138808]';
    return (
        <div className={`bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 ${borderColor} hover:-translate-y-2 group`}>
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">{icon}</div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif group-hover:text-[#FF9933] transition-colors">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
        </div>
    );
}

function HierarchyLevel({ level, color, description, scope, index }) {
    return (
        <div className={`bg-white border-l-4 ${color === 'border-gray-300' ? 'border-[#1F2937]' : color} p-5 rounded-r-lg shadow-md hover:shadow-lg hover:translate-x-2 transition-all flex items-center gap-4`}>
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 font-bold border border-gray-200 shrink-0">
                {index + 1}
            </div>
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-gray-900 font-serif">{level}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${scope === 'State' ? 'bg-orange-100 text-orange-800' : scope === 'District' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {scope}
                    </span>
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}

function JourneyStep({ number, title, description, timeline, position, index }) {
    // Tricolor border logic
    const borderColor = index % 3 === 0 ? 'border-[#FF9933]' : index % 3 === 1 ? 'border-gray-300' : 'border-[#138808]';

    return (
        <div className={`relative flex flex-col md:flex-row items-center ${position === 'left' ? 'md:flex-row-reverse' : ''}`}>
            <div className="hidden md:block w-1/2"></div>

            {/* Center Node */}
            <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#1F2937] font-bold z-10 border-4 border-[#FF9933] shadow-lg text-sm transition-transform hover:scale-125`}>
                {number}
            </div>

            <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${position === 'left' ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-t-4 ${borderColor} group`}>
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600 mb-2 uppercase tracking-wide group-hover:bg-[#138808] group-hover:text-white transition-colors">
                        {timeline}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
}

function DigitalFeature({ icon, title, description }) {
    return (
        <div className="text-center p-6 bg-white/80 rounded-xl transition-all hover:bg-white shadow-lg backdrop-blur-md border border-white/50 group hover:-translate-y-2">
            <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-sm">{icon}</div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg font-serif tracking-wide">{title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">{description}</p>
        </div>
    );
}
