import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatsCard from '@/Components/StatsCard';
import DashboardCharts from '@/Components/DashboardCharts';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, stats, recentActivities, upcomingEvents, pendingApprovals, pendingWinners, charts }) {
    const role = auth.user.role;
    const [recentActivitiesPage, setRecentActivitiesPage] = useState(0);

    const getRolePrefix = () => {
        if (role === 'super_admin') return 'state';
        const lowerRole = role.toLowerCase();
        if (lowerRole.includes('district') && !lowerRole.includes('member')) return 'district';
        if (lowerRole.includes('tehsil') && !lowerRole.includes('member')) return 'tehsil';
        return 'member';
    };

    const rolePrefix = getRolePrefix();

    const { props } = usePage();
    const theme = props.office_profile?.theme_preferences || {};

    // Dynamic Styles
    const bannerStyle = {
        background: theme.gradient_start && theme.gradient_end
            ? `linear-gradient(to bottom right, ${theme.gradient_start}, ${theme.gradient_middle || theme.gradient_end}, ${theme.gradient_end})`
            : undefined,
    };

    const containerStyle = {
        fontFamily: theme.font_family || undefined
    };

    // Role-based greeting
    const getRoleTitle = () => {
        const titles = {
            super_admin: 'System Administrator',
            state_admin: 'State Administrator',
            state_president: 'State President',
            district_admin: 'District Administrator',
            district_president: 'District President',
            tehsil_admin: 'tehsil Administrator',
            tehsil_president: 'tehsil President',
            member: 'Member',
        };
        return titles[role] || 'User';
    };

    // Build Quick Actions array - TOP 6-8 MOST USED ONLY
    const getQuickActions = () => {
        const actions = [];
        const isDistrictAdmin = role === 'district_admin' || role === 'district_president';
        const isTehsilAdmin = role?.toLowerCase().includes('tehsil');
        const isSuperAdmin = role === 'super_admin';

        // STATE / SUPER ADMIN - Top 6 most used
        if (isSuperAdmin || role.includes('state')) {
            // Primary Actions
            if (isTehsilAdmin && route().has('tehsil.members.create')) {
                actions.push({
                    href: route('tehsil.members.create'),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
                    title: 'Add New Member',
                    bgColor: 'from-red-50 to-amber-50',
                    iconColor: 'from-red-500 to-red-600'
                });
            }

            if (route().has(`${rolePrefix}.elections.create`)) {
                actions.push({
                    href: route(`${rolePrefix}.elections.create`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
                    title: 'Create Election',
                    bgColor: 'from-amber-50 to-yellow-50',
                    iconColor: 'from-amber-500 to-amber-600'
                });
            }

            // Most Accessed CMS
            if (route().has('state.homepage.edit')) {
                actions.push({
                    href: route('state.homepage.edit'),
                    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                    title: 'Homepage Manager',
                    bgColor: 'from-indigo-50 to-purple-50',
                    iconColor: 'from-indigo-500 to-purple-600'
                });
            }

            // Most Viewed
            if (route().has(`${rolePrefix}.members.index`)) {
                actions.push({
                    href: route(`${rolePrefix}.members.index`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
                    title: 'View All Members',
                    bgColor: 'from-orange-50 to-red-50',
                    iconColor: 'from-orange-500 to-orange-600'
                });
            }

            // Frequent Checks
            if (route().has('state.grievances.index')) {
                actions.push({
                    href: route('state.grievances.index'),
                    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
                    title: 'Manage Grievances',
                    bgColor: 'from-pink-50 to-rose-50',
                    iconColor: 'from-pink-500 to-rose-600'
                });
            }

            // Personal Settings
            if (route().has(`${rolePrefix}.profile.edit`)) {
                actions.push({
                    href: route(`${rolePrefix}.profile.edit`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                    title: 'My Profile',
                    bgColor: 'from-purple-50 to-pink-50',
                    iconColor: 'from-purple-500 to-pink-600'
                });
            }
        }
        // DISTRICT ADMIN - Top 6
        else if (isDistrictAdmin) {
            if (route().has(`${rolePrefix}.elections.create`)) {
                actions.push({
                    href: route(`${rolePrefix}.elections.create`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
                    title: 'Create Election',
                    bgColor: 'from-amber-50 to-yellow-50',
                    iconColor: 'from-amber-500 to-amber-600'
                });
            }

            if (route().has('district.district-members')) {
                actions.push({
                    href: route('district.district-members'),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
                    title: 'View District Members',
                    bgColor: 'from-orange-50 to-red-50',
                    iconColor: 'from-orange-500 to-orange-600'
                });
            }

            if (route().has(`${rolePrefix}.admins.create`)) {
                actions.push({
                    href: route(`${rolePrefix}.admins.create`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                    title: 'Create Tehsil Admin',
                    bgColor: 'from-yellow-50 to-orange-50',
                    iconColor: 'from-yellow-500 to-yellow-600'
                });
            }

            if (route().has(`${rolePrefix}.office-profile.edit`)) {
                actions.push({
                    href: route(`${rolePrefix}.office-profile.edit`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                    title: 'Office Profile',
                    bgColor: 'from-blue-50 to-indigo-50',
                    iconColor: 'from-blue-500 to-indigo-600'
                });
            }

            if (route().has(`${rolePrefix}.profile.edit`)) {
                actions.push({
                    href: route(`${rolePrefix}.profile.edit`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                    title: 'My Profile',
                    bgColor: 'from-purple-50 to-pink-50',
                    iconColor: 'from-purple-500 to-pink-600'
                });
            }
        }
        // TEHSIL ADMIN - Top 6
        else if (isTehsilAdmin) {
            if (route().has('tehsil.members.create')) {
                actions.push({
                    href: route('tehsil.members.create'),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
                    title: 'Add New Member',
                    bgColor: 'from-red-50 to-amber-50',
                    iconColor: 'from-red-500 to-red-600'
                });
            }

            if (route().has(`${rolePrefix}.members.index`)) {
                actions.push({
                    href: route(`${rolePrefix}.members.index`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
                    title: 'View All Members',
                    bgColor: 'from-orange-50 to-red-50',
                    iconColor: 'from-orange-500 to-orange-600'
                });
            }

            if (route().has(`${rolePrefix}.elections.create`)) {
                actions.push({
                    href: route(`${rolePrefix}.elections.create`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
                    title: 'Create Election',
                    bgColor: 'from-amber-50 to-yellow-50',
                    iconColor: 'from-amber-500 to-amber-600'
                });
            }

            if (route().has(`${rolePrefix}.office-profile.edit`)) {
                actions.push({
                    href: route(`${rolePrefix}.office-profile.edit`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                    title: 'Office Profile',
                    bgColor: 'from-blue-50 to-indigo-50',
                    iconColor: 'from-blue-500 to-indigo-600'
                });
            }

            if (route().has(`${rolePrefix}.transfers.index`)) {
                actions.push({
                    href: route(`${rolePrefix}.transfers.index`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
                    title: 'Member Transfers',
                    bgColor: 'from-green-50 to-emerald-50',
                    iconColor: 'from-green-500 to-emerald-600'
                });
            }

            if (route().has(`${rolePrefix}.profile.edit`)) {
                actions.push({
                    href: route(`${rolePrefix}.profile.edit`),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                    title: 'My Profile',
                    bgColor: 'from-purple-50 to-pink-50',
                    iconColor: 'from-purple-500 to-pink-600'
                });
            }
        }
        // MEMBER - Top 4
        else {
            if (route().has('member.elections.index')) {
                actions.push({
                    href: route('member.elections.index'),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
                    title: 'View Elections',
                    bgColor: 'from-amber-50 to-yellow-50',
                    iconColor: 'from-amber-500 to-amber-600'
                });
            }

            if (route().has('member.attendance.index')) {
                actions.push({
                    href: route('member.attendance.index'),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
                    title: 'My Attendance',
                    bgColor: 'from-blue-50 to-indigo-50',
                    iconColor: 'from-blue-500 to-indigo-600'
                });
            }

            if (route().has('grievances.index')) {
                actions.push({
                    href: route('grievances.index'),
                    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
                    title: 'Submit Grievance',
                    bgColor: 'from-pink-50 to-rose-50',
                    iconColor: 'from-pink-500 to-rose-600'
                });
            }

            if (route().has('member.profile.edit')) {
                actions.push({
                    href: route('member.profile.edit'),
                    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                    title: 'My Profile',
                    bgColor: 'from-purple-50 to-pink-50',
                    iconColor: 'from-purple-500 to-pink-600'
                });
            }
        }

        return actions;
    };

    const quickActions = getQuickActions();

    // Recent Activities Pagination
    const activitiesPerPage = 3;
    const totalActivitiesPages = recentActivities ? Math.ceil(recentActivities.length / activitiesPerPage) : 0;
    const paginatedActivities = recentActivities ? recentActivities.slice(recentActivitiesPage * activitiesPerPage, (recentActivitiesPage + 1) * activitiesPerPage) : [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 tracking-tight">Dashboard</h2>
                    <p className="text-sm text-gray-600 mt-1 font-medium">{getRoleTitle()} • {auth.user.name}</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-gray-50 min-h-screen" style={containerStyle}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Enhanced Welcome Banner - Professional Teal/Blue Theme */}
                    <div className="relative bg-gradient-to-br from-teal-600 to-blue-700 rounded-[2rem] shadow-2xl p-8 mb-10 text-white overflow-hidden transform hover:scale-[1.01] transition-transform duration-500"
                        style={bannerStyle}
                    >
                        {/* Animated Background Shapes */}
                        <div className="absolute inset-0 opacity-20 overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
                            <div className="absolute right-1/4 top-1/2 w-40 h-40 bg-cyan-300 rounded-full mix-blend-overlay filter blur-2xl"></div>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-lg">
                                        Welcome back,
                                    </span><br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-400 drop-shadow-2xl animate-pulse">
                                        {auth.user.name.split(' ')[0]}!
                                    </span> 👋
                                </h1>
                                <p className="text-lg text-teal-50 mb-6 font-light max-w-xl leading-relaxed">
                                    You have full control over the system. Here's a quick overview of what's happening right now.
                                </p>

                                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide uppercase">
                                    <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-amber-200/50 shadow-lg">
                                        <svg className="w-4 h-4 mr-2 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        <span className="text-amber-300 font-black text-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(251,191,36,0.6)' }}>{role.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-amber-200/50 shadow-lg">
                                        <svg className="w-4 h-4 mr-2 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-amber-300 font-black text-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(251,191,36,0.6)' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:block transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                {/* Elegant Glass Card Preview */}
                                <a
                                    href={role !== 'member' ? route('admins.icard.download', auth.user.id) : (auth.user.member ? route('members.icard.download', auth.user.member.id) : '#')}
                                    className="block group"
                                >
                                    <div className="w-80 bg-white/10 backdrop-blur-xl rounded-2xl p-1 shadow-2xl border border-white/30 group-hover:shadow-white/20 transition-all">
                                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 p-0.5">
                                                    <img
                                                        src={auth.user.photo_path ? `/storage/${auth.user.photo_path}` : `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`}
                                                        className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg leading-tight">{auth.user.name}</h3>
                                                    <p className="text-teal-300 text-xs font-medium uppercase tracking-wider">{role.replace('_', ' ')}</p>
                                                    <p className="text-gray-400 text-[10px] mt-1">ID: #{String(auth.user.id).padStart(4, '0')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-teal-100 text-xs mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to download ID Card</p>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid - Modern Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {/* Total Members - Blue Theme */}
                        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Members</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-bold text-gray-900">{stats.totalMembers || 0}</span>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active: {stats.activeMembers}</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Elections - Emerald Theme */}
                        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Elections</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-bold text-gray-900">{stats.activeElections || 0}</span>
                                    <span className="text-xs font-medium text-emerald-600">Voting Open</span>
                                </div>
                            </div>
                        </div>

                        {/* Pending Actions - Rose Theme (Kept as alert) */}
                        {(role.includes('admin') || role.includes('president')) && (
                            <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-3xl font-bold text-gray-900">{pendingApprovals || 0}</span>
                                        <span className="text-xs font-medium text-rose-600">Review needed</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upcoming Events - Violet Theme */}
                        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-violet-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-4 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Activity</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-bold text-gray-900">{stats.upcomingEvents || 0}</span>
                                    <span className="text-xs font-medium text-violet-600">Events this month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Charts Section with spacing */}
                    {(role.includes('admin') || role === 'super_admin') && (
                        <div className="mb-10">
                            <DashboardCharts charts={charts} role={role} />
                        </div>
                    )}

                    {/* Pending Election Winners - Admin Only - Modern Card (Slate/Dark Theme) */}
                    {(role.includes('admin') || role.includes('president')) && pendingWinners && pendingWinners.length > 0 && (
                        <div className="bg-slate-900 rounded-3xl shadow-xl p-8 mb-10 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/img/pattern.png')] opacity-5"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                            <svg className="w-8 h-8 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Uninstalled Winners</h2>
                                            <p className="text-slate-400 text-sm">Action Required for {pendingWinners.length} candidates</p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-1.5 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30 animate-pulse">
                                        {pendingWinners.length} PENDING
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {pendingWinners.map((result) => (
                                        <div key={result.id} className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                                        {result.winner?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">{result.winner?.name}</h3>
                                                        <p className="text-slate-400 text-sm">{result.position_title} • <span className="text-emerald-400 font-medium">{result.vote_percentage}% Votes</span></p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route(`${rolePrefix}.portfolio-assignments.create`, { member_id: result.winner_id, position_title: result.position_title })}
                                                    className="px-6 py-2.5 bg-white text-slate-900 rounded-xl hover:bg-slate-100 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
                                                >
                                                    <span>Install Now</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity - Timeline View */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                                    </button>
                                </div>

                                <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pl-8 space-y-10">
                                    {recentActivities && recentActivities.length > 0 ? (
                                        recentActivities.map((activity, index) => (
                                            <div key={index} className="relative">
                                                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow-md"></span>
                                                <div className="bg-slate-50 rounded-2xl p-4 hover:bg-blue-50 transition-colors cursor-default group">
                                                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{activity.description}</p>
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 opacity-50">
                                            <p>No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - App Grid */}
                        <div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            href={action.href}
                                            className="group flex items-center p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200"
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-br ${action.iconColor} text-white rounded-xl shadow-md flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                                                {action.icon}
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{action.title}</span>
                                                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Click to open</span>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Events Widget Clean */}
                            {upcomingEvents && upcomingEvents.length > 0 && (
                                <div className="mt-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
                                    <h3 className="text-lg font-bold mb-4 relative z-10">Upcoming Events</h3>
                                    <div className="space-y-3 relative z-10">
                                        {upcomingEvents.slice(0, 3).map((event, index) => (
                                            <div key={index} className="flex items-center gap-4 py-2 border-b border-indigo-400/30 last:border-0 hover:bg-white/10 px-2 rounded-lg transition-colors cursor-pointer">
                                                <div className="bg-white/20 backdrop-blur-md rounded-lg w-10 h-10 flex flex-col items-center justify-center flex-shrink-0">
                                                    <span className="text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</span>
                                                    <span className="text-sm font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                                                </div>
                                                <p className="text-sm font-medium leading-tight">{event.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function QuickActionLink({ href, icon, title, description }) {
    return (
        <Link
            href={href}
            className="flex items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 group"
        >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <span className="block text-sm font-semibold text-gray-700">{title}</span>
                {description && <span className="block text-xs text-gray-500">{description}</span>}
            </div>
        </Link>
    );
}

