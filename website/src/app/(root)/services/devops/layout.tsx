import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'DevOps & QA Engineering Services',
    description:
        'Optimise the flow of information across project delivery to reduce costs, enhance automation and accelerate digital transformation, backed by rigorous QA.',
    path: '/services/devops',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'DevOps & QA Engineering Services',
            description:
                'Optimise the flow of information across project delivery to reduce costs, enhance automation and accelerate digital transformation, backed by rigorous QA.',
            path: '/services/devops',
            serviceType: 'DevOps',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'DevOps', path: '/services/devops' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
