import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SAAS | CVSpan',
    description:
        'Our skilled product designers are used to develop fresh SaaS offerings, enhance or revamp current ones, and propel your company forward.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/fintech.svg',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
