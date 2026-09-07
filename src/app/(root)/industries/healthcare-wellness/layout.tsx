import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Healthcare & Wellness Product Design',
    description:
        'Transform complex healthcare and wellness products into intuitive, straightforward and effective user experiences — across mental health, insurance and fitness.',
    path: '/industries/healthcare-wellness',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Healthcare & Wellness Product Design',
            description:
                'Transform complex healthcare and wellness products into intuitive, straightforward and effective user experiences — across mental health, insurance and fitness.',
            path: '/industries/healthcare-wellness',
            serviceType: 'Healthcare Product Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
            { name: 'Healthcare & Wellness', path: '/industries/healthcare-wellness' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
