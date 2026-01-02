import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

export default function PrivacyPolicy({ content }) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PublicNavbar />
            <Head>
                <title>Privacy Policy - JKECC</title>
                <meta name="description" content="Privacy policy for JKECC portal. Learn how we collect, use, and protect your personal information." />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="bg-gray-900 text-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
                        <p className="text-gray-300">{content?.subtitle || 'Last updated: December 27, 2025'}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="prose prose-lg max-w-none">
                        {/* Dynamic Rendering */}
                        {(() => {
                            try {
                                const sections = typeof content?.content === 'string' ? JSON.parse(content.content) : (content?.content || []);

                                if (Array.isArray(sections)) {
                                    return sections.map((section, idx) => (
                                        <Section key={idx} title={section.title}>
                                            <p className="whitespace-pre-line">{section.content}</p>
                                        </Section>
                                    ));
                                } else {
                                    // Fallback if not an array (e.g. simple text)
                                    return <div dangerouslySetInnerHTML={{ __html: content?.content || 'Policy content not available.' }} />;
                                }
                            } catch (e) {
                                return <p>Error loading content.</p>;
                            }
                        })()}

                        {/* Back to Home */}
                        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                            <Link
                                href="/"
                                className="inline-block bg-union-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition min-h-touch"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-union-primary inline-block pb-2">
                {title}
            </h2>
            <div className="text-gray-700 space-y-4">
                {children}
            </div>
        </section>
    );
}

