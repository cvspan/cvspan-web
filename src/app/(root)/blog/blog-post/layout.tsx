import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Article',
    description: 'Read the latest thinking from the CVSpan design and development team.',
    path: '/blog/blog-post',
    type: 'article',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
