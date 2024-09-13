import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Healthcare | CVSpan',
    description:
        'Engage our skilled designers to transform your complex healthcare product into an intuitive, straightforward, and effective user experience.',
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
