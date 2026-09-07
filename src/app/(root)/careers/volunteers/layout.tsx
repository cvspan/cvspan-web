import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Volunteer Programme — Careers',
    description:
        'Contribute to community-driven design and technology initiatives. Join CVSpan, a remote-first design and development agency working with clients across the UK, Nigeria and the US.',
    path: '/careers/volunteers',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'Volunteer Programme', path: '/careers/volunteers' },
        ]),
        jobPostingSchema({
            title: 'Volunteer Programme',
            description: 'Contribute to community-driven design and technology initiatives.',
            path: '/careers/volunteers',
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
