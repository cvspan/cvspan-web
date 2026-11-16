import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import FullScreenAnimatedLoader from '@/components/molecules/FullScreenAnimatedLoader';
import { Toaster } from '@/components/ui/sonner';
import Analytics from '@/components/seo/Analytics';
import CustomTags from '@/components/seo/CustomTags';
import GlobalTracking from '@/components/seo/GlobalTracking';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/seo/config';
import { getSiteConfig } from '@/lib/seo/site';
import { buildGraph, organizationSchema, professionalServiceSchema, websiteSchema } from '@/lib/seo/structured-data';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

/**
 * Site-wide metadata. Names, descriptions, the share image, verification codes and the indexing switch
 * come from Site settings in the portal when set, and fall back to the built-in values otherwise.
 */
export async function generateMetadata(): Promise<Metadata> {
    const site = await getSiteConfig();
    const verification = site.settings?.verification;
    const heading = `${site.name} — ${site.tagline}`;

    return {
        // Resolves every relative metadata URL (OG images, canonicals) to an absolute
        // one. Without this, social crawlers receive unusable relative paths.
        metadataBase: new URL(SITE_URL),
        title: {
            default: heading,
            // Child pages set a bare title; the suffix is appended here so titles stay consistent sitewide.
            template: site.titleTemplate,
        },
        description: site.description,
        applicationName: site.name,
        authors: [{ name: site.name, url: SITE_URL }],
        creator: site.name,
        publisher: site.name,
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
            siteName: site.name,
            title: heading,
            description: site.description,
            images: [{ url: site.shareImage, width: 1200, height: 630, alt: heading }],
        },
        twitter: {
            card: 'summary_large_image',
            site: site.twitterHandle,
            creator: site.twitterHandle,
            title: heading,
            description: site.description,
            images: [site.shareImage],
        },
        robots: {
            index: site.allowIndexing,
            follow: site.allowIndexing,
            googleBot: {
                index: site.allowIndexing,
                follow: site.allowIndexing,
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
        // Proves ownership to Search Console, Bing, Yandex and Meta. The portal's value wins; the
        // environment values are kept so a site set up before Site settings existed keeps working.
        verification: {
            google: verification?.google ?? process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            yandex: verification?.yandex ?? undefined,
            other: {
                ...(verification?.bing ?? process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
                    ? {
                          'msvalidate.01': (verification?.bing ??
                              process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) as string,
                      }
                    : {}),
                ...(verification?.facebook ? { 'facebook-domain-verification': verification.facebook } : {}),
            },
        },
        formatDetection: { telephone: false, address: false, email: false },
    };
}

export const viewport: Viewport = {
    themeColor: '#050505',
    width: 'device-width',
    initialScale: 1,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const site = await getSiteConfig();
    const tags = site.settings?.tags;
    const analytics = site.settings?.analytics;
    // Entity graph served on every page: the Organization and WebSite nodes are
    // what search engines consolidate brand knowledge around.
    const graph = buildGraph([
        organizationSchema(site.profiles.length > 0 ? site.profiles : site.builtInProfiles),
        websiteSchema(),
        professionalServiceSchema(),
    ]);

    return (
        <html lang="en">
            <head>
                {/* Warm up the connection for the self-hosted font files. */}
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <JsonLd data={graph} />
                {tags ? <CustomTags tags={tags.head} /> : null}
            </head>
            <body className={inter.className}>
                {analytics?.tagManager ? (
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${analytics.tagManager}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                ) : null}
                {tags ? <CustomTags tags={tags.bodyStart} /> : null}
                <FullScreenAnimatedLoader />
                <NextTopLoader color="#0A1EB9" height={3} />
                {children}
                <Toaster richColors />
                <Analytics
                    gaId={analytics?.googleAnalytics}
                    gtmId={analytics?.tagManager}
                    pixelId={analytics?.metaPixel}
                    linkedinId={analytics?.linkedinInsight}
                />
                <GlobalTracking />
                {tags ? <CustomTags tags={tags.bodyEnd} /> : null}
            </body>
        </html>
    );
}
