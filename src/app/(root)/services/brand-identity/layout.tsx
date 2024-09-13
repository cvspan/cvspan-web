import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Brand Design & Consulting Services | CVSpan',
    description:
        'You want your brand to sparkle and capture your target audience. But how do you do this? By telling a distinctive, memorable, and captivating tale that connects with people. And that is exactly what we assist you with.',
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/brand-identity.svg',
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
