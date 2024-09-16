import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI & ML | CVSpan',
    description:
        'We provide design solutions that transform your sophisticated AI product into a digital experience that is transparent, trustworthy, easy to use, and intuitive.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/alml.svg',
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
