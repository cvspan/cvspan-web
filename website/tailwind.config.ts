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

            fontFamily: {
                'pp-mori': 'var(--font-pp-mori)',
                eudoxus: 'var(--font-eudoxus)',
            },

            transitionTimingFunction: {
                /**
                 * Decelerating curve used for anything that opens, expands or
                 * follows the pointer: fast to start, settling gently rather
                 * than stopping dead. Named rather than written inline so the
                 * accordion, cursor and hover states cannot drift apart.
                 */
                fluid: 'cubic-bezier(0.22, 1, 0.36, 1)',
            },

            boxShadow: {
                /**
                 * Elevation for floating surfaces such as the mega menu.
                 *
                 * Three stacked layers instead of one heavy drop: a hairline
                 * contact edge, a soft mid spread, and a wide ambient shadow.
                 * The tint is a desaturated navy rather than pure black, which
                 * reads much softer against white than rgba(0,0,0,.25) did.
                 */
                menu: '0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -6px rgba(16, 24, 40, 0.10), 0 28px 56px -12px rgba(16, 24, 40, 0.14)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
