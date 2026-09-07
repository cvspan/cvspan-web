import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Landing Page Design Services',
    description:
        'Our landing page design team helps you increase online visibility, generate more qualified leads and convert them into repeat customers with high-converting pages.',
    path: '/services/landing-page',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Landing Page Design Services',
            description:
                'Our landing page design team helps you increase online visibility, generate more qualified leads and convert them into repeat customers with high-converting pages.',
            path: '/services/landing-page',
            serviceType: 'Landing Page Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Landing Pages', path: '/services/landing-page' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
