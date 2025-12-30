import React from 'react';

export default function GlobalThemeStyles({ theme }) {
    if (!theme) return null;

    // Default Fallbacks
    const colors = {
        primary: theme.primary_button || '#2563eb', // Blue-600
        secondary: theme.secondary_color || '#64748b', // Slate-500

        // Layout
        page_bg: theme.page_background || '#f1f5f9', // Slate-100
        card_bg: theme.card_background || '#ffffff', // White
        sidebar_bg: theme.sidebar_background || '#ffffff',

        // Typography
        font_main: theme.font_family || 'Inter',
        text_main: theme.text_main_color || '#0f172a', // Slate-900
        text_secondary: theme.text_secondary_color || '#475569', // Slate-600

        // Navigation
        nav_start: theme.gradient_start || '#1e3a8a', // Blue-900
        nav_mid: theme.gradient_middle || '#1e40af', // Blue-800
        nav_end: theme.gradient_end || '#172554', // Blue-950
        nav_text: theme.nav_text_color || '#ffffff',
        nav_dropdown_bg: theme.nav_dropdown_bg || '#ffffff',
        nav_item_bg: theme.nav_item_bg || 'rgba(255, 255, 255, 0.1)',

        // Components
        card_border: theme.card_border_color || '#e2e8f0', // Slate-200
        input_bg: theme.input_bg_color || '#ffffff',
        input_border: theme.input_border_color || '#cbd5e1', // Slate-300
        input_focus: theme.form_focus || theme.primary_button || '#2563eb', // Blue-600

        // Status
        success: theme.success_color || '#16a34a', // Green-600
        warning: theme.warning_color || '#ca8a04', // Yellow-600
        error: theme.error_color || '#dc2626', // Red-600
        info: theme.info_color || '#0284c7', // Sky-600
    };

    // Construct the CSS variables and overrides
    // We override semantic tailwind classes to force the theme.
    // This is the aggressive "expert" global application.
    const css = `
        :root {
            /* Palette */
            --primary: ${colors.primary};
            --secondary: ${colors.secondary};
            --page-bg: ${colors.page_bg};
            --card-bg: ${colors.card_bg};
            --card-border: ${colors.card_border};
            
            /* Text */
            --text-main: ${colors.text_main};
            --text-secondary: ${colors.text_secondary};
            --font-main: "${colors.font_main}", sans-serif;
            
            /* Inputs */
            --input-focus: ${colors.input_focus};
            --input-bg: ${colors.input_bg};
            --input-border: ${colors.input_border};

            /* Navbar Gradient */
            --nav-gradient: linear-gradient(to right, ${colors.nav_start}, ${colors.nav_mid || colors.nav_end}, ${colors.nav_end});
            --nav-text: ${colors.nav_text};
            --nav-dropdown-bg: ${colors.nav_dropdown_bg};
            --nav-item-bg: ${colors.nav_item_bg};
        }

        /* Global Resets */
        body {
            font-family: var(--font-main) !important;
            background-color: var(--page-bg) !important;
            color: var(--text-main) !important;
        }

        /* Semantic Overrides - Enabling Global Control over existing UI */
        .bg-white { background-color: var(--card-bg) !important; }
        .bg-gray-50, .bg-gray-100 { background-color: var(--page-bg) !important; border-color: var(--card-border) !important; }
        
        .text-gray-900, .text-gray-800, .text-gray-700 { color: var(--text-main) !important; }
        .text-gray-600, .text-gray-500 { color: var(--text-secondary) !important; }
        
        /* Cards - Only target explicit cards or generic containers, NOT buttons */
        div.shadow-sm, div.shadow-md, div.shadow-lg, div.shadow-xl {
            /* background-color: var(--card-bg) !important; REMOVED this as it breaks buttons */
            /* border-color: var(--card-border) !important; */
        }

        /* Inputs */
        input[type="text"], input[type="email"], input[type="password"], textarea, select {
            background-color: var(--input-bg) !important;
            border-color: var(--input-border) !important;
            color: var(--text-main) !important;
        }
        input:focus, textarea:focus, select:focus {
            --tw-ring-color: var(--input-focus) !important;
            border-color: var(--input-focus) !important;
        }

        /* Nav Item Override to beat the Global Shadow Override */
        .nav-item-override {
            background-color: var(--nav-item-bg) !important;
        }
    `;

    return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
