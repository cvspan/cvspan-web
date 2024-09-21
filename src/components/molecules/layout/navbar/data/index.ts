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
                        icon: '/assets/icons/ui-ux.svg',
                    },
                    {
                        id: 2,
                        title: 'Website Design',
                        caption: 'Custom Websites, Landing Page',
                        link: '/services/website-design',
                        icon: '/assets/icons/webDesign.svg',
                    },
                    {
                        id: 3,
                        title: 'Mobile Design',
                        caption: 'Make your product competitive',
                        link: '/services/mobile-design',
                        icon: '/assets/icons/MobileDesign.svg',
                    },
                    {
                        id: 4,
                        title: 'Brand Identity',
                        caption: 'Logo, Typography,Color',
                        link: '/services/brand-identity',
                        icon: '/assets/icons/BrandIdentity.svg',
                    },
                    {
                        id: 5,
                        title: 'Graphic Design',
                        caption: 'Illustrations, Icons, Social Media',
                        link: '/services/graphic-design',
                        icon: '/assets/icons/GraphicDesign.svg',
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
                        icon: '/assets/icons/webflowDev.svg',
                    },
                    {
                        id: 2,
                        title: 'Landing page',
                        caption: 'High-converting website',
                        link: '/services/landing-page',
                        icon: '/assets/icons/LandingPage.svg',
                    },
                    {
                        id: 3,
                        title: 'Web Development',
                        caption: 'Front-End & Back-End Development',
                        link: '/services/web-development',
                        icon: '/assets/icons/WebDev.svg',
                    },
                    {
                        id: 4,
                        title: 'Mobile Development',
                        caption: 'IOS, Android, Cross-platform',
                        link: '/services/mobile-development',
                        icon: '/assets/icons/MobileDev.svg',
                    },
                    {
                        id: 5,
                        title: 'DevOps',
                        caption: 'QA, Manual testing, Engineering',
                        link: '/services/devops',
                        icon: '/assets/icons/Devops.svg',
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
                title: '',
                list: [
                    {
                        id: 1,
                        title: 'AI & ML',
                        caption: 'Analysing tools, Chatbots, Crypto',
                        link: '/industries/ai-ml',
                        icon: '/assets/icons/ai.svg',
                    },
                    {
                        id: 2,
                        title: 'Fintech',
                        caption: 'Banking, Digital Payments, Exchanges',
                        link: '/industries/fintech',
                        icon: '/assets/icons/fintech.svg',
                    },
                    {
                        id: 3,
                        title: 'Healthcare',
                        caption: 'Mental health, Insurance, Fitness',
                        link: '/industries/healthcare-wellness',
                        icon: '/assets/icons/healthcare.svg',
                    },
                    {
                        id: 4,
                        title: 'Web 3, Blockchain',
                        caption: 'Crypto, DeFi, DEX, NFT',
                        link: '/industries/web3-blockchain',
                        icon: '/assets/icons/blockchain.svg',
                    },
                    {
                        id: 5,
                        title: 'Saas',
                        caption: 'CMR, HR, AI, ERP, Automation',
                        link: '/industries/saas',
                        icon: '/assets/icons/saas.svg',
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
        disabled: false,
        comingSoon: false,
    },

    {
        id: 2,
        text: 'Our Works',
        link: '/our-works',
        disabled: true,
        comingSoon: true,
    },

    {
        id: 3,
        text: 'Blog',
        link: '/cvspan-blog',
        disabled: true,
        comingSoon: true,
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
                icon: '/assets/icons/ui-ux.svg',
            },
            {
                id: 2,
                title: 'Website Design',
                caption: 'Custom Websites, Landing Page',
                link: '/services/website-design',
                icon: '/assets/icons/webDesign.svg',
            },
            {
                id: 3,
                title: 'Mobile Design',
                caption: 'Make your product competitive',
                link: '/services/mobile-design',
                icon: '/assets/icons/MobileDesign.svg',
            },
            {
                id: 4,
                title: 'Brand Identity',
                caption: 'Logo, Typography,Color',
                link: '/services/brand-identity',
                icon: '/assets/icons/BrandIdentity.svg',
            },
            {
                id: 5,
                title: 'Graphic Design',
                caption: 'Illustrations, Icons, Social Media',
                link: '/services/graphic-design',
                icon: '/assets/icons/GraphicDesign.svg',
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
                icon: '/assets/icons/webflowDev.svg',
            },
            {
                id: 2,
                title: 'Landing page',
                caption: 'High-converting website',
                link: '/services/landing-page',
                icon: '/assets/icons/LandingPage.svg',
            },
            {
                id: 3,
                title: 'Web Development',
                caption: 'Front-End & Back-End Development',
                link: '/services/web-development',
                icon: '/assets/icons/WebDev.svg',
            },
            {
                id: 4,
                title: 'Mobile Development',
                caption: 'IOS, Android, Cross-platform',
                link: '/services/mobile-development',
                icon: '/assets/icons/MobileDev.svg',
            },
            {
                id: 5,
                title: 'DevOps',
                caption: 'QA, Manual testing, Engineering',
                link: '/services/devops',
                icon: '/assets/icons/Devops.svg',
            },
        ],
    },
];
