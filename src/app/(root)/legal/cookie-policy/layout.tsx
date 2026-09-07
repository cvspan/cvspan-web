import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Cookie Policy',
    description: 'How CVSpan uses cookies and similar technologies, what they do, and how you can control them.',
    path: '/legal/cookie-policy',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
