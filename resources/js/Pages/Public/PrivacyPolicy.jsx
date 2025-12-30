import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PublicNavbar />
            <Head>
                <title>Privacy Policy - J&K State Employees Association</title>
                <meta name="description" content="Privacy policy for JKTU portal. Learn how we collect, use, and protect your personal information." />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="bg-gray-900 text-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
                        <p className="text-gray-300">Last updated: December 27, 2025</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="prose prose-lg max-w-none">
                        {/* Introduction */}
                        <Section title="1. Introduction">
                            <p>
                                The Jammu & Kashmir State Employees Association ("JKTU", "we", "us", or "our") is committed to protecting
                                the privacy and security of your personal information. This Privacy Policy explains how we collect, use,
                                disclose, and safeguard your information when you use our portal.
                            </p>
                            <p>
                                By accessing or using the JKTU portal, you agree to the terms of this Privacy Policy. If you do not agree
                                with our policies and practices, please do not use our services.
                            </p>
                        </Section>

                        {/* Information We Collect */}
                        <Section title="2. Information We Collect">
                            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Personal Information</h3>
                            <p>We collect information that you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Full name, parentage, date of birth</li>
                                <li>Contact information (email address, phone number, residential address)</li>
                                <li>School/institution name and location</li>
                                <li>Membership ID and status</li>
                                <li>Photograph for ID card generation</li>
                                <li>Professional information (designation, subject, experience)</li>
                                <li>tehsil and district affiliation</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
                            <p>When you access our portal, we automatically collect:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>IP address and device information</li>
                                <li>Browser type and operating system</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website addresses</li>
                                <li>Login timestamps and activity logs</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">2.3 Election and Voting Information</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Voting verification data (OTP requests, verification status)</li>
                                <li>Live photographs during voting (for verification purposes)</li>
                                <li>Election participation records</li>
                                <li>Nomination and candidacy information</li>
                            </ul>
                        </Section>

                        {/* How We Use Your Information */}
                        <Section title="3. How We Use Your Information">
                            <p>We use the collected information for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Membership Management:</strong> Process registrations, generate ID cards, maintain member records</li>
                                <li><strong>Elections:</strong> Conduct fair and transparent elections, verify voter eligibility, prevent fraud</li>
                                <li><strong>Communication:</strong> Send important updates, announcements, and notifications</li>
                                <li><strong>Security:</strong> Detect and prevent unauthorized access, fraud, and abuse</li>
                                <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance user experience</li>
                                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
                                <li><strong>Committee Operations:</strong> Manage committees, resolutions, and democratic processes</li>
                            </ul>
                        </Section>

                        {/* Information Sharing */}
                        <Section title="4. Information Sharing and Disclosure">
                            <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.1 Within the Organization</h3>
                            <p>
                                Information is shared with authorized union officials (tehsil admins, district admins, state admins)
                                based on hierarchical access controls and need-to-know principles.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.2 Legal Requirements</h3>
                            <p>We may disclose information if required by law or in response to valid legal requests from authorities.</p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.3 Service Providers</h3>
                            <p>
                                We may share information with trusted third-party service providers who assist us in operating the portal
                                (e.g., hosting providers, email services), under strict confidentiality agreements.
                            </p>
                        </Section>

                        {/* Data Security */}
                        <Section title="5. Data Security">
                            <p>We implement industry-standard security measures to protect your information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Encryption:</strong> All data transmission is encrypted using HTTPS/TLS protocols</li>
                                <li><strong>Authentication:</strong> Multi-factor authentication for sensitive operations</li>
                                <li><strong>Access Controls:</strong> Role-based access with hierarchical permissions</li>
                                <li><strong>Audit Logs:</strong> Comprehensive logging of all system activities</li>
                                <li><strong>Regular Updates:</strong> Timely security patches and system updates</li>
                                <li><strong>Rate Limiting:</strong> Protection against automated attacks and abuse</li>
                            </ul>
                            <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                                <strong>Note:</strong> While we strive to protect your information, no method of transmission over the
                                internet is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </Section>

                        {/* Your Rights */}
                        <Section title="6. Your Rights">
                            <p>As a member, you have the following rights regarding your personal information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct incorrect information via your profile</li>
                                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal and organizational requirements)</li>
                                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                                <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, please contact your tehsil admin or reach out to our data protection officer
                                at <a href="mailto:privacy@jktu.gov.in" className="text-union-primary hover:text-red-700">privacy@jktu.gov.in</a>
                            </p>
                        </Section>

                        {/* Cookies and Tracking */}
                        <Section title="7. Cookies and Tracking Technologies">
                            <p>We use cookies and similar technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintain your session and keep you logged in</li>
                                <li>Remember your preferences and settings</li>
                                <li>Analyze site traffic and usage patterns</li>
                                <li>Prevent fraud and enhance security</li>
                            </ul>
                            <p className="mt-4">
                                You can control cookie settings through your browser preferences. Note that disabling cookies may affect
                                your ability to use certain features of the portal.
                            </p>
                        </Section>

                        {/* Data Retention */}
                        <Section title="8. Data Retention">
                            <p>We retain your personal information for as long as:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your membership is active</li>
                                <li>Required for organizational record-keeping</li>
                                <li>Necessary to comply with legal obligations</li>
                                <li>Needed to resolve disputes or enforce agreements</li>
                            </ul>
                            <p className="mt-4">
                                Voting and election records are retained permanently for transparency and historical purposes,
                                but personal identifiers may be anonymized after a specified period.
                            </p>
                        </Section>

                        {/* Children's Privacy */}
                        <Section title="9. Children's Privacy">
                            <p>
                                Our portal is not intended for individuals under the age of 18. We do not knowingly collect personal
                                information from children. If we become aware that a child has provided us with personal information,
                                we will take steps to delete such information.
                            </p>
                        </Section>

                        {/* Changes to Privacy Policy */}
                        <Section title="10. Changes to This Privacy Policy">
                            <p>
                                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                                operational, or regulatory reasons. We will notify you of any material changes by:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Posting the updated policy on this page</li>
                                <li>Updating the "Last Updated" date</li>
                                <li>Sending email notifications for significant changes</li>
                            </ul>
                            <p className="mt-4">
                                Your continued use of the portal after changes become effective constitutes acceptance of the updated policy.
                            </p>
                        </Section>

                        {/* Contact Information */}
                        <Section title="11. Contact Us">
                            <p>If you have questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:</p>
                            <div className="bg-gray-50 rounded-lg p-6 mt-4">
                                <p className="font-semibold">J&K State Employees Association</p>
                                <p>Data Protection Officer</p>
                                <p>Employees Bhawan, Srinagar, J&K</p>
                                <p className="mt-2">Email: <a href="mailto:privacy@jktu.gov.in" className="text-union-primary hover:text-red-700">privacy@jktu.gov.in</a></p>
                                <p>Phone: +91-XXXX-XXXXXX</p>
                            </div>
                        </Section>

                        {/* Consent */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-8">
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Your Consent</h3>
                            <p className="text-blue-800">
                                By using the JKTU portal, you acknowledge that you have read, understood, and agree to the terms
                                outlined in this Privacy Policy. If you do not agree, please discontinue use of our services immediately.
                            </p>
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

