import React from 'react';
import ContactPage from '@/components/pages/contact';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Our Team',
    description:
        'Talk to the CVSpan team about your next digital product. We design and build websites, mobile apps and brand identities for startups and enterprises.',
};

function page() {
    return <ContactPage />;
}

export default page;
