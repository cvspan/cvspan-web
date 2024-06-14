import { NavButton, NavLink, NavbarList } from '../types';

export const NavButtons: NavButton[] = [
    {
        id: 1,
        text: 'Services',
    },
    {
        id: 2,
        text: 'Industries',
    },
];

export const NavLinks: NavLink[] = [
    {
        id: 1,
        text: 'About',
        link: '/',
    },
    {
        id: 2,
        text: 'Blog',
        link: '/',
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
            },
            {
                id: 2,
                title: 'Website Design',
                caption: 'Custom Websites, Landing Page',
            },
            {
                id: 3,
                title: 'Mobile Design',
                caption: 'Make your product competitive',
            },
            {
                id: 4,
                title: 'Brand Identity',
                caption: 'Logo, Typography,Color',
            },
            {
                id: 5,
                title: 'Graphic Design',
                caption: 'Illustrations, Icons, Social Media',
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
            },
            {
                id: 2,
                title: 'Landing page',
                caption: 'High-converting website',
            },
            {
                id: 3,
                title: 'Web Development',
                caption: 'Front-End & Back-End Development',
            },
            {
                id: 4,
                title: 'Mobile Development',
                caption: 'IOS, Android, Cross-platform',
            },
            {
                id: 5,
                title: 'DevOps',
                caption: 'QA, Manual testing, Engineering',
            },
        ],
    },
];
