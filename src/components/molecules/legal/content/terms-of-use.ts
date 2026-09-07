import { LegalDocument } from '../types';

export const TERMS_OF_USE: LegalDocument = {
    title: 'Terms of Use',
    updated: 'Last updated 5 September 2026',
    intro: [
        {
            type: 'paragraph',
            text: 'These terms cover your use of www.cvspan.com. By browsing the site you accept them. If you do not agree with something here, please stop using the site.',
        },
        {
            type: 'paragraph',
            text: 'Separate terms apply when you hire us. Those are set out in the proposal and contract we sign with you, and they take priority over anything on this page.',
        },
    ],
    sections: [
        {
            heading: 'Who we are',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'CVSpan is a design and development agency with offices in London and Abuja. Where these terms say we, us or our, they mean CVSpan. Where they say you, they mean the person using this website.',
                },
            ],
        },
        {
            heading: 'Using this website',
            blocks: [
                { type: 'paragraph', text: 'You are welcome to browse, read and share our pages. Please do not:' },
                {
                    type: 'list',
                    items: [
                        'Use the site for anything unlawful, or in a way that breaks someone else’s rights',
                        'Try to break into the site, its server or any connected system',
                        'Upload anything harmful, such as a virus or malicious script',
                        'Scrape or copy the site in bulk, whether by hand or with automated tools',
                        'Pass yourself off as us, or suggest we endorse you when we do not',
                        'Overload the site or interfere with anyone else’s use of it',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'We can suspend access if we believe someone is doing any of the above.',
                },
            ],
        },
        {
            heading: 'Our content',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Everything on this site belongs to us or to the people we licensed it from. That includes the writing, layout, graphics, illustrations, icons, photography, code and the CVSpan name and logo. It is protected by copyright and trade mark law.',
                },
                {
                    type: 'paragraph',
                    text: 'You may view pages on screen, print a copy for your own reference and share a link with someone. Anything beyond that needs our written permission first, including:',
                },
                {
                    type: 'list',
                    items: [
                        'Republishing our writing or images anywhere else',
                        'Selling, renting or licensing any part of the site',
                        'Copying our design or code into another product',
                        'Using our name or logo in your own marketing',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'If you want to use something of ours, just ask. Email business@cvspan.com and tell us what you have in mind.',
                },
            ],
        },
        {
            heading: 'Work shown in our portfolio',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Our case studies show projects we delivered for clients. The brands, product names and logos in them belong to those clients, not to us, and they appear here to show what we worked on. Showing a project does not mean that client endorses you or anyone else.',
                },
                {
                    type: 'paragraph',
                    text: 'Figures quoted in case studies describe results in that project and are not a promise of what your project will achieve.',
                },
            ],
        },
        {
            heading: 'Anything you send us',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'When you send us a message, a brief or an idea through this website, you keep ownership of it. You are giving us permission to read it, store it and reply to you.',
                },
                {
                    type: 'paragraph',
                    text: 'Please only send us material you have the right to share, and do not send confidential information through the contact form. If a project needs us to see something sensitive, we will put a confidentiality agreement in place first.',
                },
            ],
        },
        {
            heading: 'Links to other sites',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We link out to other websites, including our social profiles and the sites of clients and partners. We do not run those sites and we are not responsible for what appears on them. Following a link is your own decision.',
                },
                {
                    type: 'paragraph',
                    text: 'You are welcome to link to our home page, as long as you do it fairly and do not suggest a relationship with us that does not exist.',
                },
            ],
        },
        {
            heading: 'Accuracy of the information here',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We keep this site up to date as best we can, but we do not promise that everything on it is complete or current at any given moment. Nothing here is professional advice for your particular situation. If you are making a decision that matters, talk to us or to a suitable adviser first.',
                },
            ],
        },
        {
            heading: 'Availability',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We aim to keep the site up and running, but we cannot promise it will always be available. We may take it offline for maintenance, updates or reasons outside our control, and we may change or remove parts of it without telling you in advance.',
                },
            ],
        },
        {
            heading: 'Our responsibility to you',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Nothing in these terms limits our responsibility for death or personal injury caused by our negligence, for fraud, or for anything else the law says we cannot exclude.',
                },
                {
                    type: 'paragraph',
                    text: 'Beyond that, and to the extent the law allows, we are not liable for loss of profit, loss of business, loss of data or any indirect loss that follows from using this website.',
                },
            ],
        },
        {
            heading: 'Your privacy',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'How we handle your personal information is set out in our Privacy Policy, and how we use cookies is set out in our Cookie Policy. Both form part of these terms.',
                },
            ],
        },
        {
            heading: 'Changes to these terms',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We may update these terms as our business changes. The version on this page is the one that applies, and the date at the top tells you when it last changed. Using the site after a change means you accept the new version.',
                },
            ],
        },
        {
            heading: 'Governing law',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'These terms are governed by the laws of England and Wales, and the courts of England and Wales deal with any dispute about them.',
                },
            ],
        },
        {
            heading: 'Contact us',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Questions about these terms are welcome. Email business@cvspan.com and we will get back to you.',
                },
            ],
        },
    ],
};
