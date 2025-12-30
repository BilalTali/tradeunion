import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ auth, officeProfile, currentTheme }) {
    const { props } = usePage();
    const role = auth.user.role;
    const [activeTab, setActiveTab] = useState('layout');

    // Default theme values (Professional Royal Blue)
    const defaultTheme = {
        // Layout
        page_background: '#f1f5f9', // Slate-100 (Crisp Professional Gray)
        card_background: '#ffffff',
        card_border_color: '#e2e8f0', // Slate-200

        // Navigation (Deep Trustworthy Blue)
        gradient_start: '#1e3a8a', // Blue-900
        gradient_middle: '#1e40af', // Blue-800
        gradient_end: '#172554',   // Blue-950
        navbar_color: '#2563eb',   // Blue-600
        nav_text_color: '#ffffff',
        nav_dropdown_bg: '#ffffff',
        nav_item_bg: 'rgba(255, 255, 255, 0.1)',

        // Typography
        font_family: 'Inter',
        text_main_color: '#0f172a', // Slate-900 (High Contrast)
        text_secondary_color: '#475569', // Slate-600

        // Components
        primary_button: '#2563eb', // Blue-600 (Standard Action Blue)
        secondary_color: '#64748b', // Slate-500
        input_bg_color: '#ffffff',
        input_border_color: '#cbd5e1', // Slate-300
        form_focus: '#2563eb', // Blue-600
        chart_primary: '#2563eb',

        // Status
        success_color: '#16a34a', // Green-600
        warning_color: '#ca8a04', // Yellow-600
        error_color: '#dc2626', // Red-600
        info_color: '#0284c7', // Sky-600

        ...currentTheme
    };

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        theme_preferences: defaultTheme
    });

    const resetToDefaults = () => {
        if (confirm('Are you sure you want to reset all theme settings to the system default? This will immediately reset your theme.')) {
            let routePrefix = 'member';
            if (role === 'super_admin' || role.includes('state')) routePrefix = 'state';
            else if (role.includes('district')) routePrefix = 'district';
            else if (role.includes('Tehsil')) routePrefix = 'Tehsil';

            router.delete(route(`${routePrefix}.theme.destroy`), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: You could show a local success message if needed, 
                    // but the flash message from backend handles this.
                }
            });
        }
    };


    const fontOptions = [
        { name: 'Inter', value: 'Inter' },
        { name: 'Roboto', value: 'Roboto' },
        { name: 'Open Sans', value: 'Open Sans' },
        { name: 'Lato', value: 'Lato' },
        { name: 'Poppins', value: 'Poppins' },
        { name: 'Montserrat', value: 'Montserrat' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        let routePrefix = 'member';
        if (role === 'super_admin' || role.includes('state')) routePrefix = 'state';
        else if (role.includes('district')) routePrefix = 'district';
        else if (role.includes('Tehsil')) routePrefix = 'Tehsil';

        post(route(`${routePrefix}.theme.update`), { preserveScroll: true });
    };

    const getPreviewStyle = () => ({
        background: `linear-gradient(to right, ${data.theme_preferences.gradient_start}, ${data.theme_preferences.gradient_middle || data.theme_preferences.gradient_end}, ${data.theme_preferences.gradient_end})`,
        fontFamily: data.theme_preferences.font_family
    });

    const ColorInput = ({ label, value, field }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={e => setData('theme_preferences', { ...data.theme_preferences, [field]: e.target.value })}
                    className="h-10 w-full rounded border cursor-pointer"
                />
            </div>
        </div>
    );

    const tabs = [
        { id: 'layout', label: 'Layout & Backgrounds' },
        { id: 'nav', label: 'Navigation' },
        { id: 'typo', label: 'Typography' },
        { id: 'components', label: 'Buttons & Forms' },
        { id: 'status', label: 'Status & Alerts' },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Theme Settings</h2>}>
            <Head title="Theme Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Live Preview Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
                        <div className="border rounded-xl overflow-hidden shadow-xl" style={{ backgroundColor: data.theme_preferences.page_background }}>
                            {/* Fake Navbar */}
                            <div className="h-16 w-full flex items-center justify-between px-6 text-white shadow-md border-b-4" style={{ ...getPreviewStyle(), borderColor: data.theme_preferences.navbar_color }}>
                                <div className="font-bold text-lg flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                                    <span style={{ fontFamily: data.theme_preferences.font_family }}>Dashboard</span>
                                </div>
                                <div className="flex gap-4 text-sm font-medium opacity-90">
                                    <span>Home</span><span>Profile</span>
                                </div>
                            </div>

                            {/* Fake Content */}
                            <div className="p-8 min-h-[250px]">
                                <h1 className="text-2xl font-bold mb-6" style={{ color: data.theme_preferences.text_main_color, fontFamily: data.theme_preferences.font_family }}>Welcome Back!</h1>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: data.theme_preferences.card_background, borderColor: data.theme_preferences.card_border_color }}>
                                        <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                                        <p style={{ color: data.theme_preferences.text_secondary_color }}>This is card content text.</p>
                                        <div className="mt-4 flex gap-2">
                                            <button className="px-4 py-2 text-white rounded text-sm shadow-md" style={{ backgroundColor: data.theme_preferences.primary_button }}>Primary</button>
                                            <button className="px-4 py-2 text-white rounded text-sm" style={{ backgroundColor: data.theme_preferences.secondary_color }}>Secondary</button>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: data.theme_preferences.card_background, borderColor: data.theme_preferences.card_border_color }}>
                                        <label className="block text-sm font-medium mb-1" style={{ color: data.theme_preferences.text_main_color }}>Input Label</label>
                                        <input type="text" className="w-full rounded border p-2" placeholder="Start typing..." style={{ backgroundColor: data.theme_preferences.input_bg_color, borderColor: data.theme_preferences.input_border_color }} />
                                    </div>
                                    <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: data.theme_preferences.card_background, borderColor: data.theme_preferences.card_border_color }}>
                                        <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full" style={{ background: data.theme_preferences.success_color }}></div> <span style={{ color: data.theme_preferences.text_main_color }}>Success</span></div>
                                        <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full" style={{ background: data.theme_preferences.error_color }}></div> <span style={{ color: data.theme_preferences.text_main_color }}>Error</span></div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: data.theme_preferences.warning_color }}></div> <span style={{ color: data.theme_preferences.text_main_color }}>Warning</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {activeTab === 'layout' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                        <ColorInput label="Page Background" value={data.theme_preferences.page_background} field="page_background" />
                                        <ColorInput label="Card Background" value={data.theme_preferences.card_background} field="card_background" />
                                        <ColorInput label="Card Border Color" value={data.theme_preferences.card_border_color} field="card_border_color" />
                                    </div>
                                )}

                                {activeTab === 'nav' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                        <div className="col-span-2 grid grid-cols-3 gap-4">
                                            <ColorInput label="Gradient Start" value={data.theme_preferences.gradient_start} field="gradient_start" />
                                            <ColorInput label="Gradient Middle" value={data.theme_preferences.gradient_middle} field="gradient_middle" />
                                            <ColorInput label="Gradient End" value={data.theme_preferences.gradient_end} field="gradient_end" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ColorInput label="Navbar Border Color" value={data.theme_preferences.navbar_color} field="navbar_color" />
                                            <ColorInput label="Navbar Text Color" value={data.theme_preferences.nav_text_color} field="nav_text_color" />
                                            <ColorInput label="Dropdown Background" value={data.theme_preferences.nav_dropdown_bg} field="nav_dropdown_bg" />
                                            <ColorInput label="Nav Item Background" value={data.theme_preferences.nav_item_bg} field="nav_item_bg" />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'typo' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Font Family</label>
                                            <select
                                                value={data.theme_preferences.font_family}
                                                onChange={e => setData('theme_preferences', { ...data.theme_preferences, font_family: e.target.value })}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                {fontOptions.map(font => <option key={font.value} value={font.value}>{font.name}</option>)}
                                            </select>
                                        </div>
                                        <ColorInput label="Main Text Color" value={data.theme_preferences.text_main_color} field="text_main_color" />
                                        <ColorInput label="Secondary Text Color" value={data.theme_preferences.text_secondary_color} field="text_secondary_color" />
                                    </div>
                                )}

                                {activeTab === 'components' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                        <ColorInput label="Primary Button" value={data.theme_preferences.primary_button} field="primary_button" />
                                        <ColorInput label="Secondary Color" value={data.theme_preferences.secondary_color} field="secondary_color" />
                                        <ColorInput label="Form Focus Ring" value={data.theme_preferences.form_focus} field="form_focus" />
                                        <ColorInput label="Input Background" value={data.theme_preferences.input_bg_color} field="input_bg_color" />
                                        <ColorInput label="Input Border" value={data.theme_preferences.input_border_color} field="input_border_color" />
                                        <ColorInput label="Chart Primary Color" value={data.theme_preferences.chart_primary} field="chart_primary" />
                                    </div>
                                )}

                                {activeTab === 'status' && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                                        <ColorInput label="Success (Green)" value={data.theme_preferences.success_color} field="success_color" />
                                        <ColorInput label="Warning (Orange)" value={data.theme_preferences.warning_color} field="warning_color" />
                                        <ColorInput label="Error (Red)" value={data.theme_preferences.error_color} field="error_color" />
                                        <ColorInput label="Info (Blue)" value={data.theme_preferences.info_color} field="info_color" />
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save All Settings'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetToDefaults}
                                        className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        ↺ Reset to Default Theme
                                    </button>

                                    {recentlySuccessful && <span className="text-green-600 font-medium animate-pulse">Saved Successfully!</span>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

