import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import GlobalThemeStyles from '@/Components/GlobalThemeStyles';

export default function AuthenticatedLayout({ user: propsUser, header, children }) {
    const { url, props } = usePage();
    const auth = usePage().props.auth;
    const user = propsUser || auth.user;
    const officeProfile = props.office_profile; // Access office_profile from root props
    // Re-accessing auth directly from usePage to ensure we get the updated props if they weren't passed down explicitly 
    // although arguments 'user' is passed, 'header' is passed. 
    // The middleware shares 'auth.notifications', so we need to access 'auth' object properly.
    // The component prop 'user' is often passed as just the user object, not the full auth structure.
    // Let's rely on usePage().props.auth which is the global source.
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const role = user?.role || 'member';
    const isSuperAdmin = role === 'super_admin';
    const isStateAdmin = role === 'state' || role === 'super_admin';
    const isAdmin = role.includes('admin') || role.includes('president') || isStateAdmin;
    const isDistrictAdmin = role === 'district_admin' || role === 'district_president';
    const isTehsilAdmin = role === 'tehsil_admin' || role === 'tehsil_president';
    const isMember = role.includes('member') && !role.includes('admin') && !role.includes('president');

    const getRolePrefix = () => {
        // Check if user has an active portfolio - use portfolio routes
        if (auth.activePortfolio && auth.portfolioLevel) {
            const portfolioType = auth.activePortfolio.type;
            const level = auth.portfolioLevel;

            // If it's an election commission portfolio, use EC routes
            if (portfolioType === 'election_commission') {
                return `${level}.ec`;
            }
            // If it's a president portfolio, use president routes
            if (auth.activePortfolio.name?.includes('President')) {
                return `${level}.president`;
            }
            // Default to level-based routing for other portfolios
            return level;
        }

        // Fall back to role-based routing
        if (role === 'super_admin' || role === 'state') return 'state';
        if (role.includes('district') && !role.includes('member')) return 'district';
        if (role.toLowerCase().includes('tehsil') && !role.includes('member')) return 'tehsil';
        return 'member';
    };

    const rolePrefix = getRolePrefix();

    const theme = officeProfile?.theme_preferences || {};

    const navbarStyle = {
        background: theme.gradient_start && theme.gradient_end
            ? `linear-gradient(to right, ${theme.gradient_start}, ${theme.gradient_middle || theme.gradient_end}, ${theme.gradient_end})`
            : undefined,
        borderColor: theme.navbar_color || undefined,
        fontFamily: theme.font_family || undefined,
        color: 'var(--nav-text, #ffffff)' // Apply global nav text color
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Role display name
    const getRoleDisplayName = () => {
        // Prioritize active portfolio name
        if (auth.activePortfolio && auth.activePosition) {
            return auth.activePosition.position_title || auth.activePortfolio.name;
        }

        // Legacy: Check for commission role
        if (user?.member?.active_commission_role) return user.member.active_commission_role;

        if (isSuperAdmin) return 'State Admin';
        if (isDistrictAdmin) return 'District Admin';
        if (isTehsilAdmin) return 'Tehsil Admin';
        return 'Member';
    };

    const isECPortfolio = auth.activePortfolio?.type === 'election_commission';

    // Build navigation based on role
    const getNavigation = () => {
        const nav = [];
        const resourcePrefix = rolePrefix.split('.')[0]; // e.g., 'tehsil.president' -> 'tehsil'

        nav.push({
            name: 'Dashboard',
            icon: '🏠',
            href: route(`${rolePrefix}.dashboard`),
            type: 'link',
        });

        // Bodies - Hierarchical dropdown for District/tehsils/Members
        if (rolePrefix !== 'member' && !isECPortfolio) {
            const bodiesItems = [];

            // District Bodies
            if (route().has('districts.index')) {
                bodiesItems.push({ name: 'District Bodies', href: route('districts.index'), icon: '🏛️' });
            }

            // Tehsil Bodies
            if (route().has('tehsils.index')) {
                bodiesItems.push({ name: 'Tehsil Bodies', href: route('tehsils.index'), icon: '🏢' });
            }

            // Members
            if (route().has(`${resourcePrefix}.members.index`)) {
                bodiesItems.push({ name: 'All Members', href: route(`${resourcePrefix}.members.index`), icon: '👥' });
            }
            if (resourcePrefix === 'district' && route().has('district.district-members')) {
                bodiesItems.push({ name: 'District Members', href: route('district.district-members'), icon: '🎓' });
            }
            if (resourcePrefix === 'tehsil' && route().has('tehsil.members.create')) {
                bodiesItems.push({ name: 'Add Member', href: route('tehsil.members.create'), icon: '➕' });
            }

            if (bodiesItems.length > 0) {
                nav.push({
                    name: 'Bodies',
                    icon: '🏛️',
                    type: 'dropdown',
                    items: bodiesItems,
                });
            }
        } else if (rolePrefix === 'member') {
            // For members, show simple Bodies links
            const bodiesItems = [];
            if (route().has('districts.index')) {
                bodiesItems.push({ name: 'District Bodies', href: route('districts.index'), icon: '🏛️' });
            }
            if (route().has('tehsils.index')) {
                bodiesItems.push({ name: 'Tehsil Bodies', href: route('tehsils.index'), icon: '🏢' });
            }
            if (route().has('member.members.index')) {
                bodiesItems.push({ name: 'All Members', href: route('member.members.index'), icon: '👥' });
            }
            if (bodiesItems.length > 0) {
                nav.push({
                    name: 'Bodies',
                    icon: '🏛️',
                    type: 'dropdown',
                    items: bodiesItems,
                });
            }
        }

        // Elections section
        if (rolePrefix === 'member') {
            if (route().has('member.elections.index')) {
                nav.push({
                    name: 'Elections',
                    icon: '🗳️',
                    href: route('member.elections.index'),
                    type: 'link',
                });
            }
        } else if (route().has(`${resourcePrefix}.elections.index`)) {
            const electionItems = [];
            if (route().has(`${resourcePrefix}.elections.index`)) {
                electionItems.push({ name: 'All Elections', href: route(`${resourcePrefix}.elections.index`), icon: '🗳️' });
            }
            if (route().has(`${resourcePrefix}.elections.create`)) {
                electionItems.push({ name: 'Create Election', href: route(`${resourcePrefix}.elections.create`), icon: '➕' });
            }
            if (electionItems.length > 0) {
                nav.push({
                    name: 'Elections',
                    icon: '🗳️',
                    type: 'dropdown',
                    items: electionItems,
                });
            }
        }

        // Content & CMS - For State Admins (includes Settings)
        if (isStateAdmin) {
            const cmsItems = [
                { name: 'Homepage Manager', href: route('state.homepage.edit'), icon: '🏠' },
                { name: 'Blog Posts', href: route(`${rolePrefix}.blog.index`), icon: '📝' },
                { name: 'Events', href: route(`${rolePrefix}.blog.index`, { category: 'event' }), icon: '📅' },
                { name: 'Announcements', href: route(`${rolePrefix}.blog.index`, { category: 'notice' }), icon: '📢' },
                '---',
                { name: 'Achievements', href: route('state.achievements.index'), icon: '🏆' },
                { name: 'Govt Orders', href: route('state.govt-orders.index'), icon: '📜' },
                { name: 'Academic Calendar', href: route('state.calendars.index'), icon: '📅' },
                { name: 'Important Links', href: route('state.links.index'), icon: '🔗' },
                '---',
                { name: 'My Profile', href: route(isECPortfolio ? 'member.profile.edit' : `${rolePrefix}.profile.edit`), icon: '👤' },
                { name: 'Office Profile & Constitution', href: route('state.office-profile.edit'), icon: '🏢' },
            ];

            if (route().has(`${rolePrefix}.theme.edit`)) {
                cmsItems.push({ name: 'Theme Settings', href: route(`${rolePrefix}.theme.edit`), icon: '🎨' });
            }
            cmsItems.push({ name: 'Grievance Management', href: route('state.grievances.index'), icon: '💬' });

            nav.push({
                name: 'Content & CMS',
                icon: '📝',
                type: 'dropdown',
                items: cmsItems,
            });
        } else if (isAdmin) {
            // For other admins, just show Posts
            const postItems = [
                { name: 'Blog Posts', href: route(`${rolePrefix}.blog.index`), icon: '📝' },
                { name: 'Events', href: route(`${rolePrefix}.blog.index`, { category: 'event' }), icon: '📅' },
                { name: 'Announcements', href: route(`${rolePrefix}.blog.index`, { category: 'notice' }), icon: '📢' },
            ];

            nav.push({
                name: 'Posts',
                icon: '📝',
                type: 'dropdown',
                items: postItems,
            });
        }

        // Organization - Restructured (Organizational Structure Only)
        if (isAdmin) {
            const orgItems = [];

            // Hierarchical Structure
            if (route().has(`${rolePrefix}.districts.index`)) {
                orgItems.push({ name: 'Districts', href: route(`${rolePrefix}.districts.index`), icon: '🗺️' });
            }
            if (route().has(`${rolePrefix}.tehsils.index`)) {
                orgItems.push({ name: 'Tehsils', href: route(`${rolePrefix}.tehsils.index`), icon: '📍' });
            }

            // Add separator if we have structure items
            if (orgItems.length > 0) {
                orgItems.push('---');
            }

            // Portfolio Management
            if (route().has(`${rolePrefix}.portfolios.index`)) {
                orgItems.push({ name: 'Portfolios', href: route(`${rolePrefix}.portfolios.index`), icon: '📊' });
            }
            if (route().has(`${rolePrefix}.portfolio-assignments.index`)) {
                orgItems.push({ name: 'Assign Portfolios', href: route(`${rolePrefix}.portfolio-assignments.index`), icon: '👔' });
            }

            // Add separator before governance
            if (route().has(`${rolePrefix}.committees.index`) || route().has(`${rolePrefix}.resolutions.index`)) {
                orgItems.push('---');
            }

            // Governance
            if (route().has(`${rolePrefix}.committees.index`)) {
                orgItems.push({ name: 'Committees', href: route(`${rolePrefix}.committees.index`), icon: '👥' });
            }
            if (route().has(`${rolePrefix}.resolutions.index`)) {
                orgItems.push({ name: 'Resolutions', href: route(`${rolePrefix}.resolutions.index`), icon: '📋' });
            }

            // Add separator before member operations
            if (route().has(`${rolePrefix}.transfers.index`)) {
                orgItems.push('---');
            }

            // Member Operations
            if (route().has(`${rolePrefix}.transfers.index`)) {
                orgItems.push({ name: 'Member Transfers', href: route(`${rolePrefix}.transfers.index`), icon: '🔄' });
            }
            if (route().has(`${rolePrefix}.transfers.create`)) {
                orgItems.push({ name: 'New Transfer', href: route(`${rolePrefix}.transfers.create`), icon: '➕' });
            }

            if (orgItems.length > 0) {
                nav.push({
                    name: 'Organization',
                    icon: '🏛️',
                    type: 'dropdown',
                    items: orgItems,
                });
            }
        }

        // Admins dropdown - State & District only
        if (isSuperAdmin || isDistrictAdmin) {
            nav.push({
                name: 'Admins',
                icon: '👔',
                type: 'dropdown',
                items: [
                    { name: 'All Admins', href: route(`${rolePrefix}.admins.index`), icon: '👔' },
                    { name: 'Add Admin', href: route(`${rolePrefix}.admins.create`), icon: '➕' },
                ],
            });
        }

        // Member-specific links
        if (rolePrefix === 'member') {
            nav.push({
                href: route('member.attendance.index'),
                type: 'link',
            });

            nav.push({
                name: 'Grievances',
                icon: '💬',
                href: route('grievances.index'),
                type: 'link',
            });
        }

        return nav;
    };

    const navigation = getNavigation();

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const DropdownMenu = ({ item }) => (
        <div className="relative">
            <button
                onClick={() => toggleDropdown(item.name)}
                className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${openDropdown === item.name
                    ? 'bg-white/20'
                    : 'hover:bg-white/20'
                    }`}
                style={{ color: 'var(--nav-text)' }}
            >
                <span className="mr-1.5">{item.icon}</span>
                {item.name}
                <svg
                    className={`ml-1 w-3 h-3 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {openDropdown === item.name && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl py-2 z-[100] border border-gray-200 max-h-[70vh] overflow-y-auto">
                    {item.items.map((subItem, index) =>
                        subItem === '---' ? (
                            <div key={`separator-${index}`} className="border-t border-gray-200 my-1 mx-2" />
                        ) : (
                            <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-center px-5 py-3 text-base text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition-colors font-medium"
                                onClick={() => setOpenDropdown(null)}
                            >
                                <span className="mr-3 text-lg">{subItem.icon}</span>
                                {subItem.name}
                            </Link>
                        )
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <GlobalThemeStyles theme={theme} />
            {/* Top Navigation - Professional Blue Gradient */}
            <nav className={`shadow-xl border-b-4 ${!theme.navbar_color ? 'bg-gradient-to-r from-teal-700 via-blue-800 to-indigo-900 border-teal-500' : ''}`} style={navbarStyle}>
                <div className="w-full px-2 sm:px-4 lg:px-6">
                    <div className="flex justify-between items-center h-16" ref={dropdownRef}>
                        {/* Logo & Navigation */}
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                            {/* Logo & Organization Branding - Enhanced */}
                            <div className="flex-shrink-0">
                                <Link href={route('dashboard')} className="flex items-center space-x-3 group">
                                    {officeProfile?.primary_logo_path ? (
                                        <div className="relative">
                                            <img
                                                src={`/storage/${officeProfile.primary_logo_path}`}
                                                alt={officeProfile.organization_name || 'Logo'}
                                                className="h-10 w-auto rounded-lg shadow-lg ring-2 ring-white/50 group-hover:ring-white transition-all group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-white/50 group-hover:ring-white transition-all group-hover:scale-105">
                                            {officeProfile?.short_name?.charAt(0) || 'T'}
                                        </div>
                                    )}
                                    {/* Organization Name - Enhanced Typography */}
                                    <div className="hidden sm:block">
                                        <div className="font-bold text-base max-w-[200px] truncate leading-tight drop-shadow-lg" style={{ color: 'var(--nav-text)' }}>
                                            {officeProfile?.short_name || 'TA'}
                                        </div>
                                        <div className="text-xs leading-tight font-medium opacity-90" style={{ color: 'var(--nav-text)' }}>
                                            {getRoleDisplayName()}
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop Navigation - Colorful Items */}
                            <div className="hidden sm:flex sm:items-center sm:space-x-2">
                                {navigation.map((item) =>
                                    item.type === 'dropdown' ? (
                                        <DropdownMenu key={item.name} item={item} />
                                    ) : (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/30 whitespace-nowrap shadow-md hover:shadow-lg hover:scale-105 nav-item-override"
                                            style={{ color: 'var(--nav-text)' }}
                                        >
                                            <span className="mr-2 text-lg">{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>

                        {/* User Menu - Enhanced */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-3 flex-shrink-0 ml-2">
                            {/* Notifications Dropdown - Colorful */}
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowUserMenu(false);
                                        setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications');
                                    }}
                                    className="p-2 rounded-lg hover:bg-white/20 transition-all relative focus:outline-none backdrop-blur-sm border border-transparent hover:border-white/30 shadow-md hover:shadow-lg nav-item-override"
                                    style={{ color: 'var(--nav-text)' }}
                                >
                                    <span className="sr-only">View notifications</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {auth.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-pulse flex items-center justify-center">
                                            <span className="text-xs font-bold text-teal-900">{auth.unreadCount}</span>
                                        </span>
                                    )}
                                </button>

                                {openDropdown === 'notifications' && (
                                    <div
                                        className="absolute right-0 mt-2 w-80 rounded-lg shadow-2xl py-1 ring-1 ring-black ring-opacity-5 z-[100] overflow-hidden"
                                        style={{ backgroundColor: 'var(--nav-dropdown-bg)' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                            <span className="text-sm font-bold text-gray-700">Notifications</span>
                                            {auth.unreadCount > 0 && (
                                                <Link
                                                    href={route('notifications.readAll')}
                                                    method="post"
                                                    as="button"
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Mark all read
                                                </Link>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {auth.notifications.length > 0 ? (
                                                auth.notifications.map((notification) => (
                                                    <Link
                                                        key={notification.id}
                                                        href={route(`${rolePrefix}.blog.show`, notification.data.event_id || 1)}
                                                        className={`block px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 ${!notification.read_at ? 'bg-blue-50/50' : ''}`}
                                                        onClick={() => setOpenDropdown(null)}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="flex-shrink-0 pt-1">
                                                                {notification.data.type === 'duty_slip' ? '📩' : '⚠️'}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">{notification.data.title}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{notification.data.message}</p>
                                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                                    No new notifications
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Dropdown */}
                            <div className="relative">
                                {/* User Menu Button - Enhanced */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(null);
                                        setShowUserMenu(!showUserMenu);
                                    }}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all focus:outline-none backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg nav-item-override"
                                    style={{ color: 'var(--nav-text)' }}
                                >
                                    <div className="flex items-center space-x-2">
                                        {(user?.member?.photo_path || user?.photo_path) ? (
                                            <img
                                                src={`/storage/${user.member?.photo_path || user.photo_path}`}
                                                alt={user.name}
                                                className="w-9 h-9 rounded-lg object-cover ring-2 ring-white/50 shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center ring-2 ring-white/50 shadow-lg">
                                                <span className="text-teal-900 font-bold text-sm">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                            </div>
                                        )}
                                        <div className="text-left hidden lg:block">
                                            <div className="text-sm font-bold leading-tight drop-shadow-lg" style={{ color: 'var(--nav-text)' }}>{user?.name}</div>
                                            <div className="text-xs leading-tight font-medium opacity-90" style={{ color: 'var(--nav-text)' }}>{user?.email}</div>
                                        </div>
                                    </div>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div
                                        className="absolute right-0 mt-2 w-52 rounded-lg shadow-2xl py-1 z-[100] border border-gray-200"
                                        style={{ backgroundColor: 'var(--nav-dropdown-bg)' }}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                                        >
                                            🚪 Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) =>
                            item.type === 'dropdown' ? (
                                <div key={item.name} className="border-l-4 border-transparent">
                                    <div className="pl-3 pr-4 py-2 text-gray-900 font-medium flex items-center">
                                        <span className="mr-2">{item.icon}</span>
                                        {item.name}
                                    </div>
                                    <div className="pl-8 space-y-1">
                                        {item.items.filter(subItem => subItem !== '---').map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.href}
                                                className="block py-2 pr-4 text-sm text-gray-600 hover:text-teal-600 font-medium"
                                            >
                                                <span className="mr-2">{subItem.icon}</span>
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-teal-500 transition-colors"
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </Link>
                            )
                        )}
                    </div>
                    {/* Mobile User Info */}
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${(user?.member?.photo_path || user?.photo_path) ? 'border-2 border-teal-500' : 'bg-gradient-to-br from-teal-500 to-blue-500 text-white font-semibold'}`}>
                                {(user?.member?.photo_path || user?.photo_path) ? (
                                    <img src={`/storage/${user.member?.photo_path || user.photo_path}`} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                <div className="text-sm font-medium text-gray-500">{getRoleDisplayName()}</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav >

            {/* Flash Messages */}
            {
                (props.flash?.success || props.flash?.error || props.errors?.error) && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                        {props.flash?.success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">{props.flash.success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {props.flash?.error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm mt-2">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{props.flash.error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Handle bag 'error' key specifically (used for general logic errors) */}
                        {props.errors?.error && !props.flash?.error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm mt-2">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{props.errors.error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Page Header */}
            {
                header && (
                    <header className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {typeof header === 'string' ? (
                                <h1 className="text-2xl font-bold text-gray-900">{header}</h1>
                            ) : (
                                header
                            )}
                        </div>
                    </header>
                )
            }

            {/* Page Content */}
            <main>{children}</main>
        </div >
    );
}

