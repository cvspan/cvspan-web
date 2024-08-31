import { Address, FooterLink, Social, THIRD_PARTY_LINK } from '../types';

export const FOOTER_LINKS: FooterLink[] = [
    {
        id: 1,
        text: 'Design',
        links: [
            {
                id: 1,
                text: 'UI/UX Design',
                link: '/services/ui-ux-design',
            },
            {
                id: 2,
                text: 'Web Design',
                link: '/services/website-design',
            },
            {
                id: 3,
                text: 'Mobile Design',
                link: '/services/mobile-design',
            },
            {
                id: 4,
                text: 'Brand Identity',
                link: '/services/brand-identity',
            },
            {
                id: 5,
                text: 'Graphic Design',
                link: '/services/graphic-design',
            },
        ],
    },
    {
        id: 2,
        text: 'Development',
        links: [
            {
                id: 1,
                text: 'Landing Page',
                link: '/services/landing-page',
            },
            {
                id: 2,
                text: 'Web Development',
                link: '/services/web-development',
            },
            {
                id: 3,
                text: 'Webflow Devlopment',
                link: '/services/webflow-development',
            },
            {
                id: 4,
                text: 'Mobile Development',
                link: '/services/mobile-development',
            },
            {
                id: 5,
                text: 'DevOps',
                link: '/services/devops',
            },
        ],
    },
    {
        id: 3,
        text: 'Industries',
        links: [
            {
                id: 1,
                text: 'AI & ML',
                link: '/industries/ai-ml',
            },
            {
                id: 2,
                text: 'Fintech',
                link: '/industries/fintech',
            },
            {
                id: 3,
                text: 'Healthcare & Wellness',
                link: '/industries/healthcare-welness',
            },
            {
                id: 4,
                text: 'Web3 Blockchain',
                link: '/industries/web3-blockchain',
            },
            {
                id: 5,
                text: 'Saas',
                link: '/industries/saas',
            },
        ],
    },
    {
        id: 4,
        text: 'Company',
        links: [
            {
                id: 1,
                text: 'Our works',
                link: '/our-works',
            },
            {
                id: 2,
                text: 'About',
                link: '/about',
            },
            {
                id: 3,
                text: 'Blog',
                link: '/cvspan-blog',
            },
            {
                id: 4,
                text: 'Contact Us',
                link: '/contact',
            },
            {
                id: 5,
                text: 'Careers',
                link: '/careers',
            },
        ],
    },
];

export const THIRD_PARTY_LINKS: THIRD_PARTY_LINK[] = [
    {
        id: 1,
        text: 'Cookie Policy',
        link: '/legal/cookie-policy',
    },
    {
        id: 2,
        text: 'Privacy Policy',
        link: '/legal/privacy-policy',
    },
    {
        id: 3,
        text: 'Terms of Use',
        link: '/legal/terms-of-use',
    },
];

export const SOCIALS: Social[] = [
    {
        id: 1,
        name: 'facebook',
        asset: '/assets/images/facebook.svg',
    },
    {
        id: 2,
        name: 'twitter',
        asset: '/assets/images/x.svg',
    },
    {
        id: 3,
        name: 'instgram',
        asset: '/assets/images/instagram.svg',
    },
    {
        id: 4,
        name: 'linkedin',
        asset: '/assets/images/linkedin.svg',
    },
    {
        id: 5,
        name: 'youtube',
        asset: '/assets/images/youtube.svg',
    },
];

export const ADDRESSES: Address[] = [
    {
        id: 1,
        region: 'Ukraine, Odesa',
        address: 'Haharinske Plateau, 5/3',
        phone: '+38-093-1234-567',
    },
    {
        id: 2,
        region: 'Romania, Bucharest',
        address: 'Park Herastrau 27',
        phone: '+40-123-4567-890',
    },
];
