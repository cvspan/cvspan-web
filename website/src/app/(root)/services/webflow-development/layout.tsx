import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Webflow Design & Development Services',
    description:
        'As a certified Webflow partner, our developers build fully responsive, CMS-driven websites that deliver an exceptional user experience and are easy to manage.',
    path: '/services/webflow-development',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Webflow Design & Development Services',
            description:
                'As a certified Webflow partner, our developers build fully responsive, CMS-driven websites that deliver an exceptional user experience and are easy to manage.',
            path: '/services/webflow-development',
            serviceType: 'Webflow Development',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Webflow Development', path: '/services/webflow-development' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
