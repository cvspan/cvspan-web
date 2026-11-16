import React from 'react';
import Aboutpage from '@/components/pages/about';
import type { Metadata } from 'next';
import { fetchTeam } from '@/lib/portal';

export const metadata: Metadata = {
    title: 'About Us — A Global Remote Team of Designers & Developers',
    description:
        'From a small team of five to a global remote team of professional designers and developers building valuable digital products for people worldwide.',
};

// The team is managed in the CVSpan Portal; pick up changes within a minute.
export const revalidate = 60;

async function page() {
    const team = await fetchTeam();
    return <Aboutpage team={team} />;
}

export default page;
