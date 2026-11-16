import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, creativeWorkSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Coastal Loans — Fintech Mortgage App Case Study',
    description:
        'How CVSpan designed Coastal Loans, a fintech app delivering personalised mortgage offers and automatic DTI calculation for confident borrowing decisions.',
    path: '/our-works/coastal-loans',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        creativeWorkSchema({
            name: 'Coastal Loans',
            description:
                'How CVSpan designed Coastal Loans, a fintech app delivering personalised mortgage offers and automatic DTI calculation for confident borrowing decisions.',
            path: '/our-works/coastal-loans',
            image: '/assets/images/case-studies/case-3.webp',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Works', path: '/our-works' },
            { name: 'Coastal Loans', path: '/our-works/coastal-loans' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
