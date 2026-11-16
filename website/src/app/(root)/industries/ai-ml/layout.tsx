import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'AI & Machine Learning Product Design',
    description:
        'Design solutions that turn sophisticated AI and machine learning products into digital experiences that are transparent, trustworthy, intuitive and easy to use.',
    path: '/industries/ai-ml',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'AI & Machine Learning Product Design',
            description:
                'Design solutions that turn sophisticated AI and machine learning products into digital experiences that are transparent, trustworthy, intuitive and easy to use.',
            path: '/industries/ai-ml',
            serviceType: 'AI & ML Product Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
            { name: 'AI & Machine Learning', path: '/industries/ai-ml' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
