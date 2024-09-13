import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Webflow Design & Development Services - CVSpan',
    description:
        'As a certified Webflow partner, our developers understand how to create fully responsive and functioning websites that provide an exceptional user experience.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/webflow-development.svg',
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
