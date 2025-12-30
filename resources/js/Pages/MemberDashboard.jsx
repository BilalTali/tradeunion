import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function MemberDashboard({ auth, member, announcements, blogs, activeElections }) {
    const user = auth.user;
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleVoteClick = (electionId) => {
        // Prototype logic for Live Photo Voting
        if (confirm("To vote, we need to verify your identity with a Live Photo. Allow camera access?")) {
            setIsCameraOpen(true);
        }
    };

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800">Member Dashboard</h2>
                    <p className="text-sm text-gray-600 mt-1">Welcome, {user.name}</p>
                </div>
            }
        >
            <Head title="Member Dashboard" />

            {/* Live Photo Modal Prototype */}
            {isCameraOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
                        <div className="w-full h-64 bg-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                            <p className="text-gray-400 animate-pulse">Initializing Camera...</p>
                            {/* Simulated Camera Feed */}
                            <div className="absolute inset-0 border-4 border-dashed border-union-primary opacity-50 m-8 rounded-lg"></div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Verify Identity</h3>
                        <p className="text-sm text-gray-600 mb-6">Please look at the camera to proceed with voting.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setIsCameraOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Photo captured! Redirecting to ballot...');
                                    setIsCameraOpen(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
                            >
                                🔴 Capture & Vote
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-union-primary to-blue-800 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Hello, {user.name}! 👋</h1>
                            <p className="text-blue-100 mb-6 max-w-2xl">
                                Welcome to your union portal. Access your I-Card, check updates, and participate in union elections from here.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={route('profile.edit')}
                                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center"
                                >
                                    <span>⚙️ Account Settings</span>
                                </Link>
                                <span className="bg-white text-union-primary font-bold px-4 py-2 rounded-lg shadow-sm flex items-center border border-gray-200">
                                    <span className={`w-3 h-3 rounded-full mr-2 ${member?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    Status: {member?.status?.toUpperCase() || 'UNKNOWN'}
                                </span>
                            </div>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Updates */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Notifications / Announcements */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">📢 Notifications</h3>
                                </div>
                                <div className="space-y-4">
                                    {announcements && announcements.length > 0 ? (
                                        announcements.map((announcement) => (
                                            <div key={announcement.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition border border-gray-100">
                                                <div className="flex-shrink-0 text-2xl">📣</div>
                                                <div>
                                                    <Link href={route('posts.show', announcement.slug)}>
                                                        <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition">{announcement.title}</h4>
                                                    </Link>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {announcement.excerpt || announcement.content?.replace(/<[^>]+>/g, '')}
                                                    </p>
                                                    <span className="text-xs text-gray-400 mt-2 block">{new Date(announcement.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No new notifications</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Latest Blogs */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">📰 Latest News</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {blogs && blogs.length > 0 ? (
                                        blogs.map((blog) => (
                                            <div key={blog.id} className="group cursor-pointer">
                                                <div className="aspect-video bg-gray-200 rounded-xl mb-3 overflow-hidden">
                                                    <img
                                                        src={blog.featured_image ? `/storage/${blog.featured_image}` : 'https://via.placeholder.com/400x200'}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    />
                                                </div>
                                                <Link href={route('posts.show', blog.slug)}>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-union-primary transition">{blog.title}</h4>
                                                </Link>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.excerpt}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-8 text-gray-400">
                                            <p>No recent news articles</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Key Actions */}
                        <div className="space-y-8">

                            {/* I-Card Widget */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-red-100"></div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 relative z-10">🆔 Digital I-Card</h3>

                                <div className="aspect-[1.58/1] bg-white rounded-xl mb-4 relative overflow-hidden shadow-lg border border-gray-200">
                                    {/* Card Header */}
                                    <div className="bg-red-600 h-1/4 w-full flex items-center justify-between px-3">
                                        <div className="text-white text-[10px] font-bold leading-tight">
                                            J&K EMPLOYEES<br />ASSOCIATION
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-red-600">
                                            LOGO
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 flex gap-3 h-3/4">
                                        {/* Photo - Placeholder or Real */}
                                        <div className="w-20 h-24 bg-gray-200 border border-gray-300 flex-shrink-0">
                                            {member?.photo_path ? (
                                                <img src={`/storage/${member.photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Photo</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1 text-[10px] w-full">
                                            <div className="font-bold text-sm text-gray-900 leading-tight">{member?.name || user.name}</div>
                                            <div className="grid grid-cols-2 gap-x-1">
                                                <span className="text-gray-500">Desig:</span>
                                                <span className="font-semibold truncate" title={member?.active_commission_role || member?.designation}>
                                                    {member?.active_commission_role || member?.designation || 'Member'}
                                                </span>

                                                <span className="text-gray-500">ID:</span>
                                                <span className="font-semibold text-red-600 truncate">{member?.membership_id || 'PENDING'}</span>

                                                <span className="text-gray-500">Dist:</span>
                                                <span className="font-semibold truncate">{member?.tehsil?.district?.name || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overlay Action */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl z-20">
                                        <a
                                            href={`/members/${member?.id}/icard/download`}
                                            target="_blank"
                                            className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition"
                                        >
                                            Download PDF
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Card No:</span>
                                        <span className="font-mono font-bold text-gray-800">{member?.membership_id || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">tehsil:</span>
                                        <span className="font-medium text-gray-800">{member?.tehsil?.name || 'N/A'}</span>
                                    </div>
                                </div>

                                <a
                                    href={`/members/${member?.id}/icard/download`}
                                    className="block w-full text-center bg-gray-900 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-gray-800 transition shadow-lg"
                                >
                                    Download I-Card
                                </a>
                            </div>

                            {/* Active Elections / Voting */}
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">🗳️</span>
                                    <h3 className="text-lg font-bold">Active Elections</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Success Message Banner */}
                                    {new URLSearchParams(window.location.search).get('vote_cast') === '1' && (
                                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                            <strong className="font-bold">Success! </strong>
                                            <span className="block sm:inline">You have casted your vote thank u.</span>
                                        </div>
                                    )}

                                    {activeElections && activeElections.length > 0 ? (
                                        activeElections.map((election) => (
                                            <div key={election.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                                <h4 className="font-bold text-white mb-1">{election.title}</h4>
                                                <p className="text-xs text-indigo-100 mb-3">Ends: {new Date(election.voting_end).toLocaleDateString()}</p>

                                                {election.has_voted ? (
                                                    <button
                                                        disabled
                                                        className="w-full bg-green-500/50 text-white font-bold py-2 rounded-lg cursor-not-allowed text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <span>✅</span> Already Voted
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href={route('elections.vote.show', election.id)}
                                                        className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-50 transition text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <span>📸</span> Vote Now
                                                    </Link>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 bg-white/10 rounded-xl border border-white/5">
                                            <p className="text-sm opacity-80">No active elections</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

