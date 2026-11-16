export type TCaseStudy = {
    id?: string;
    img?: string;
    title?: string;
    description?: string;
    link?: string;
};

export const caseStudies: TCaseStudy[] = [
    {
        id: '1',
        img: '/assets/images/case-studies/case-1.webp',
        title: 'Courtz',
        description:
            'Your ultimate destination for hassle-free outdoor tennis court bookings and sports equipment rentals.',
        link: '/our-works/courtz',
    },
    {
        id: '2',
        img: '/assets/images/case-studies/case-2.webp',
        title: 'Coastal Loans',
        description:
            'An app that offers personalized mortgage loans based on your credit score and calculates your DTI ratio, ensuring informed decisions.',
        link: '/our-works/coastal-loans',
    },

    {
        id: '3',
        img: '/assets/images/case-studies/case-3.webp',
        title: 'Phozio',
        description: 'With Phozio, users can discover the best photo and earn money from sharing photos.',
        link: '/our-works/phozio',
    },
    {
        id: '4',
        img: '/assets/images/case-studies/case-4.webp',
        title: 'Little Nemo',
        description: 'Little Nemo Nursery, is a nursery in Tufnell Park Road London, United Kingdom.',
        link: '/our-works/littlenemo',
    },
];
