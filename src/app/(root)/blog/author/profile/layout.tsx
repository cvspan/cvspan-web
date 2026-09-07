import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Author',
    description: 'Articles and profile for a member of the CVSpan writing team.',
    path: '/blog/author/profile',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
