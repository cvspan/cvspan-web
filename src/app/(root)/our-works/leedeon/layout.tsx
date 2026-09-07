import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Lee Deon — Community App Case Study',
    description:
        'How CVSpan designed Lee Deon, an app that celebrates and rewards acts of kindness within local communities.',
    path: '/our-works/leedeon',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        creativeWorkSchema({
            name: 'Lee Deon',
            description:
                'How CVSpan designed Lee Deon, an app that celebrates and rewards acts of kindness within local communities.',
            path: '/our-works/leedeon',
            image: '/assets/images/case-studies/case-5.webp',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Works', path: '/our-works' },
            { name: 'Lee Deon', path: '/our-works/leedeon' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
