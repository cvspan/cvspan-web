import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, serviceSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = buildMetadata({
    title: 'Web3 & Blockchain Design Agency',
    description:
        'We simplify complex blockchain products — crypto, DeFi, DEX and NFT — into interfaces that feel intuitive, user-friendly, transparent and trustworthy.',
    path: '/industries/web3-blockchain',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const graph = buildGraph([
        serviceSchema({
            name: 'Web3 & Blockchain Design Agency',
            description:
                'We simplify complex blockchain products — crypto, DeFi, DEX and NFT — into interfaces that feel intuitive, user-friendly, transparent and trustworthy.',
            path: '/industries/web3-blockchain',
            serviceType: 'Web3 & Blockchain Design',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
            { name: 'Web3 & Blockchain', path: '/industries/web3-blockchain' },
        ]),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            {children}
        </>
    );
}
