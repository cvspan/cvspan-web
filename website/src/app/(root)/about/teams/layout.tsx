import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Our Team — Designers, Engineers & Strategists',
    description:
        'Meet the CVSpan team: a global remote group of product designers, engineers and strategists building valuable digital products for clients worldwide.',
    path: '/about/teams',
    hasChildRoutes: true,
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Team', path: '/about/teams' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
