import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ChartBarIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    CalendarIcon,
    CheckBadgeIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function ElectionCommissionerDashboard({
    auth,
    activeElections = [],
    pendingCandidates = 0,
    pendingVoteVerifications = 0,
    completedElections = 0,
    recentActions = [],
    recentNominations = [], // New prop from controller
    userLevel = 'Tehsil', // tehsil, district, or state
    eligibleVotersCount = 0 // NEW: Total eligible voters across active elections
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Election Commission Dashboard
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Election Commissioner
                    </span>
                </div>
            }
        >
            <Head title="EC Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard
                            title="Active Elections"
                            value={activeElections.length}
                            icon={CalendarIcon}
                            color="blue"
                            onClick={() => document.getElementById('active-elections')?.scrollIntoView({ behavior: 'smooth' })}
                        />
                        <StatCard
                            title="Pending Candidates"
                            value={pendingCandidates}
                            icon={UserGroupIcon}
                            color="yellow"
                        />
                        <StatCard
                            title="Pending Votes"
                            value={pendingVoteVerifications}
                            icon={ClipboardDocumentCheckIcon}
                            color="purple"
                            onClick={() => document.getElementById('active-elections')?.scrollIntoView({ behavior: 'smooth' })}
                        />
                        <StatCard
                            title="Eligible Voters"
                            value={eligibleVotersCount}
                            icon={UserGroupIcon}
                            color="indigo"
                        />
                        <StatCard
                            title="Completed Elections"
                            value={completedElections}
                            icon={CheckBadgeIcon}
                            color="green"
                        />
                    </div>

                    {/* Active Elections Panel */}
                    <div id="active-elections" className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                                Active Elections
                            </h3>

                            {activeElections.length > 0 ? (
                                <div className="space-y-3">
                                    {activeElections.map(election => (
                                        <ElectionCard
                                            key={election.id}
                                            election={election}
                                            userLevel={userLevel}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No active elections at this time
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <ActionButton
                                    href={route(`${userLevel}.ec.elections.create`)}
                                    label="Create New Election"
                                    disabled={false}
                                />
                                <ActionButton
                                    href={activeElections[0]?.id ? route(`${userLevel}.ec.eligibility-criteria.index`, activeElections[0].id) : '#'}
                                    label="Set Eligibility Criteria"
                                    disabled={activeElections.length === 0}
                                />
                                <ActionButton
                                    href={route(`${userLevel}.ec.candidates.all-pending`)}
                                    label="Review Candidates"
                                    disabled={pendingCandidates === 0}
                                />
                                <ActionButton
                                    href={activeElections[0]?.id ? route(`${userLevel}.ec.votes.pending`, activeElections[0].id) : '#'}
                                    label="Verify Votes"
                                    disabled={pendingVoteVerifications === 0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Nominations Log */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Nominations / Actions</h3>
                            {recentNominations.length > 0 ? (
                                <div className="space-y-2">
                                    {recentNominations.map((nomination, index) => (
                                        <NominationLog key={index} nomination={nomination} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent nominations</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon: Icon, color, onClick, className = '' }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition transform hover:-translate-y-0.5' : ''} ${className}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
}

function ElectionCard({ election, userLevel = 'Tehsil' }) {
    const statusColors = {
        nominations_open: 'bg-blue-100 text-blue-800',
        voting_open: 'bg-green-100 text-green-800',
        voting_closed: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold">{election.title}</h4>
                    <p className="text-sm text-gray-600">{election.level} Level</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[election.status]}`}>
                    {election.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>
            <div className="mt-3 flex gap-2 items-center flex-wrap">
                <a
                    href={route(`${userLevel}.ec.elections.show`, election.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    View Details →
                </a>

                {/* Verification Button for Pending Votes */}
                {election.pending_votes_count > 0 && (
                    <a
                        href={route(`${userLevel}.ec.votes.pending`, election.id)}
                        className="text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full font-bold ml-2 flex items-center gap-1"
                    >
                        <span>🗳️ Verify {election.pending_votes_count} Votes</span>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    </a>
                )}

                {(!election.votes_count || election.votes_count === 0) && (
                    <a
                        href={route(`${userLevel}.ec.elections.edit`, election.id)}
                        className="text-sm text-green-600 hover:text-green-800 font-medium ml-2"
                    >
                        ✏️ Edit
                    </a>
                )}

                {(!election.votes_count || election.votes_count === 0) && (!election.candidates_count || election.candidates_count === 0) && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (confirm(`Delete "${election.title}"?`)) {
                                router.delete(route(`${userLevel}.ec.elections.destroy`, election.id));
                            }
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium ml-2"
                    >
                        🗑️ Delete
                    </button>
                )}
            </div>
        </div>
    );
}

function ActionButton({ href, label, disabled }) {
    return (
        <a
            href={!disabled ? href : '#'}
            className={`
                block text-center px-4 py-3 rounded-lg border-2 
                ${disabled
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }
                transition
            `}
        >
            {label}
        </a>
    );
}

function NominationLog({ nomination }) {
    const statusColors = {
        pending: 'text-yellow-600 bg-yellow-50',
        approved: 'text-green-600 bg-green-50',
        rejected: 'text-red-600 bg-red-50',
    };

    return (
        <div className="flex items-center justify-between text-sm py-3 px-4 border rounded-lg hover:bg-gray-50 transition">
            <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{nomination.member_name}</span>
                <span className="text-gray-500 text-xs">
                    Filed for <span className="font-medium">{nomination.position}</span> in {nomination.election_title}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[nomination.status] || 'text-gray-600'}`}>
                    {nomination.status.toUpperCase()}
                </span>
                <span className="text-gray-400 text-xs">{nomination.timestamp}</span>
            </div>
        </div>
    );
}

