import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Fintech UI/UX Design Agency',
    description:
        'Our designers specialise in simplifying complex financial products for end users. Work with our fintech UI/UX team on banking, payments and exchange platforms.',
    path: '/industries/fintech',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Fintech UI/UX Design Agency',
            description:
                'Our designers specialise in simplifying complex financial products for end users. Work with our fintech UI/UX team on banking, payments and exchange platforms.',
            path: '/industries/fintech',
            serviceType: 'Fintech Product Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
            { name: 'Fintech', path: '/industries/fintech' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
