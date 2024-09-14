import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'UI/UX Product Design Services | CVSpan',
    description:
        'As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/uiux-design.svg',
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
