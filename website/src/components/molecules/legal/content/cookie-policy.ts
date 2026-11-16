import { LegalDocument } from '../types';

export const COOKIE_POLICY: LegalDocument = {
    title: 'Cookie Policy',
    updated: 'Last updated 5 September 2026',
    intro: [
        {
            type: 'paragraph',
            text: 'This policy explains how CVSpan uses cookies on www.cvspan.com, what each type does, and how you can turn them off. It sits alongside our Privacy Policy, which covers personal information more broadly.',
        },
    ],
    sections: [
        {
            heading: 'What cookies are',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'A cookie is a small text file that a website saves on your computer, tablet or phone when you visit. It lets the site recognise your device on your next visit and remember a few things about how you used it.',
                },
                {
                    type: 'paragraph',
                    text: 'We also use similar technology such as pixels and local storage. To keep this readable we call all of it cookies.',
                },
            ],
        },
        {
            heading: 'Why we use them',
            blocks: [
                { type: 'paragraph', text: 'We use cookies to:' },
                {
                    type: 'list',
                    items: [
                        'Keep the website working properly and securely',
                        'Remember your preferences so you do not have to set them again',
                        'Count visits and see which pages people actually read, so we know what to improve',
                        'Measure whether our campaigns are reaching the right people',
                    ],
                },
            ],
        },
        {
            heading: 'The cookies we use',
            blocks: [
                { type: 'subheading', text: 'Essential cookies' },
                {
                    type: 'paragraph',
                    text: 'These keep the site running. They handle things like page loading, security and remembering what you typed into a form. The site will not work properly without them, so they cannot be switched off from here.',
                },
                { type: 'subheading', text: 'Performance cookies' },
                {
                    type: 'paragraph',
                    text: 'These tell us how people move around the site, which pages are popular and where visitors run into trouble. The data is grouped together and does not identify you personally. We use it to make the site clearer and faster.',
                },
                { type: 'subheading', text: 'Functional cookies' },
                {
                    type: 'paragraph',
                    text: 'These remember choices you have made, such as your language, so the site feels familiar when you come back.',
                },
                { type: 'subheading', text: 'Marketing cookies' },
                {
                    type: 'paragraph',
                    text: 'These help us understand which adverts and posts brought people to our website, and stop you seeing the same advert over and over. We only use them where you have agreed.',
                },
            ],
        },
        {
            heading: 'Cookies set by others',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Some cookies on our site are set by other companies rather than by us. This happens when we use their tools or when their content appears on a page.',
                },
                {
                    type: 'list',
                    items: [
                        'Analytics providers, which tell us how the site is being used',
                        'Social platforms such as LinkedIn, Instagram, Facebook, X, TikTok and YouTube, when their buttons or embedded posts appear on a page',
                        'Video and font services that help pages load and display correctly',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'We do not control these cookies. Each provider publishes its own policy, and it is worth reading if you want the detail.',
                },
            ],
        },
        {
            heading: 'How to control cookies',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'You are in charge. Every major browser lets you see what is stored, delete it, and block new cookies. Look under Settings, then Privacy.',
                },
                {
                    type: 'list',
                    items: [
                        'Chrome: Settings, then Privacy and security, then Cookies and other site data',
                        'Safari: Settings, then Privacy',
                        'Firefox: Settings, then Privacy and Security',
                        'Edge: Settings, then Cookies and site permissions',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'On a phone you will find the same options in your browser or device settings. If you block everything, parts of our site may stop behaving as they should.',
                },
            ],
        },
        {
            heading: 'How long they last',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Session cookies disappear as soon as you close your browser. Persistent cookies stay on your device until they expire or until you clear them, which for us is normally no longer than twelve months.',
                },
            ],
        },
        {
            heading: 'Changes to this policy',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'If we start using cookies in a new way we will update this page and change the date at the top. It is worth checking back now and then.',
                },
            ],
        },
        {
            heading: 'Contact us',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'If you have a question about cookies on our site, email business@cvspan.com and we will come back to you.',
                },
            ],
        },
    ],
};
