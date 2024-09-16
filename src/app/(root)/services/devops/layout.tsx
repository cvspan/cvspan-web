import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DevOps Services | CVSpan',
    description:
        'Optimize the flow of data and information in project development to reduce delivery costs, enhance automation, and accelerate digital transformation efforts.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/devops.svg',
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
