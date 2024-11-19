import React from 'react';
import Aboutpage from '@/components/pages/about';
import type { Metadata } from 'next';

import site_metadata from '@/utils/site-metadata';

export const metadata: Metadata = {
    title: site_metadata?.about?.title,
    description: site_metadata?.about?.description,
    openGraph: {
        title: site_metadata?.about?.title,
        description: site_metadata?.about?.description,
        url: site_metadata?.about?.url,
        siteName: site_metadata?.about?.siteName,
        images: site_metadata?.about?.images,
    },
};

function page() {
    return <Aboutpage />;
}

export default page;
