import React from 'react';
import OurWorksPage from '@/components/pages/ourWorks';
import type { Metadata } from 'next';

import site_metadata from '@/utils/site-metadata';

export const metadata: Metadata = {
    title: site_metadata?.ourWorks?.title,
    description: site_metadata?.ourWorks?.description,
    openGraph: {
        title: site_metadata?.ourWorks?.title,
        description: site_metadata?.ourWorks?.description,
        url: site_metadata?.ourWorks?.url,
        siteName: site_metadata?.ourWorks?.siteName,
        images: site_metadata?.ourWorks?.images,
    },
};

function page() {
    return <OurWorksPage />;
}

export default page;
