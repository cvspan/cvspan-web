import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Website Design & Development Services - CVSpan',
    description:
        "Your website should not confuse, but rather convert, its visitors. A perfect combination of good user experience and appealing design can spark growth; we'll help you get there.",
    openGraph: {
        images: [
            {
                width: 600,
                height: 600,
                url: '/assets/images/headers/industries/website-design.svg',
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
