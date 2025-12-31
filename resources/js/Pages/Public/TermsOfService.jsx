import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

export default function TermsOfService({ content }) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PublicNavbar />
            <Head>
                <title>Terms of Service - J&K State Employees Association</title>
                <meta name="description" content="Terms and conditions for using the JKTU portal. Please read carefully before accessing our services." />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="bg-gray-900 text-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
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
                                    return <div dangerouslySetInnerHTML={{ __html: content?.content || 'Terms content not available.' }} />;
                                }
                            } catch (e) {
                                return <p>Error loading content.</p>;
                            }
                        })()}

                        {/* Quick Links */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-3">Related Documents</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/privacy-policy"
                                    className="inline-flex items-center text-union-primary hover:text-red-700 font-medium"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center text-union-primary hover:text-red-700 font-medium"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Us
                                </Link>
                            </div>
                        </div>

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

