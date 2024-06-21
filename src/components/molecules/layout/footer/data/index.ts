import { Address, FooterLink, Social, THIRD_PARTY_LINK } from '../types';

export const FOOTER_LINKS: FooterLink[] = [
    {
        id: 1,
        text: 'Design',
        links: [
            {
                id: 1,
                text: 'UI/UX Design',
                link: '/',
            },
            {
                id: 2,
                text: 'Web Design',
                link: '/',
            },
            {
                id: 3,
                text: 'Mobile Design',
                link: '/',
            },
            {
                id: 4,
                text: 'Brand Identity',
                link: '/',
            },
            {
                id: 5,
                text: 'Graphic Design',
                link: '/',
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
                link: '/',
            },
            {
                id: 2,
                text: 'Web Development',
                link: '/',
            },
            {
                id: 3,
                text: 'Webflow Devlopment',
                link: '/',
            },
            {
                id: 4,
                text: 'Mobile Development',
                link: '/',
            },
            {
                id: 5,
                text: 'DevOps',
                link: '/',
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
                link: '/',
            },
            {
                id: 2,
                text: 'Fintech',
                link: '/',
            },
            {
                id: 3,
                text: 'Healthcare & Wellness',
                link: '/',
            },
            {
                id: 4,
                text: 'Web3 Blockchain',
                link: '/',
            },
            {
                id: 5,
                text: 'Saas',
                link: '/',
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
                link: '/',
            },
            {
                id: 2,
                text: 'About',
                link: '/',
            },
            {
                id: 3,
                text: 'Blog',
                link: '/',
            },
            {
                id: 4,
                text: 'Contact Us',
                link: '/',
            },
            {
                id: 5,
                text: 'Careers',
                link: '/',
            },
        ],
    },
];

export const THIRD_PARTY_LINKS: THIRD_PARTY_LINK[] = [
    {
        id: 1,
        text: 'Cookie Policy',
        link: '/',
    },
    {
        id: 2,
        text: 'Privacy Policy',
        link: '/',
    },
    {
        id: 3,
        text: 'Terms of Use',
        link: '/',
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
