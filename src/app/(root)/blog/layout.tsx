import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

// Without this the blog index inherited the site's root title and description,
// so it competed with the homepage in search results.
export const metadata: Metadata = buildMetadata({
    title: 'Blog',
    description:
        'Notes from the CVSpan team on product design, user research, development and the work of building digital products people actually want to use.',
    path: '/blog',
    hasChildRoutes: true,
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
