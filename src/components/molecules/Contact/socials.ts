import { SOCIAL_LINKS } from '@/lib/seo/config';

export type ContactSocial = {
    key: string;
    label: string;
    href: string;
    imageUrlInActive: string;
    imageUrlActive: string;
};

/**
 * Social icons shown on the contact page, shared by the desktop aside and the
 * mobile row so the two can't drift apart. URLs come from SOCIAL_LINKS, which
 * the footer and the Organization structured data also use.
 */
export const CONTACT_SOCIALS: ContactSocial[] = [
    {
        key: 'facebook',
        label: 'Facebook',
        href: SOCIAL_LINKS.facebook,
        imageUrlInActive: '/assets/icons/facebook-light.svg',
        imageUrlActive: '/assets/icons/facebook-blue.svg',
    },
    {
        key: 'twitter',
        label: 'X',
        href: SOCIAL_LINKS.twitter,
        imageUrlInActive: '/assets/icons/twitter-light.svg',
        imageUrlActive: '/assets/icons/twitter-blue.svg',
    },
    {
        key: 'instagram',
        label: 'Instagram',
        href: SOCIAL_LINKS.instagram,
        imageUrlInActive: '/assets/icons/instagram-light.svg',
        imageUrlActive: '/assets/icons/instagram-blue.svg',
    },
    {
        key: 'linkedin',
        label: 'LinkedIn',
        href: SOCIAL_LINKS.linkedin,
        imageUrlInActive: '/assets/icons/linkedin-light.svg',
        imageUrlActive: '/assets/icons/linkedin-blue.svg',
    },
    {
        key: 'youtube',
        label: 'YouTube',
        href: SOCIAL_LINKS.youtube,
        imageUrlInActive: '/assets/icons/youtube-light.svg',
        imageUrlActive: '/assets/icons/youtube-blue.svg',
    },
];
