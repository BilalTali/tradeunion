import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                union: {
                    primary: '#dc2626', // red-600 (I-Card theme)
                    secondary: '#d97706', // amber-600
                }
            },
            screens: {
                'xs': '375px',  // Extra small devices (phones)
                ...defaultTheme.screens,
            },
            minHeight: {
                'touch': '44px',  // Minimum touch target size
            },
            minWidth: {
                'touch': '44px',  // Minimum touch target size
            },
        },
    },

    plugins: [forms],
};
