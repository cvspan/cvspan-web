import React from 'react';
import type { Metadata } from 'next';
import Homepage from '@/components/pages/home';
import JsonLd from '@/components/seo/JsonLd';
import { FAQS } from '@/components/molecules/FAQS/data';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/seo/config';
import { buildGraph, faqSchema } from '@/lib/seo/structured-data';

// Intentionally a server component: `Homepage` carries its own 'use client'
// boundary, so keeping this file server-side is what allows the site's most
// important page to export metadata at all.
export const metadata: Metadata = {
    // Uses the absolute title (not the "%s | CVSpan" template) so the brand
    // name isn't duplicated on the homepage title.
    title: {
        absolute: `${SITE_NAME} — ${SITE_TAGLINE} | UI/UX, Web & Mobile`,
    },
    description: SITE_DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
    },
};

export default function Page() {
    return (
        <>
            <JsonLd data={buildGraph([faqSchema(FAQS)])} />
            <Homepage />
        </>
    );
}
