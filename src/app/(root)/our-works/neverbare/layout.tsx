import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'NeverBare — Design Agency Brand Case Study',
    description:
        'How CVSpan built the NeverBare brand and digital identity — a design agency that turns bold ideas into captivating visual experiences.',
    path: '/our-works/neverbare',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        creativeWorkSchema({
            name: 'NeverBare',
            description:
                'How CVSpan built the NeverBare brand and digital identity — a design agency that turns bold ideas into captivating visual experiences.',
            path: '/our-works/neverbare',
            image: '/assets/images/case-studies/case-2.webp',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Works', path: '/our-works' },
            { name: 'NeverBare', path: '/our-works/neverbare' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
