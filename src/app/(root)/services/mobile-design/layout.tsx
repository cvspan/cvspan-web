import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mobile App Design Services | CVSpan',
    description:
        'Is your app design losing you users? They struggle with poor user experience and strange pop-ups. You need to act quickly before they erase it permanently. We can resolve this for you.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/mobile-design.svg',
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
