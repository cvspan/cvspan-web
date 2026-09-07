import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Human Resource Manager — Careers',
    description:
        'Grow and support a distributed, people-first creative team. Join CVSpan, a remote-first design and development agency working with clients across the UK, Nigeria and the US.',
    path: '/careers/human-resource',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'Human Resource Manager', path: '/careers/human-resource' },
        ]),
        jobPostingSchema({
            title: 'Human Resource Manager',
            description: 'Grow and support a distributed, people-first creative team.',
            path: '/careers/human-resource',
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
