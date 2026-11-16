import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Frontend Engineer — Careers',
    description:
        'Build fast, accessible interfaces for digital products used worldwide. Join CVSpan, a remote-first design and development agency.',
    path: '/careers/front-end',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'Frontend Engineer', path: '/careers/front-end' },
        ]),
        jobPostingSchema({
            title: 'Frontend Engineer',
            description: 'Build fast, accessible interfaces for digital products used worldwide.',
            path: '/careers/front-end',
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
