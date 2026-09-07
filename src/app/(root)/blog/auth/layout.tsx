import React from 'react';
import type { Metadata } from 'next';

/**
 * Authentication screens carry no search value and must never surface in
 * results. `robots.ts` also disallows crawling this subtree; this tag covers
 * URLs that get discovered through links rather than crawling.
 */
export const metadata: Metadata = {
    title: 'Sign in',
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
