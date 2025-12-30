import { Link, usePage } from '@inertiajs/react'; // Add usePage
import { useState } from 'react';

export default function PublicNavbar() {
    const { props } = usePage();
    const officeProfile = props.office_profile;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                {officeProfile?.primary_logo_path ? (
                                    <img
                                        src={`/storage/${officeProfile.primary_logo_path}`}
                                        alt="Logo"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-union-primary rounded-full flex items-center justify-center text-white font-bold">
                                        {officeProfile?.short_name ? officeProfile.short_name.substring(0, 2).toUpperCase() : 'JK'}
                                    </div>
                                )}
                            </Link>
                            <span className="ml-3 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-lg sm:text-xl hidden sm:block uppercase tracking-tight">
                                {officeProfile?.organization_name || 'J&K Employees Assoc.'}
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                        <Link href="/" className="border-union-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/about" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            About
                        </Link>
                        <Link href="/contact" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Contact
                        </Link>
                        <div className="relative group">
                            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Resources
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <Link href="/constitution" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">Constitution</Link>
                                <Link href="/government-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">Government Orders</Link>
                                <Link href="/academic-calendar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">Academic Calendar</Link>
                                <Link href="/important-links" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600">Important Links</Link>
                            </div>
                        </div>

                        <Link href="/login" className="bg-union-primary text-white border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150 px-4 py-2 ml-4">
                            Login
                        </Link>
                    </div>
                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!isOpen ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={isOpen ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link href="/" className="bg-teal-50 border-teal-500 text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Home
                    </Link>
                    <Link href="/about" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        About
                    </Link>
                    <Link href="/contact" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Contact
                    </Link>
                    <Link href="/constitution" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Constitution
                    </Link>
                    <Link href="/government-orders" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Govt Orders
                    </Link>
                    <Link href="/academic-calendar" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Calendar
                    </Link>
                    <Link href="/important-links" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Important Links
                    </Link>

                    <Link href="/login" className="border-transparent text-gray-500 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
