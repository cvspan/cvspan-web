import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Landing page design services - CVSpan',
    description:
        'Our landing page design firm will assist you in increasing your internet visibility, generating more leads, and converting them into repeat clients.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/landing-page.svg',
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
