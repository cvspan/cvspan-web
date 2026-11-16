import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Mobile App Design Services',
    description:
        'Is your app design losing users to poor experience and confusing flows? Our mobile designers craft intuitive iOS and Android interfaces that keep people coming back.',
    path: '/services/mobile-design',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Mobile App Design Services',
            description:
                'Is your app design losing users to poor experience and confusing flows? Our mobile designers craft intuitive iOS and Android interfaces that keep people coming back.',
            path: '/services/mobile-design',
            serviceType: 'Mobile App Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Mobile Design', path: '/services/mobile-design' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
