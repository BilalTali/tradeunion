import PublicNavbar from '@/Components/PublicNavbar';
import { Head, Link } from '@inertiajs/react';

export default function About({ aboutContent }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FF9933] via-[#ffffff] via-[#ffffff] to-[#138808] relative">
            <PublicNavbar />
            <Head>
                <title>About Us - JKECC</title>
                <meta name="description" content="Learn about the Jammu and Kashmir Employees Coordination Committee (JKECC), our mission, values, and commitment to empowering educators across the state." />
            </Head>

            {/* Ashoka Chakra Watermark - Centered Fixed */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0">
                <svg className="w-[800px] h-[800px] animate-spin-slow" viewBox="0 0 24 24" fill="#000080">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" stroke="#000080" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="relative z-10 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-md font-serif tracking-wide">
                        About JKECC
                    </h1>
                    <p className="text-xl md:text-2xl text-[#000080] font-bold max-w-4xl mx-auto uppercase tracking-wider bg-white/60 backdrop-blur-sm py-4 rounded-xl shadow-sm border border-white/40 px-4">
                        JAMMU AND KASHMIR EMPLOYEES COORDINATION COMMITTEE
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="max-w-5xl mx-auto space-y-12">

                    {/* Mission Section (Dynamic Content) */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border-t-8 border-[#FF9933] border-b-8 border-[#138808]">
                        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808] mb-6 font-serif border-b-2 border-gray-100 pb-4">Our Mission</h2>
                        <div className="space-y-6 text-lg text-gray-800 leading-relaxed font-medium">
                            <p className="whitespace-pre-line">
                                {aboutContent?.content || "The Jammu and Kashmir Employees Coordination Committee (JKECC) is committed to representing and protecting the interests of employees across Jammu & Kashmir. We strive to create a supportive environment where educators can thrive professionally while maintaining their rights and dignity. Through democratic processes, transparent governance, and collective action, we ensure that every employee's voice is heard and their concerns are addressed at all levels—tehsil, district, and state."}
                            </p>
                        </div>
                    </div>

                    {/* Values Section */}
                    <section>
                        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808] mb-8 text-center bg-white/40 inline-block px-8 py-2 rounded-full backdrop-blur-sm">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ValueCard
                                title="Democracy"
                                description="Fair and transparent elections at every level ensure true representation of our members."
                                icon="⚖️"
                                borderColor="border-[#FF9933]"
                            />
                            <ValueCard
                                title="Unity"
                                description="We stand together as one voice, representing 50,000+ employees across J&K."
                                icon="🤝"
                                borderColor="border-[#138808]"
                            />
                            <ValueCard
                                title="Transparency"
                                description="All our processes, from elections to member management, are open and accountable."
                                icon="🔍"
                                borderColor="border-[#FF9933]"
                            />
                            <ValueCard
                                title="Progress"
                                description="Embracing digital transformation to serve our members better and more efficiently."
                                icon="🚀"
                                borderColor="border-[#138808]"
                            />
                        </div>
                    </section>

                    {/* Structure Section */}
                    <div className="bg-gradient-to-br from-[#FF9933] to-[#138808] text-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933] rounded-full opacity-20 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#138808] rounded-full opacity-20 blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                        <h2 className="text-3xl font-bold mb-8 relative z-10 border-b border-white/20 pb-4">Organizational Structure</h2>
                        <div className="space-y-6 relative z-10">
                            <div className="bg-white/10 p-6 rounded-xl border-l-4 border-[#FF9933]">
                                <h3 className="text-xl font-bold text-[#FF9933] mb-2">State/UT Level</h3>
                                <p className="text-gray-200">Statewide governance overseeing all districts and setting policy direction.</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-xl border-l-4 border-white">
                                <h3 className="text-xl font-bold text-white mb-2">District Level (4 Districts)</h3>
                                <p className="text-gray-200">Srinagar, Jammu, Anantnag, and Baramulla - coordinating regional initiatives.</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-xl border-l-4 border-[#138808]">
                                <h3 className="text-xl font-bold text-[#138808] mb-2">Tehsil Level (12 Tehsils)</h3>
                                <p className="text-gray-200">Local representation ensuring grassroots concerns reach decision-makers.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-10 text-center shadow-lg border-2 border-[#FF9933]">
                        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808] mb-4">Join Our Community</h2>
                        <p className="text-xl mb-8 text-gray-700 font-medium">
                            Be part of the largest and most active employees' union in J&K.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link
                                href="/contact"
                                className="inline-block bg-[#FF9933] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#e08520] transition shadow-lg hover:-translate-y-1"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/login"
                                className="inline-block bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-10 py-4 rounded-lg font-bold hover:shadow-xl transition shadow-lg hover:-translate-y-1"
                            >
                                Member Login
                            </Link>
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

function ValueCard({ title, description, icon, borderColor }) {
    return (
        <div className={`bg-white/95 p-6 rounded-xl shadow-md border-t-4 ${borderColor || 'border-gray-200'} hover:scale-105 transition-transform duration-300`}>
            <div className="text-4xl mb-4 bg-gray-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</h3>
            <p className="text-gray-600 text-center leading-relaxed">{description}</p>
        </div>
    );
}
