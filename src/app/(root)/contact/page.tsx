import React from 'react';
import ContactPage from '@/components/pages/contact';

import type { Metadata } from 'next';

import site_metadata from '@/utils/site-metadata';

export const metadata: Metadata = {
    title: site_metadata?.contactUs?.title,
    description: site_metadata?.contactUs?.description,
    openGraph: {
        title: site_metadata?.contactUs?.title,
        description: site_metadata?.contactUs?.description,
        url: site_metadata?.contactUs?.url,
        siteName: site_metadata?.contactUs?.siteName,
        images: site_metadata?.contactUs?.images,
    },
};
function page() {
    return <ContactPage />;
}

export default page;
