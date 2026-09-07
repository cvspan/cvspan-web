import { LegalDocument } from '../types';

export const PRIVACY_POLICY: LegalDocument = {
    title: 'Privacy Policy',
    updated: 'Last updated 5 September 2026',
    intro: [
        {
            type: 'paragraph',
            text: 'CVSpan is a design and development agency. We build websites, mobile apps and brand identities for clients around the world. This policy explains what personal information we collect when you use our website or work with us, why we collect it, and what choices you have.',
        },
        {
            type: 'paragraph',
            text: 'We do not sell your personal information. We do not rent or trade contact lists with other companies. If anything here is unclear, write to us at business@cvspan.com and we will explain it in plain terms.',
        },
    ],
    sections: [
        {
            heading: 'Who we are',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'CVSpan is the data controller for the information described in this policy. That means we decide why your information is collected and how it is used.',
                },
                {
                    type: 'paragraph',
                    text: 'You can reach us at business@cvspan.com, or by post at 86 to 90 Paul Street, London, England, EC2A 4NE. We also have an office at No 6 Udysens Crescent, Mabushi, Abuja, Nigeria.',
                },
            ],
        },
        {
            heading: 'Information we collect',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We only collect what we need. Most of it comes directly from you.',
                },
                { type: 'subheading', text: 'Information you give us' },
                {
                    type: 'list',
                    items: [
                        'Your name, email address and any details you include when you fill in our contact form',
                        'Information you share while we scope or deliver a project, including files, feedback and access to systems you ask us to work on',
                        'Your details if you apply for a role with us, including your CV and portfolio',
                        'Your email address if you ask to hear from us',
                    ],
                },
                { type: 'subheading', text: 'Information we collect automatically' },
                {
                    type: 'list',
                    items: [
                        'Your IP address and rough location, which usually means the city or country you are in',
                        'Your browser and device type, and the operating system you use',
                        'Which pages you visited, how long you stayed and which site sent you to us',
                        'Cookie data, which we explain in our Cookie Policy',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'If you send us information about another person, such as a colleague you want us to contact, please make sure they are happy for you to share it.',
                },
            ],
        },
        {
            heading: 'How we use your information',
            blocks: [
                { type: 'paragraph', text: 'We use what we collect to:' },
                {
                    type: 'list',
                    items: [
                        'Reply to your enquiry and talk to you about a possible project',
                        'Deliver work you have hired us to do, and keep you updated on it',
                        'Send invoices and keep our accounting records straight',
                        'Review your application if you apply to join the team',
                        'Understand which parts of our website people find useful, so we can improve it',
                        'Send you updates about our work, but only if you asked to receive them',
                        'Meet our legal and tax obligations',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'We do not make decisions about you using automated processing alone.',
                },
            ],
        },
        {
            heading: 'Our legal grounds for using it',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Data protection law asks us to have a valid reason for using your information. Ours are:',
                },
                {
                    type: 'list',
                    items: [
                        'Contract, when we need your details to quote for work or deliver a project you have hired us for',
                        'Legitimate interests, when we run and improve our website, keep our records in order and protect the business from fraud or misuse',
                        'Consent, when you opt in to marketing emails. You can withdraw it whenever you like',
                        'Legal obligation, when tax or company law requires us to keep certain records',
                    ],
                },
            ],
        },
        {
            heading: 'Who we share it with',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We share your information only where there is a clear reason to. That may include:',
                },
                {
                    type: 'list',
                    items: [
                        'Service providers who help us operate, such as our hosting, email and analytics providers',
                        'Contractors and specialists who work on a project with us, who are bound by confidentiality terms',
                        'Our accountants and legal advisers, where they need it to advise us',
                        'Authorities or regulators, where the law requires us to hand something over',
                        'A buyer or successor, if the business is ever sold or reorganised',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'Everyone we share information with is required to keep it secure and to use it only for the purpose we gave it to them.',
                },
            ],
        },
        {
            heading: 'Sending information abroad',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We work with a remote team and with suppliers in different countries, so your information may be handled outside the country you live in. When that happens, we take steps to make sure it is still protected to a similar standard, usually by putting approved contract terms in place with the provider.',
                },
            ],
        },
        {
            heading: 'How long we keep it',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We keep information for as long as we need it, then remove it.',
                },
                {
                    type: 'list',
                    items: [
                        'Enquiries that do not turn into work are kept for up to two years, in case you come back to us',
                        'Project and client records are kept for seven years after the work ends, because tax rules require it',
                        'Job applications are kept for twelve months unless you ask us to remove them sooner',
                        'Marketing contacts are kept until you unsubscribe',
                    ],
                },
            ],
        },
        {
            heading: 'Your rights',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Depending on where you live, you have some or all of these rights:',
                },
                {
                    type: 'list',
                    items: [
                        'Ask for a copy of the information we hold about you',
                        'Ask us to correct anything that is wrong or out of date',
                        'Ask us to delete your information, where we have no need to keep it',
                        'Ask us to limit how we use it while a question is being sorted out',
                        'Object to us using it for our own legitimate interests',
                        'Ask us to send your information to another provider',
                        'Withdraw your consent to marketing at any time',
                    ],
                },
                {
                    type: 'paragraph',
                    text: 'Email business@cvspan.com and we will respond within one month. There is no charge. If you are not happy with our answer, you can complain to your local data protection regulator. In the UK that is the Information Commissioner’s Office.',
                },
            ],
        },
        {
            heading: 'Keeping your information safe',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We use encrypted connections, limit who on the team can open client files, and review our tools and access regularly. No system online is completely safe, so we cannot promise perfect security, but we treat your information carefully and we will tell you and the regulator promptly if something goes wrong.',
                },
            ],
        },
        {
            heading: 'Cookies',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Our website uses cookies and similar technology. Our Cookie Policy explains which ones we use and how to turn them off.',
                },
            ],
        },
        {
            heading: 'Other websites',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Our site links to other places, including our social profiles and work we have published elsewhere. Once you leave our website you are covered by that site’s privacy policy, not ours, so it is worth reading theirs.',
                },
            ],
        },
        {
            heading: 'Children',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'Our website and services are meant for businesses and adults. We do not knowingly collect information about children under 16. If you think a child has sent us their details, contact us and we will delete them.',
                },
            ],
        },
        {
            heading: 'Changes to this policy',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'We review this policy from time to time. When we change it we update the date at the top of this page. If the change affects you in a meaningful way we will let you know directly where we can.',
                },
            ],
        },
        {
            heading: 'Contact us',
            blocks: [
                {
                    type: 'paragraph',
                    text: 'For anything to do with your information, email business@cvspan.com and put Privacy in the subject line. We are happy to help.',
                },
            ],
        },
    ],
};
