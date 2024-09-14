import React from 'react';
import Aboutpage from '@/components/pages/about';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About',
    description:
        'From a small team of five people to a leading global remote team of professional designers & developers that strive to develop valuable digital products for people worldwide.',
};
function page() {
    return <Aboutpage />;
}

export default page;
