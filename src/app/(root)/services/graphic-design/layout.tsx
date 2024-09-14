import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Graphic Design Services | CVSpan',
    description:
        'As a graphic design agency, we assist products in reflecting their company values through creative illustrations, icons, and marketing materials.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/graphic-design.svg',
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
