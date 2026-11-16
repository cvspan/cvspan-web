import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildGraph, breadcrumbSchema, jobPostingSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Social Media Manager — Careers',
    description:
        'Shape the CVSpan voice across every social platform. Join CVSpan, a remote-first design and development agency.',
    path: '/careers/social-media-manager',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: 'Social Media Manager', path: '/careers/social-media-manager' },
        ]),
        jobPostingSchema({
            title: 'Social Media Manager',
            description: 'Shape the CVSpan voice across every social platform.',
            path: '/careers/social-media-manager',
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
