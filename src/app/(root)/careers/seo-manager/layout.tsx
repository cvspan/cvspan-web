import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'SEO Manager — Careers',
    description:
        'Drive organic growth and search visibility for CVSpan and its clients. Join CVSpan, a remote-first design and development agency working with clients across the UK, Nigeria and the US.',
    path: '/careers/seo-manager',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'SEO Manager', path: '/careers/seo-manager' },
        ]),
        jobPostingSchema({
            title: 'SEO Manager',
            description: 'Drive organic growth and search visibility for CVSpan and its clients.',
            path: '/careers/seo-manager',
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
