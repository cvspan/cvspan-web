'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { CONSENT_KEY, GA_MEASUREMENT_ID } from '@/lib/analytics';

/**
 * Loads Google Analytics 4 with Consent Mode: storage is denied by default, and the visitor's saved
 * choice (accept or decline) is applied before the first hit. Renders nothing at all when no
 * measurement ID is configured.
 */
export default function Analytics() {
    if (!GA_MEASUREMENT_ID) return null;

    return (
        <>
            <Script id="ga-consent" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`}
            </Script>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
                {`gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{anonymize_ip:true});`}
            </Script>
            <ConsentBanner />
        </>
    );
}

/** A small, dismissible notice. Declining keeps analytics cookieless; the choice is remembered. */
function ConsentBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            setVisible(!localStorage.getItem(CONSENT_KEY));
        } catch {
            setVisible(false);
        }
    }, []);

    function choose(choice: 'granted' | 'denied') {
        try {
            localStorage.setItem(CONSENT_KEY, choice);
        } catch {
            /* private mode: the choice just lasts until the page closes */
        }
        window.gtag?.('consent', 'update', { analytics_storage: choice });
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie preferences"
            className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-[640px] flex-col gap-4 rounded-xl border border-[#E8E8E8] bg-white p-4 shadow-lg sm:flex-row sm:items-center"
        >
            <p className="flex-1 font-eudoxus text-[14px] leading-[20px] text-[#484848]">
                We use cookies to understand how people use our site and improve it. Read our{' '}
                <Link href="/legal/cookie-policy" className="text-[#1A1AFF] underline">
                    cookie policy
                </Link>
                .
            </p>
            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    onClick={() => choose('denied')}
                    className="h-10 rounded-full border border-[#1A1A1A] px-4 font-eudoxus text-[14px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F4F4F4]"
                >
                    Decline
                </button>
                <button
                    type="button"
                    onClick={() => choose('granted')}
                    className="h-10 rounded-full bg-[#1A1AFF] px-4 font-eudoxus text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
