import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Graphic Designer — Careers',
    description:
        'Create striking visual assets across brand, campaign and product surfaces. Join CVSpan, a remote-first design and development agency working with clients across the UK, Nigeria and the US.',
    path: '/careers/graphic-designer',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'Graphic Designer', path: '/careers/graphic-designer' },
        ]),
        jobPostingSchema({
            title: 'Graphic Designer',
            description: 'Create striking visual assets across brand, campaign and product surfaces.',
            path: '/careers/graphic-designer',
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
