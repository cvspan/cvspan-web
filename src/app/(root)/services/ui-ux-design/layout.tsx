import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'UI/UX Product Design Services',
    description:
        'A UI/UX design agency creating digital products that balance user needs with business goals. Human-centred research, wireframing, prototyping and design systems.',
    path: '/services/ui-ux-design',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'UI/UX Product Design Services',
            description:
                'A UI/UX design agency creating digital products that balance user needs with business goals. Human-centred research, wireframing, prototyping and design systems.',
            path: '/services/ui-ux-design',
            serviceType: 'UI/UX Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'UI/UX Design', path: '/services/ui-ux-design' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
