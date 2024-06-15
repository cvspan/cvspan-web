import { url } from 'inspector';
import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: '100%' },
                },
                'accordion-up': {
                    from: { height: '100%' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            fontSize: {
                'h2-clamp': 'clamp(1.5rem, 4.6875vw, 3.75rem)',
                'h3-clamp': 'clamp(2rem, 4.6875vw, 3rem)',
                'h5-clamp': 'clamp(1rem, 4.6875vw, 1.5rem)',
            },
            colors: {
                'custom-dark': '#0C0C0C',
                'cod-gray': '#1A1A1A',
                tundora: '#484848',
                'silver-chalice': '#A3A3A3',
            },
            backgroundImage: {
                'fact-figure': 'url(../../public/assets/icons/fact_frame.svg)',
            },
            fontFamily: {
                'pp-mori': ['"PP Mori"', 'sans serif'],
                eudoxus: ['"Eudoxus"', 'sans-serif'],
                'pp-mori-semibold': ['"PP Mori SemiBold"', 'sans-serif'],
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
