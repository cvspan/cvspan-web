import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Web Development Services',
    description:
        'Front-end and back-end web development for fast, accessible, scalable products. We ship maintainable code that turns your design into a performant live product.',
    path: '/services/web-development',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Web Development Services',
            description:
                'Front-end and back-end web development for fast, accessible, scalable products. We ship maintainable code that turns your design into a performant live product.',
            path: '/services/web-development',
            serviceType: 'Web Development',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Web Development', path: '/services/web-development' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
