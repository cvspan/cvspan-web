import type { Config } from 'tailwindcss';

const config = {
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        extend: {
            backgroundImage: {
                'fact-figure': 'url(../../public/assets/icons/fact_frame.svg)',
                'cta-bg': 'url(../../public/assets/images/CTA.png)',
            },

            fontFamily: {
                'pp-mori': 'var(--font-pp-mori)',
                eudoxus: 'var(--font-eudoxus)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
