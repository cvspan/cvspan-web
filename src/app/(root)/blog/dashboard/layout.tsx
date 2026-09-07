import React from 'react';
import type { Metadata } from 'next';

/**
 * Author dashboard — private, per-user content. Kept out of the index so it
 * cannot dilute crawl budget or expose internal routes in search results.
 */
export const metadata: Metadata = {
    title: 'Dashboard',
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
