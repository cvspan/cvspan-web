import React from 'react';
import ContactPage from '@/components/pages/contact';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Our Team',
    description: 'We Create Awesome Stuf',
};

function page() {
    return <ContactPage />;
}

export default page;
