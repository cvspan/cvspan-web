import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Marketing Manager — Careers',
    description:
        'Own the strategy that takes CVSpan work to a global audience. Join CVSpan, a remote-first design and development agency working with clients across the UK, Nigeria and the US.',
    path: '/careers/marketing-manager',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'Marketing Manager', path: '/careers/marketing-manager' },
        ]),
        jobPostingSchema({
            title: 'Marketing Manager',
            description: 'Own the strategy that takes CVSpan work to a global audience.',
            path: '/careers/marketing-manager',
            datePosted: '2026-09-04',
        }),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
