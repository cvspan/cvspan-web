import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
    title: 'Privacy Policy',
    description:
        'How CVSpan collects, uses, stores and protects your personal data, and the rights you have over the information you share with us.',
    path: '/legal/privacy-policy',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
