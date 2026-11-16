/*
 * Google Analytics 4, shared by the website and the portal so a visit that starts on the site and
 * continues into cvspan.com/portal is one journey in one property. Everything is off until
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set, and nothing is stored until the visitor accepts cookies.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

/** Shared between the site and the portal because both live on the same origin. */
export const CONSENT_KEY = 'cvspan-consent';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/** Sends a custom event. A no-op when analytics is off or not yet loaded. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
    if (typeof window === 'undefined') return;
    window.gtag?.('event', name, params);
    // Tag Manager listens to the data layer, so the same events reach it with no extra setup.
    window.dataLayer?.push({ event: name, ...params });
}
