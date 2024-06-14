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
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            colors: {
                slate: {
                    1000: '#1a1a1a',
                    1050: '#484848',
                    1100: '#a3a3a3',
                },
                blue: {
                    1000: '#1A1AFF',
                },
            },
        },

        fontFamily: {
            'pp-mori': 'var(--font-pp-mori)',
            eudoxus: 'var(--font-eudoxus)',
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
