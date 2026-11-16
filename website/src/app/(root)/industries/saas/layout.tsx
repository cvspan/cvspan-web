import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'SaaS Product Design Services',
    description:
        'Our product designers launch new SaaS offerings, and enhance or revamp existing ones — CRM, HR, ERP and automation platforms that move your company forward.',
    path: '/industries/saas',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'SaaS Product Design Services',
            description:
                'Our product designers launch new SaaS offerings, and enhance or revamp existing ones — CRM, HR, ERP and automation platforms that move your company forward.',
            path: '/industries/saas',
            serviceType: 'SaaS Product Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
            { name: 'SaaS', path: '/industries/saas' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
