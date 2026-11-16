import React from 'react';
import type { Metadata } from 'next';
import Homepage from '@/components/pages/home';
import JsonLd from '@/components/seo/JsonLd';
import { FAQS } from '@/components/molecules/FAQS/data';
import { SITE_URL } from '@/lib/seo/config';
import { getSiteConfig } from '@/lib/seo/site';
import { buildGraph, faqSchema } from '@/lib/seo/structured-data';

// Intentionally a server component: `Homepage` carries its own 'use client'
// boundary, so keeping this file server-side is what allows the site's most
// important page to export metadata at all.
/**
 * The home page's name, tagline, description and share image follow Site settings in the portal, and
 * fall back to the built-in values. (A static `metadata` export here would override the settings.)
 */
export async function generateMetadata(): Promise<Metadata> {
    const site = await getSiteConfig();
    const heading = `${site.name} — ${site.tagline}`;

    return {
        // Absolute, not the "%s | CVSpan" template, so the brand name isn't repeated on the homepage title.
        title: { absolute: heading },
        description: site.description,
        alternates: { canonical: '/' },
        openGraph: {
            type: 'website',
            url: SITE_URL,
            siteName: site.name,
            title: heading,
            description: site.description,
            images: [{ url: site.shareImage, width: 1200, height: 630, alt: heading }],
        },
    };
}

export default function Page() {
    return (
        <>
            <JsonLd data={buildGraph([faqSchema(FAQS)])} />
            <Homepage />
        </>
    );
}
