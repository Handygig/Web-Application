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
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                theme: {
                    accent: 'var(--color-accent)',
                    'accent-hover': 'var(--color-accent-hover)',
                    'accent-soft': 'var(--color-accent-soft)',
                    'bg-light': 'var(--color-bg-light)',
                },
            },
            keyframes: {
                jello: {
                    '0%, 100%': { transform: 'scale(1, 1)' },
                    '25%': { transform: 'scale(0.9, 1.15)' },
                    '50%': { transform: 'scale(1.15, 0.85)' },
                    '75%': { transform: 'scale(0.95, 1.05)' },
                },
            },
            animation: {
                jello: 'jello 0.8s ease-in-out both',
            },
        },
    },

    plugins: [forms],
};
