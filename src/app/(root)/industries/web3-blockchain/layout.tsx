import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Web3, Blockchain | CVSpan',
    description:
        'We offer design solutions that simplify your complex blockchain product, making it intuitive, user-friendly, transparent, and trustworthy.',
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
