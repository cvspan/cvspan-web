"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { withBasePath } from "@/lib/base-path";

/*
 * Google Analytics 4 for the portal, sharing the website's measurement ID so a journey from
 * cvspan.com into cvspan.com/portal is one visit. Off until NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Privacy: nothing is stored unless the person accepted cookies on the website (the choice lives in
 * localStorage on the shared origin); no user id or email is ever sent; and page views carry the
 * path only, never the query string, since portal URLs can contain names and search terms.
 */
const ENV_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
const CONSENT_KEY = "cvspan-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Sends a custom event: a no-op while analytics is off or hasn't loaded. Never put names, emails or ids in `params`. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/** `measurementId` is the one set in Site settings; the environment value is the fallback for sites set up before it existed. */
export function Analytics({ measurementId }: { measurementId?: string | null }) {
  const GA_MEASUREMENT_ID = measurementId || ENV_MEASUREMENT_ID;
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: `${window.location.origin}${withBasePath(pathname)}`,
      page_path: withBasePath(pathname),
    });
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false,anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
