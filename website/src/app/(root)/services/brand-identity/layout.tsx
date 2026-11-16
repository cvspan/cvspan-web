import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Brand Design & Identity Consulting',
    description:
        'Make your brand capture its audience. We build distinctive identities — logo, typography, colour and voice — that tell a memorable story and connect with people.',
    path: '/services/brand-identity',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Brand Design & Identity Consulting',
            description:
                'Make your brand capture its audience. We build distinctive identities — logo, typography, colour and voice — that tell a memorable story and connect with people.',
            path: '/services/brand-identity',
            serviceType: 'Brand Identity Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Brand Identity', path: '/services/brand-identity' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
