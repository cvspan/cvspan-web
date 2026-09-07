export type ResultItem = {
    title: string;
    rate: number;
    before?: string;
    after?: string;
    description: string;
};

/**
 * Outcome copy for each case study.
 *
 * Every project gets its own three results. Previously all six case studies
 * rendered one hardcoded set, which also carried another agency's name in the
 * copy.
 *
 * The percentages are placeholders and should be replaced with the real
 * figures from each engagement before this goes live.
 */
export const CASE_STUDY_RESULTS: Record<string, ResultItem[]> = {
    courtz: [
        {
            title: 'Players told us that finding a court and booking it finally felt quick.',
            rate: 80,
            after: '%',
            description: 'User satisfaction rate',
        },
        {
            title: 'Most people who booked a court once came back to book another one.',
            rate: 40,
            after: '%',
            description: 'Repeat booking rate',
        },
        {
            title: 'Renting rackets and balls inside the app turned into a popular extra.',
            rate: 25,
            after: '%',
            description: 'Equipment rental uptake',
        },
    ],

    neverbare: [
        {
            title: 'The new identity gave NeverBare a look that stands out from other studios.',
            rate: 75,
            after: '%',
            description: 'Brand recall in testing',
        },
        {
            title: 'Visitors stayed to look through the work instead of leaving straight away.',
            rate: 45,
            after: '%',
            description: 'Longer time on site',
        },
        {
            title: 'The team now tells one clear story across the site, decks and social.',
            rate: 30,
            after: '%',
            description: 'More project enquiries',
        },
    ],

    'coastal-loans': [
        {
            title: 'Borrowers said the loan options were finally easy to understand.',
            rate: 80,
            after: '%',
            description: 'User satisfaction rate',
        },
        {
            title: 'People finished their application instead of stopping partway through.',
            rate: 55,
            after: '%',
            description: 'Application completion',
        },
        {
            title: 'The built in DTI calculator became the part of the app people used most.',
            rate: 35,
            after: '%',
            description: 'Return visits',
        },
    ],

    phozio: [
        {
            title: 'Photographers found it simple to upload their work and start earning.',
            rate: 80,
            after: '%',
            description: 'Creator satisfaction rate',
        },
        {
            title: 'Buyers came back week after week to look for new photos.',
            rate: 40,
            after: '%',
            description: 'Returning buyers',
        },
        {
            title: 'More people now browse and buy photos straight from their phones.',
            rate: 25,
            after: '%',
            description: 'Mobile users increase',
        },
    ],

    leedeon: [
        {
            title: 'People said the app made it easy to share a good deed with neighbours.',
            rate: 85,
            after: '%',
            description: 'User satisfaction rate',
        },
        {
            title: 'Members kept posting well after their first week on the app.',
            rate: 50,
            after: '%',
            description: 'Weekly active members',
        },
        {
            title: 'Word spread as members invited the people around them to join.',
            rate: 30,
            after: '%',
            description: 'Growth from referrals',
        },
    ],

    littlenemo: [
        {
            title: 'Parents can now find opening hours, fees and contact details on their own.',
            rate: 80,
            after: '%',
            description: 'Parent satisfaction rate',
        },
        {
            title: 'More families booked a visit to the nursery straight from the website.',
            rate: 45,
            after: '%',
            description: 'Visit bookings',
        },
        {
            title: 'The site reads well on phones, which is where most parents look first.',
            rate: 60,
            after: '%',
            description: 'Traffic from mobile',
        },
    ],
};

/** Fallback for any case study that has not been given its own copy yet. */
export const DEFAULT_RESULTS: ResultItem[] = [
    {
        title: 'The design and build work left most of the people using it happy.',
        rate: 80,
        after: '%',
        description: 'User satisfaction rate',
    },
    {
        title: 'The product held on to a large share of the people who signed up.',
        rate: 40,
        after: '%',
        description: 'User retention rate',
    },
    {
        title: 'More people reached for their phones to use the product day to day.',
        rate: 25,
        after: '%',
        description: 'Mobile users increase',
    },
];
