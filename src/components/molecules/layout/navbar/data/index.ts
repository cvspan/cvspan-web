import { NavButton, NavLink, NavbarList } from '../types';

export const NavButtons: NavButton[] = [
    {
        id: 1,
        text: 'Services',
        links: [
            {
                id: 1,
                title: 'Design',
                list: [
                    {
                        id: 1,
                        title: 'UI/UX Design',
                        caption: 'Web & Mobile App Design',
                        link: '/services/ui-ux-design',
                    },
                    {
                        id: 2,
                        title: 'Website Design',
                        caption: 'Custom Websites, Landing Page',
                        link: '/services/website-design',
                    },
                    {
                        id: 3,
                        title: 'Mobile Design',
                        caption: 'Make your product competitive',
                        link: '/services/mobile-design',
                    },
                    {
                        id: 4,
                        title: 'Brand Identity',
                        caption: 'Logo, Typography,Color',
                        link: '/services/brand-identity',
                    },
                    {
                        id: 5,
                        title: 'Graphic Design',
                        caption: 'Illustrations, Icons, Social Media',
                        link: '/services/graphic-design',
                    },
                ],
            },
            {
                id: 2,
                title: 'Development',
                list: [
                    {
                        id: 1,
                        title: 'Webflow Development',
                        caption: 'Site builder solutions',
                        link: '/services/webflow-development',
                    },
                    {
                        id: 2,
                        title: 'Landing page',
                        caption: 'High-converting website',
                        link: '/services/landing-page',
                    },
                    {
                        id: 3,
                        title: 'Web Development',
                        caption: 'Front-End & Back-End Development',
                        link: '/services/web-development',
                    },
                    {
                        id: 4,
                        title: 'Mobile Development',
                        caption: 'IOS, Android, Cross-platform',
                        link: '/services/mobile-development',
                    },
                    {
                        id: 5,
                        title: 'DevOps',
                        caption: 'QA, Manual testing, Engineering',
                        link: '/services/devops',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        text: 'Industries',
        links: [
            {
                id: 1,
                title: 'Industries',
                list: [
                    {
                        id: 1,
                        title: 'AI & ML',
                        caption: 'Analysing tools, Chatbots, Crypto',
                        link: '/industries/ai-ml',
                    },
                    {
                        id: 2,
                        title: 'Fintech',
                        caption: 'Banking, Digital Payments, Exchanges',
                        link: '/industries/fintech',
                    },
                    {
                        id: 3,
                        title: 'Healthcare',
                        caption: 'Mental health, Insurance, Fitness',
                        link: '/industries/healthcare-wellness',
                    },
                    {
                        id: 4,
                        title: 'Web 3, Blockchain',
                        caption: 'Crypto, DeFi, DEX, NFT',
                        link: '/industries/web3-blockchain',
                    },
                    {
                        id: 5,
                        title: 'Saas',
                        caption: 'CMR, HR, AI, ERP, Automation',
                        link: '/industries/saas',
                    },
                ],
            },
        ],
    },
];

export const NavLinks: NavLink[] = [
    {
        id: 1,
        text: 'About',
        link: '/about',
    },
    {
        id: 2,
        text: 'Blog',
        link: '/blog',
    },
    {
        id: 3,
        text: 'Pricing',
        link: '/',
    },
    {
        id: 4,
        text: 'Resources',
        link: '/',
    },
];

export const NAVBAR_LIST: NavbarList[] = [
    {
        id: 1,
        title: 'Design',
        list: [
            {
                id: 1,
                title: 'UI/UX Design',
                caption: 'Web & Mobile App Design',
                link: '/services/ui-ux-design',
            },
            {
                id: 2,
                title: 'Website Design',
                caption: 'Custom Websites, Landing Page',
                link: '/services/website-design',
            },
            {
                id: 3,
                title: 'Mobile Design',
                caption: 'Make your product competitive',
                link: '/services/mobile-design',
            },
            {
                id: 4,
                title: 'Brand Identity',
                caption: 'Logo, Typography,Color',
                link: '/services/brand-identity',
            },
            {
                id: 5,
                title: 'Graphic Design',
                caption: 'Illustrations, Icons, Social Media',
                link: '/services/graphic-design',
            },
        ],
    },
    {
        id: 2,
        title: 'Development',
        list: [
            {
                id: 1,
                title: 'Webflow Development',
                caption: 'Site builder solutions',
                link: '/services/webflow-development',
            },
            {
                id: 2,
                title: 'Landing page',
                caption: 'High-converting website',
                link: '/services/landing-page',
            },
            {
                id: 3,
                title: 'Web Development',
                caption: 'Front-End & Back-End Development',
                link: '/services/web-development',
            },
            {
                id: 4,
                title: 'Mobile Development',
                caption: 'IOS, Android, Cross-platform',
                link: '/services/mobile-development',
            },
            {
                id: 5,
                title: 'DevOps',
                caption: 'QA, Manual testing, Engineering',
                link: '/services/devops',
            },
        ],
    },
];
