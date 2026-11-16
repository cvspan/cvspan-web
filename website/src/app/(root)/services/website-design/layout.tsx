import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Website Design & Development Services',
    description:
        "Your website should convert visitors, not confuse them. We combine strong user experience with appealing design to spark measurable growth — and we'll help you get there.",
    path: '/services/website-design',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Website Design & Development Services',
            description:
                "Your website should convert visitors, not confuse them. We combine strong user experience with appealing design to spark measurable growth — and we'll help you get there.",
            path: '/services/website-design',
            serviceType: 'Website Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Website Design', path: '/services/website-design' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
