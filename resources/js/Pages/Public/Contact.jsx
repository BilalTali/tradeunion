import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

import { useState } from 'react';

export default function Contact({ stateProfile, districts }) {
    const [expandedDistrict, setExpandedDistrict] = useState(null);

    const toggleDistrict = (id) => {
        if (expandedDistrict === id) {
            setExpandedDistrict(null);
        } else {
            setExpandedDistrict(id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FF9933] via-[#ffffff] via-[#ffffff] to-[#138808] relative">
            <PublicNavbar />
            <Head>
                <title>Contact Us - J&K State Employees Association</title>
                <meta name="description" content="Get in touch with JKTU. Contact information for state, district, and tehsil offices across Jammu & Kashmir." />
            </Head>

            {/* Ashoka Chakra Watermark - Centered Fixed */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0">
                <svg className="w-[800px] h-[800px] animate-spin-slow" viewBox="0 0 24 24" fill="#6B7280">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.34 6.34L5.28 5.28M18.72 18.72l-1.06-1.06M6.34 17.66L5.28 18.72M18.72 5.28l-1.06 1.06" stroke="#6B7280" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="relative z-10 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-md font-serif tracking-wide">
                        Contact Us
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-3xl mx-auto bg-white/60 backdrop-blur-sm py-4 rounded-xl shadow-sm border border-white/40">
                        We're here to help. Reach out to us for any queries or support.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Cards */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* State Office */}
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border-t-8 border-[#FF9933]">
                            <ContactCard
                                title={stateProfile?.organization_name || "State Office"}
                                level="J&K State Central Office"
                                address={stateProfile?.full_address || "Address to be updated"}
                                email={stateProfile?.primary_email || "state@jktu.gov.in"}
                                phone={stateProfile?.contact_numbers?.[0] || "Phone to be updated"}
                                icon={StateIcon}
                            />
                        </div>

                        {/* District & Tehsil Offices Directory */}
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-t-8 border-[#138808]">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808] mb-6 flex items-center">
                                <DistrictIcon />
                                District & Tehsil Offices Directory
                            </h2>

                            {districts && districts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {districts.map((district) => (
                                        <div key={district.id} className={`bg-gray-50 border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#FF9933] hover:shadow-md flex flex-col ${expandedDistrict === district.id ? 'md:col-span-2 shadow-lg ring-1 ring-[#FF9933] bg-orange-50/10' : ''}`}>
                                            {/* District Header (Clickable) */}
                                            <div
                                                onClick={() => toggleDistrict(district.id)}
                                                className={`p-5 cursor-pointer flex items-center justify-between transition-colors ${expandedDistrict === district.id ? 'bg-orange-50' : 'bg-white hover:bg-orange-50/30'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-3 h-3 rounded-full shadow-sm ${expandedDistrict === district.id ? 'bg-[#FF9933] ring-2 ring-orange-200' : 'bg-[#138808]'}`}></span>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">{district.name} District</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">
                                                            {district.office_profile?.full_address || 'Click to view details'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {/* Quick Contact Icons (Visible when collapsed) */}
                                                    {district.office_profile?.primary_email && expandedDistrict !== district.id && (
                                                        <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                            <span>✉️</span>
                                                        </div>
                                                    )}
                                                    <button className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${expandedDistrict === district.id ? 'bg-[#FF9933] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-[#FF9933] hover:text-white'}`}>
                                                        <svg className={`w-5 h-5 transition-transform duration-300 ${expandedDistrict === district.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expandable Content */}
                                            {expandedDistrict === district.id && (
                                                <div className="border-t border-gray-200 bg-white p-6 animate-fade-in flex-1">
                                                    {/* Full District Details */}
                                                    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shrink-0">📍</div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Office Address</p>
                                                                <p className="text-gray-800 text-sm font-medium leading-relaxed">{district.office_profile?.full_address || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">📧</div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                                                    <a href={`mailto:${district.office_profile?.primary_email}`} className="text-[#138808] font-bold text-sm hover:underline block break-all">
                                                                        {district.office_profile?.primary_email || 'N/A'}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl shrink-0">📞</div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                                                    <a href={`tel:${district.office_profile?.contact_numbers?.[0]}`} className="text-gray-800 font-bold text-sm hover:text-[#FF9933] block">
                                                                        {district.office_profile?.contact_numbers?.[0] || 'N/A'}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tehsils Grid */}
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                            <span className="text-[#138808]">🏢</span> Tehsil Offices
                                                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{district.tehsils?.length || 0} Offices</span>
                                                        </h4>
                                                        {district.tehsils && district.tehsils.length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {district.tehsils.map((tehsil) => (
                                                                    <div key={tehsil.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#FF9933] hover:shadow-md transition-all group relative overflow-hidden">
                                                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF9933] to-[#138808] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                        <div className="font-bold text-gray-900 mb-3 flex justify-between items-center">
                                                                            <span className="truncate" title={tehsil.name}>{tehsil.name}</span>
                                                                        </div>

                                                                        <div className="space-y-2.5 text-sm">
                                                                            <div className="flex items-start gap-2.5">
                                                                                <span className="text-gray-400 text-xs mt-0.5">📍</span>
                                                                                <span className="text-gray-600 text-xs truncate leading-relaxed">{tehsil.office_profile?.full_address || 'Address N/A'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2.5">
                                                                                <span className="text-gray-400 text-xs">📧</span>
                                                                                <a href={`mailto:${tehsil.office_profile?.primary_email}`} className="text-[#138808] hover:underline font-medium text-xs truncate block">
                                                                                    {tehsil.office_profile?.primary_email || 'Email N/A'}
                                                                                </a>
                                                                            </div>
                                                                            <div className="flex items-center gap-2.5">
                                                                                <span className="text-gray-400 text-xs">📞</span>
                                                                                <span className="text-gray-700 text-xs">{tehsil.office_profile?.contact_numbers?.[0] || 'Phone N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-300">No tehsils registered under this district.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    No district offices found in the directory.
                                </div>
                            )}
                        </div>

                        {/* Online Support */}
                        <div className="bg-gradient-to-r from-blue-50 to-white backdrop-blur-md border border-blue-100 rounded-2xl p-8 shadow-md">
                            <h2 className="text-xl font-extrabold text-gray-800 mb-3">For Members</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Already a member? Contact your tehsil admin directly through the portal for faster assistance.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:-translate-y-1"
                            >
                                Login to Portal
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-4 border-t-8 border-[#FF9933]">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Quick Links</h3>
                            <ul className="space-y-4">
                                <QuickLink href="/" text="Home" />
                                <QuickLink href="/about" text="About Us" />
                                <QuickLink href="/government-orders" text="Government Orders" />
                                <QuickLink href="/academic-calendar" text="Academic Calendar" />
                                <QuickLink href="/login" text="Member Login" />
                            </ul>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-xl">🕒</span> Office Hours
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-bold text-gray-800">10 AM - 5 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-bold text-gray-800">10 AM - 2 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-bold text-red-500">Closed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-xl">🆘</span> Emergency Contact
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">For urgent matters:</p>
                                <p className="text-xl font-extrabold text-[#FF9933]">+91-94XXXXXXX</p>
                                <p className="text-xs text-gray-400 mt-1">(Available 24/7)</p>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-b-8 border-[#138808]">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">FAQ</h2>
                            <div className="space-y-6">
                                <FAQ
                                    question="How do I become a member?"
                                    answer="Contact your tehsil admin to initiate the membership process."
                                />
                                <FAQ
                                    question="Update contact info?"
                                    answer="Login to the portal and update profile settings."
                                />
                                <FAQ
                                    question="Election queries?"
                                    answer="Contact your Election Commissioner."
                                />
                            </div>
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
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function ContactCard({ title, level, address, email, phone, icon: Icon }) {
    return (
        <div className="flex flex-col md:flex-row items-start gap-4">
            <Icon />
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
                <p className="text-sm font-semibold text-[#FF9933] mb-4 uppercase tracking-wider">{level}</p>
                <div className="space-y-3">
                    <div className="flex items-start">
                        <span className="text-xl mr-3">📍</span>
                        <span className="text-gray-700 font-medium">{address}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xl mr-3">📧</span>
                        <a href={`mailto:${email}`} className="text-[#138808] hover:underline font-bold">{email}</a>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xl mr-3">📞</span>
                        <a href={`tel:${phone}`} className="text-gray-800 hover:text-[#FF9933] font-bold">{phone}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DistrictContact({ name, email, phone }) {
    return (
        <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-4 hover:border-[#FF9933] hover:shadow-md transition duration-300">
            <h3 className="font-bold text-gray-800 mb-2">{name}</h3>
            <div className="space-y-1 text-sm">
                <a href={`mailto:${email}`} className="block text-[#138808] hover:underline font-medium">{email}</a>
                <a href={`tel:${phone}`} className="block text-gray-500 hover:text-gray-800">{phone}</a>
            </div>
        </div>
    );
}

function QuickLink({ href, text }) {
    return (
        <li>
            <Link
                href={href}
                className="text-gray-700 hover:text-[#FF9933] font-bold flex items-center group transition-colors"
            >
                <span className="mr-2 text-[#138808] group-hover:mr-3 transition-all">→</span>
                {text}
            </Link>
        </li>
    );
}

function FAQ({ question, answer }) {
    return (
        <div className="border-l-4 border-[#FF9933] pl-4">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">{question}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
    );
}

function StateIcon() {
    return (
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
            <span className="text-3xl">🏛️</span>
        </div>
    );
}

function DistrictIcon() {
    return (
        <div className="flex-shrink-0 w-10 h-10 bg-[#138808] rounded-full flex items-center justify-center mr-3 text-white shadow-md">
            <span>📍</span>
        </div>
    );
}

