import { Link } from '@inertiajs/react';

export default function PublicFooter({ officeProfile, content, theme }) {
    // Content comes from CMS (text and JSON fields)
    const aboutText = content?.about_text || "Serving the teachers and employees of Jammu & Kashmir with dedication and integrity.";
    const copyrightText = content?.copyright_text || `\u00A9 ${new Date().getFullYear()} ${officeProfile?.organization_name || 'JKECC'}. All rights reserved.`;

    // Parse links: Try JSON first, then fall back to "Label | URL" text format
    let helpfulLinks = [];
    try {
        if (typeof content?.useful_links === 'string') {
            const raw = content.useful_links.trim();
            if (raw.startsWith('[') || raw.startsWith('{')) {
                helpfulLinks = JSON.parse(raw);
            } else {
                // Parse "Label | URL" lines
                helpfulLinks = raw.split('\n')
                    .map(line => {
                        const parts = line.split('|');
                        if (parts.length >= 2) {
                            return { label: parts[0].trim(), url: parts[1].trim() };
                        }
                        return null;
                    })
                    .filter(Boolean);
            }
        } else if (Array.isArray(content?.useful_links)) {
            helpfulLinks = content.useful_links;
        } else {
            // Default Fallback
            helpfulLinks = [
                { label: 'About Us', url: '/about' },
                { label: 'Contact', url: '/contact' },
                { label: 'Member Login', url: '/login' },
                { label: 'Privacy Policy', url: '/privacy-policy' }
            ];
        }
    } catch (e) {
        helpfulLinks = [];
    }

    return (
        <footer className="relative text-white pt-16 pb-8 overflow-hidden" style={{ backgroundColor: content?.settings?.bg_color || '#111827' }}>

            {/* Tricolor Border Top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FF9933 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Organization Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            {/* Logo or Icon */}
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,153,51,0.5)]">
                                <span className="text-2xl">🏛️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] font-serif uppercase">
                                    {officeProfile?.short_name || officeProfile?.organization_name || 'JKECC'}
                                </h3>
                                <div className="h-0.5 w-16 bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] mt-1"></div>
                            </div>
                        </div>
                        <p className="text-white text-sm leading-relaxed border-l-2 border-[#138808] pl-4">
                            {aboutText}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] mb-6 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#FF9933] rounded-full"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {helpfulLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.url}
                                        className="text-white hover:text-[#FF9933] transition-colors flex items-center gap-2 group text-sm"
                                    >
                                        <span className="text-[#138808] group-hover:translate-x-1 transition-transform">&rsaquo;</span>
                                        <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] mb-6 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            Contact Us
                        </h4>
                        <div className="space-y-4 text-sm text-white">
                            {officeProfile?.full_address && (
                                <div className="flex items-start gap-3">
                                    <span className="text-[#FF9933] mt-1">📍</span>
                                    <p>{officeProfile.full_address}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <span className="text-white">📧</span>
                                <a href={`mailto:${officeProfile?.primary_email}`} className="hover:text-[#FF9933] transition-colors">
                                    {officeProfile?.primary_email || 'contact@example.com'}
                                </a>
                            </div>

                            {officeProfile?.phone_number && (
                                <div className="flex items-center gap-3">
                                    <span className="text-[#138808]">📞</span>
                                    <p>{officeProfile.phone_number}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 4: Newsletter / Social */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#138808] rounded-full"></span>
                            Stay Connected
                        </h4>
                        <p className="text-white text-sm mb-6">
                            Follow us on social media for the latest updates, circulars, and announcements.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            {/* Social Icons with Tricolor hovers */}
                            {[
                                { icon: 'facebook', color: 'hover:bg-[#1877F2]', text: 'hover:text-white', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                                { icon: 'twitter', color: 'hover:bg-black', text: 'hover:text-white', path: 'M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z' },
                                { icon: 'instagram', color: 'hover:bg-pink-600', text: 'hover:text-white', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                                { icon: 'youtube', color: 'hover:bg-[#FF0000]', text: 'hover:text-white', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                                { icon: 'linkedin', color: 'hover:bg-[#0077B5]', text: 'hover:text-white', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
                            ].map((social, i) => {
                                // Only render if URL is provided in content
                                const urlKey = `${social.icon}_url`;
                                const url = content?.[urlKey];
                                if (!url) return null;

                                return (
                                    <a
                                        key={i}
                                        href={url}
                                        className={`w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg ${social.color} ${social.text} transition-all duration-300 border border-white/20 hover:border-transparent backdrop-blur-sm`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d={social.path} />
                                        </svg>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 relative">
                    {/* Tricolor Border Top for Bottom Bar */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] opacity-50"></div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
                        {/* Left Side: Copyright */}
                        <div>
                            <p>{copyrightText}</p>
                        </div>

                        {/* Right Side: Developer Info */}
                        {content?.developed_by && (
                            <div className="text-white text-xs flex items-center gap-1">
                                <span>Developed by</span>
                                <span className="font-bold text-[#FF9933]">{content.developed_by}</span>
                                {content?.developed_by_url && (
                                    <>
                                        <span className="mx-1 text-white/50">-</span>
                                        <a
                                            href={content.developed_by_url.includes('http') ? content.developed_by_url : `tel:${content.developed_by_url}`}
                                            className="text-white hover:text-[#138808] transition-colors"
                                        >
                                            {content.developed_by_url}
                                        </a>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
