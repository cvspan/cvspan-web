import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Courtz — Tennis Court Booking App Case Study',
    description:
        'How CVSpan designed Courtz, a mobile app for instant outdoor tennis court booking and sports equipment rental, covering UX strategy, UI, 3D and branding.',
    path: '/our-works/courtz',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        creativeWorkSchema({
            name: 'Courtz',
            description:
                'How CVSpan designed Courtz, a mobile app for instant outdoor tennis court booking and sports equipment rental, covering UX strategy, UI, 3D and branding.',
            path: '/our-works/courtz',
            image: '/assets/images/case-studies/case-1.webp',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Works', path: '/our-works' },
            { name: 'Courtz', path: '/our-works/courtz' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
