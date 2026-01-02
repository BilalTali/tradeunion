import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { props } = usePage();
    const officeProfile = props.office_profile;
    const theme = officeProfile?.theme_preferences || {};

    const containerStyle = {
        fontFamily: theme.font_family || undefined
    };

    const gradientStyle = {
        background: theme.gradient_start && theme.gradient_end
            ? `linear-gradient(to bottom right, ${theme.gradient_start}, ${theme.gradient_middle || theme.gradient_end}, ${theme.gradient_end})`
            : undefined
    };

    return (
        <div className="min-h-screen bg-gray-50 flex" style={containerStyle}>
            {/* Left Side - Branding & Hero Section (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#FF9933] via-[#ffffff] to-[#138808] relative overflow-hidden"
                style={gradientStyle}>

                {/* Ashoka Chakra Watermark - Centered Gray */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                    <svg className="w-[600px] h-[600px] animate-spin-slow" viewBox="0 0 24 24" fill="#D1D5DB" stroke="#D1D5DB">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                        <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" strokeWidth="0.5" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center px-12 py-16 text-gray-900 w-full">
                    {/* Logo Section */}
                    <div className="mb-8">
                        {officeProfile?.primary_logo_path ? (
                            <img
                                src={`/storage/${officeProfile.primary_logo_path}`}
                                alt={officeProfile.organization_name || 'Organization Logo'}
                                className="h-40 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border-4 border-gray-900">
                                <ApplicationLogo className="h-20 w-20 text-gray-900" />
                            </div>
                        )}
                    </div>

                    {/* Organization Name & Tagline */}
                    <div className="text-center max-w-md">
                        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-sm font-serif tracking-wide text-gray-900">
                            {officeProfile?.organization_name || 'Trade Union Portal'}
                        </h1>
                        <p className="text-xl font-bold mb-8 uppercase tracking-wider text-gray-800">
                            {officeProfile?.short_name || 'Official Member Portal'}
                        </p>
                        <div className="w-24 h-1.5 bg-gray-900 mx-auto mb-8 rounded-full"></div>

                        {/* Mission Statement */}
                        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border-l-4 border-gray-900 shadow-lg">
                            <p className="text-lg font-semibold leading-relaxed italic text-gray-900">
                                &ldquo;Strengthening Educators. Protecting Rights. Building Unity.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 flex items-center gap-6 text-sm font-bold text-gray-900 bg-white/30 px-6 py-2 rounded-full backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Secure & Encrypted</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Official Gov Portal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Background Decoration */}
                <div className="lg:hidden absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

                <div className="w-full max-w-md">
                    {/* Mobile Logo (shown only on mobile) */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            {officeProfile?.primary_logo_path ? (
                                <img
                                    src={`/storage/${officeProfile.primary_logo_path}`}
                                    alt={officeProfile.organization_name || 'Organization Logo'}
                                    className="h-24 w-auto mx-auto mb-4 drop-shadow-lg"
                                />
                            ) : (
                                <ApplicationLogo className="h-16 w-16 mx-auto mb-4 text-gray-900" />
                            )}
                        </Link>
                        <h2 className="text-2xl font-extrabold text-gray-900 font-serif uppercase tracking-wide">
                            {officeProfile?.short_name || 'Trade Union Portal'}
                        </h2>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] px-8 py-10 border-t-8 border-[#FF9933] border-b-8 border-[#138808]">
                        {children}
                    </div>

                    {/* Footer Help Text */}
                    <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                        <p>&copy; {new Date().getFullYear()} {officeProfile?.organization_name || 'JKECC'}.</p>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
            `}} />
        </div>
    );
}
