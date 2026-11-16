import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Graphic Design Services',
    description:
        'As a graphic design agency, we help products reflect their company values through creative illustrations, icons, social assets and marketing materials.',
    path: '/services/graphic-design',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Graphic Design Services',
            description:
                'As a graphic design agency, we help products reflect their company values through creative illustrations, icons, social assets and marketing materials.',
            path: '/services/graphic-design',
            serviceType: 'Graphic Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Graphic Design', path: '/services/graphic-design' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
