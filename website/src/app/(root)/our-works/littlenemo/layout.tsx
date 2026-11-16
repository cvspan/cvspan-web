import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Little Nemo — Nursery Website Case Study',
    description:
        'How CVSpan designed the website for Little Nemo Nursery in Tufnell Park, London — a warm, trustworthy digital presence for parents.',
    path: '/our-works/littlenemo',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        creativeWorkSchema({
            name: 'Little Nemo',
            description:
                'How CVSpan designed the website for Little Nemo Nursery in Tufnell Park, London — a warm, trustworthy digital presence for parents.',
            path: '/our-works/littlenemo',
            image: '/assets/images/case-studies/case-6.webp',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Works', path: '/our-works' },
            { name: 'Little Nemo', path: '/our-works/littlenemo' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
