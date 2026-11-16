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
type Props = { gaId?: string | null; gtmId?: string | null; pixelId?: string | null; linkedinId?: string | null };

export default function Analytics({ gaId, gtmId, pixelId, linkedinId }: Props) {
    const ga = gaId || GA_MEASUREMENT_ID;
    if (!ga && !gtmId && !pixelId && !linkedinId) return null;

    return (
        <>
            {/* The consent default is set first, so Google Analytics, Tag Manager and the ad tags all start with storage denied. */}
            <Script id="ga-consent" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`}
            </Script>
            {ga ? (
                <>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
                    <Script id="ga-init" strategy="afterInteractive">
                        {`gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
                    </Script>
                </>
            ) : null}
            {gtmId ? (
                <Script id="gtm-init" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
                </Script>
            ) : null}
            {pixelId || linkedinId ? <AdPixels pixelId={pixelId} linkedinId={linkedinId} /> : null}
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
        window.dispatchEvent(new Event('cvspan-consent'));
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

/**
 * Advertising pixels (Meta, LinkedIn) load only once the visitor has accepted cookies, in this visit or
 * an earlier one. Declining, or not choosing, loads nothing.
 */
function AdPixels({ pixelId, linkedinId }: { pixelId?: string | null; linkedinId?: string | null }) {
    const [granted, setGranted] = useState(false);

    useEffect(() => {
        try {
            setGranted(localStorage.getItem(CONSENT_KEY) === 'granted');
        } catch {
            setGranted(false);
        }
        const onChange = () => {
            try {
                setGranted(localStorage.getItem(CONSENT_KEY) === 'granted');
            } catch {
                /* keep the current state */
            }
        };
        window.addEventListener('cvspan-consent', onChange);
        return () => window.removeEventListener('cvspan-consent', onChange);
    }, []);

    if (!granted) return null;

    return (
        <>
            {pixelId ? (
                <Script id="meta-pixel" strategy="afterInteractive">
                    {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
                </Script>
            ) : null}
            {linkedinId ? (
                <Script id="linkedin-insight" strategy="afterInteractive">
                    {`window._linkedin_partner_id='${linkedinId}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s)})(window.lintrk);`}
                </Script>
            ) : null}
        </>
    );
}
