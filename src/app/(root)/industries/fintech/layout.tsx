import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fintech | CVSpan',
    description:
        'Our skilled designers are employed to simplify complicated items for end consumers. Work together with our fintech UI/UX design team to get excellent outcomes.',
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
