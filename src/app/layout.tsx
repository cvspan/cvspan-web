import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import FullScreenAnimatedLoader from '@/components/molecules/FullScreenAnimatedLoader';
import { Toaster } from '@/components/ui/sonner';
import JsonLd from '@/components/seo/JsonLd';
import {
    DEFAULT_OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL,
    TWITTER_HANDLE,
} from '@/lib/seo/config';
import { buildGraph, organizationSchema, professionalServiceSchema, websiteSchema } from '@/lib/seo/structured-data';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
    // Resolves every relative metadata URL (OG images, canonicals) to an absolute
    // one. Without this, social crawlers receive unusable relative paths.
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — ${SITE_TAGLINE}`,
        // Child pages set a bare title; the brand suffix is appended here so
        // titles stay consistent sitewide.
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: '/' },
    keywords: [
        'digital product design agency',
        'UI UX design agency',
        'product design services',
        'web development agency',
        'mobile app design',
        'brand identity design',
        'design systems',
        'fintech design agency',
        'Web3 design agency',
        'CVSpan',
    ],
    category: 'technology',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
    },
    twitter: {
        card: 'summary_large_image',
        site: TWITTER_HANDLE,
        creator: TWITTER_HANDLE,
        title: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/assets/images/logo.svg',
    },
    manifest: '/manifest.webmanifest',
    formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
    themeColor: '#050505',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Entity graph served on every page: the Organization and WebSite nodes are
    // what search engines consolidate brand knowledge around.
    const graph = buildGraph([organizationSchema(), websiteSchema(), professionalServiceSchema()]);

    return (
        <html lang="en">
            <head>
                {/* Warm up the connection for the self-hosted font files. */}
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <JsonLd data={graph} />
            </head>
            <body className={inter.className}>
                <FullScreenAnimatedLoader />
                <NextTopLoader color="#0A1EB9" height={3} />
                {children}
                <Toaster richColors />
            </body>
        </html>
    );
}
