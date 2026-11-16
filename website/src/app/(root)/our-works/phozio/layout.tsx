import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Phozio — Photo Marketplace App Case Study',
    description:
        'How CVSpan designed Phozio, a marketplace where creators discover great photography and earn from sharing their own work.',
    path: '/our-works/phozio',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        creativeWorkSchema({
            name: 'Phozio',
            description:
                'How CVSpan designed Phozio, a marketplace where creators discover great photography and earn from sharing their own work.',
            path: '/our-works/phozio',
            image: '/assets/images/case-studies/case-4.webp',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Works', path: '/our-works' },
            { name: 'Phozio', path: '/our-works/phozio' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
