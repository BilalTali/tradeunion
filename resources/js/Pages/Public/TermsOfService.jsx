import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

export default function TermsOfService() {
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
                        <p className="text-gray-300">Last updated: December 27, 2025</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="prose prose-lg max-w-none">
                        {/* Introduction */}
                        <Section title="1. Acceptance of Terms">
                            <p>
                                By accessing and using the Jammu & Kashmir State Employees Association ("JKTU") portal, you accept and agree
                                to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                            <p>
                                These terms constitute a legally binding agreement between you and JKTU. We may update these terms from time
                                to time, and your continued use of the portal constitutes acceptance of any modifications.
                            </p>
                        </Section>

                        {/* Eligibility */}
                        <Section title="2. Eligibility and Membership">
                            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Who Can Use This Portal</h3>
                            <p>The JKTU portal is intended for:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Active and approved members of JKTU</li>
                                <li>Authorized union officials (tehsil, district, and state administrators)</li>
                                <li>Election commissioners and committee members</li>
                                <li>Prospective members during the registration process</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Age Requirement</h3>
                            <p>
                                You must be at least 18 years of age to register and use this portal. By using the portal, you represent
                                and warrant that you meet this requirement.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">2.3 Account Responsibility</h3>
                            <p>You are responsible for:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintaining the confidentiality of your login credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                                <li>Providing accurate and truthful information</li>
                            </ul>
                        </Section>

                        {/* Acceptable Use */}
                        <Section title="3. Acceptable Use Policy">
                            <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Permitted Uses</h3>
                            <p>You may use the portal to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access and manage your membership information</li>
                                <li>Participate in union elections and voting</li>
                                <li>Engage in committee activities and resolutions</li>
                                <li>Access announcements and union communications</li>
                                <li>View and download your digital ID card</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Prohibited Activities</h3>
                            <p>You must NOT:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Use the portal for any unlawful purpose</li>
                                <li>Attempt to manipulate elections or voting processes</li>
                                <li>Share your account credentials with others</li>
                                <li>Circumvent security measures or authentication processes</li>
                                <li>Submit false, misleading, or fraudulent information</li>
                                <li>Attempt to access other users' accounts or data</li>
                                <li>Upload malicious software or attempt to disrupt the system</li>
                                <li>Violate or infringe upon the rights of others</li>
                                <li>Use automated scripts or bots to access the portal</li>
                                <li>Reverse engineer or attempt to extract source code</li>
                            </ul>

                            <p className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                                <strong>⚠️ Warning:</strong> Violation of these prohibitions may result in immediate account suspension or
                                termination, loss of membership privileges, and potentially legal action.
                            </p>
                        </Section>

                        {/* Elections and Voting */}
                        <Section title="4. Elections and Voting">
                            <h3 className="text-xl font-semibold mt-4 mb-2">4.1 Election Integrity</h3>
                            <p>
                                JKTU is committed to conducting fair, transparent, and democratic elections. All election processes are
                                subject to strict rules and regulations designed to ensure integrity.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.2 Voter Responsibilities</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You may only vote once per election</li>
                                <li>You must complete the OTP verification process honestly</li>
                                <li>Live photo verification must be your own photo, taken in real-time</li>
                                <li>Votes are final and cannot be changed once submitted</li>
                                <li>You must not attempt to vote on behalf of others</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.3 Nomination and Candidacy</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nominations must be submitted truthfully and in good faith</li>
                                <li>Candidates must meet all eligibility requirements</li>
                                <li>False or fraudulent nominations will be rejected</li>
                                <li>Election commissioners have final authority on candidate approval</li>
                            </ul>
                        </Section>

                        {/* Data and Privacy */}
                        <Section title="5. Data Usage and Privacy">
                            <p>
                                Your use of the portal is also governed by our <Link href="/privacy-policy" className="text-union-primary hover:text-red-700">Privacy Policy</Link>,
                                which is incorporated by reference into these Terms of Service.
                            </p>
                            <p>By using the portal, you consent to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Collection and processing of your personal information as described in the Privacy Policy</li>
                                <li>Use of cookies and tracking technologies</li>
                                <li>Live photo capture during voting for verification purposes</li>
                                <li>Sharing of certain information with authorized union officials based on hierarchical access</li>
                            </ul>
                        </Section>

                        {/* Intellectual Property */}
                        <Section title="6. Intellectual Property">
                            <h3 className="text-xl font-semibold mt-4 mb-2">6.1 Ownership</h3>
                            <p>
                                All content, features, and functionality of the portal, including but not limited to text, graphics, logos,
                                software, and design, are owned by JKTU and protected by copyright, trademark, and other intellectual property laws.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">6.2 Limited License</h3>
                            <p>
                                We grant you a limited, non-exclusive, non-transferable license to access and use the portal for its intended
                                purposes as a member of JKTU. This license does not permit you to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Copy, modify, or create derivative works</li>
                                <li>Reverse engineer or decompile the software</li>
                                <li>Remove copyright or proprietary notices</li>
                                <li>Use the portal for commercial purposes</li>
                            </ul>
                        </Section>

                        {/* Disclaimers */}
                        <Section title="7. Disclaimers and Limitations">
                            <h3 className="text-xl font-semibold mt-4 mb-2">7.1 Service Availability</h3>
                            <p>
                                The portal is provided "as is" and "as available." We do not guarantee uninterrupted or error-free service.
                                We reserve the right to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Suspend or discontinue any part of the portal</li>
                                <li>Perform maintenance without prior notice</li>
                                <li>Modify features and functionality</li>
                                <li>Limit access during high-traffic periods (e.g., election days)</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">7.2 No Warranty</h3>
                            <p>
                                To the fullest extent permitted by law, JKTU disclaims all warranties, express or implied, including but
                                not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">7.3 Limitation of Liability</h3>
                            <p>
                                JKTU shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising
                                from your use of or inability to use the portal, even if we have been advised of the possibility of such damages.
                            </p>
                        </Section>

                        {/* Dispute Resolution */}
                        <Section title="8. Dispute Resolution and Grievances">
                            <h3 className="text-xl font-semibold mt-4 mb-2">8.1 Internal Grievance Mechanism</h3>
                            <p>
                                If you have a complaint or dispute related to the portal or union activities, you should first contact
                                your tehsil administrator or use the internal grievance mechanism.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">8.2 Governing Law</h3>
                            <p>
                                These Terms of Service are governed by and construed in accordance with the laws of Jammu & Kashmir and India.
                                Any disputes shall be subject to the exclusive jurisdiction of courts in Srinagar, J&K.
                            </p>
                        </Section>

                        {/* Termination */}
                        <Section title="9. Account Termination">
                            <h3 className="text-xl font-semibold mt-4 mb-2">9.1 Termination by You</h3>
                            <p>
                                You may request account termination by contacting your tehsil administrator or the state office. Note that
                                terminating your portal account does not automatically terminate your union membership.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">9.2 Termination by JKTU</h3>
                            <p>We may suspend or terminate your account immediately, without prior notice, if:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You violate these Terms of Service</li>
                                <li>Your membership status changes (suspended, resigned, deceased)</li>
                                <li>We detect fraudulent or malicious activity</li>
                                <li>Required by law or regulatory authority</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">9.3 Effect of Termination</h3>
                            <p>Upon termination:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your access to the portal will be immediately revoked</li>
                                <li>Your data may be retained as per our Privacy Policy and legal requirements</li>
                                <li>Historical records (votes, elections, resolutions) will be preserved for transparency</li>
                                <li>You must cease all use of any downloaded materials</li>
                            </ul>
                        </Section>

                        {/* Modifications */}
                        <Section title="10. Changes to Terms">
                            <p>
                                We reserve the right to modify these Terms of Service at any time. We will notify you of material changes by:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Posting the updated terms on this page with a new "Last Updated" date</li>
                                <li>Sending email notifications for significant changes</li>
                                <li>Displaying prominent notices on the portal</li>
                            </ul>
                            <p className="mt-4">
                                Your continued use of the portal after changes become effective constitutes your acceptance of the revised
                                terms. If you do not agree to the changes, you must stop using the portal.
                            </p>
                        </Section>

                        {/* Contact */}
                        <Section title="11. Contact Information">
                            <p>For questions about these Terms of Service, please contact us:</p>
                            <div className="bg-gray-50 rounded-lg p-6 mt-4">
                                <p className="font-semibold">J&K State Employees Association</p>
                                <p>Legal Department</p>
                                <p>Employees Bhawan, Srinagar, J&K</p>
                                <p className="mt-2">Email: <a href="mailto:legal@jktu.gov.in" className="text-union-primary hover:text-red-700">legal@jktu.gov.in</a></p>
                                <p>Phone: +91-XXXX-XXXXXX</p>
                            </div>
                        </Section>

                        {/* Severability */}
                        <Section title="12. Severability and Entire Agreement">
                            <h3 className="text-xl font-semibold mt-4 mb-2">12.1 Severability</h3>
                            <p>
                                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall
                                remain in full force and effect.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">12.2 Entire Agreement</h3>
                            <p>
                                These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and
                                JKTU regarding the use of the portal.
                            </p>
                        </Section>

                        {/* Acknowledgment */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-8">
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Your Acknowledgment</h3>
                            <p className="text-blue-800 mb-4">
                                By clicking "I Accept" during registration, logging into the portal, or using any of its features, you
                                acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                            <p className="text-sm text-blue-700">
                                If you have questions or concerns about these terms, please contact us before using the portal.
                            </p>
                        </div>

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

