import { Head } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

export default function Constitution({ constitutionPath, lastUpdated }) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PublicNavbar />
            <Head>
                <title>Constitution - J&K State Employees Association</title>
                <meta name="description" content="View and download the Constitution of J&K State Employees Association." />
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    :root {
                        --color-saffron: #FF9933;
                        --color-white: #ffffff;
                        --color-green: #138808;
                        --color-navy: #1F2937;
                    }
                `}</style>
            </Head>

            {/* Tricolor Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#FF9933] via-white to-[#138808] border-b-4 border-[#FF9933]">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block mb-4">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase bg-orange-100 text-[#FF9933] border border-orange-200">
                            📜 Official Document
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#000080] mb-4 font-serif">
                        Organization Constitution
                    </h1>
                    <div className="h-1.5 w-32 mx-auto rounded-full bg-[#FF9933]"></div>
                    <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
                        The foundational document governing our democratic union
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                {/* PDF Viewer / Download Section */}
                <div className="px-4 sm:px-0">
                    {constitutionPath ? (
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg border-t-4 border-[#FF9933]">
                            <div className="p-6 bg-white">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Official Constitution Document
                                        </h2>
                                        {lastUpdated && (
                                            <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Last updated: {new Date(lastUpdated).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    <a
                                        href={`/storage/${constitutionPath}`}
                                        download
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#e08520] hover:from-[#e08520] hover:to-[#FF9933] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download PDF
                                    </a>
                                </div>

                                <div className="aspect-w-16 aspect-h-9 h-[800px] bg-gray-100 rounded-lg border-2 border-gray-200 shadow-inner">
                                    <iframe
                                        src={`/storage/${constitutionPath}#toolbar=0`}
                                        className="w-full h-full rounded-lg"
                                        title="Constitution PDF"
                                    >
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-gray-500">
                                                Your browser does not support PDF embedding.
                                                <a href={`/storage/${constitutionPath}`} className="text-[#FF9933] underline ml-1 font-semibold hover:text-[#e08520]">
                                                    Download the PDF here
                                                </a>.
                                            </p>
                                        </div>
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-12 text-center border-t-4 border-gray-300">
                            <div className="max-w-md mx-auto">
                                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1 mb-6">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Document Not Available</h3>
                                <p className="text-gray-600 mb-6">
                                    The official constitution has not been uploaded yet. Please check back later or contact the administration.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center px-6 py-3 bg-[#FF9933] hover:bg-[#e08520] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Contact Administration
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
