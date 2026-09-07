import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Mobile App Development Services',
    description:
        'Native iOS, Android and cross-platform app development. We build reliable, high-performance mobile products from first prototype through to store launch.',
    path: '/services/mobile-development',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Mobile App Development Services',
            description:
                'Native iOS, Android and cross-platform app development. We build reliable, high-performance mobile products from first prototype through to store launch.',
            path: '/services/mobile-development',
            serviceType: 'Mobile App Development',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Mobile Development', path: '/services/mobile-development' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
