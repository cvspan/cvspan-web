'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Records what visitors do across the whole site without each page having to remember to: clicks on
 * links that leave the site, email and phone links, file downloads, form submissions, and how far
 * down a page they read. Events go to Google Analytics and the Tag Manager data layer, and only
 * become real data once a visitor has accepted cookies. Nothing personal is sent: no field values,
 * no query strings, no link text longer than a short label.
 */
export default function GlobalTracking() {
    useEffect(() => {
        const label = (element: Element) => (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);

        function onClick(event: MouseEvent) {
            const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!link) return;
            const href = link.getAttribute('href') ?? '';

            if (href.startsWith('mailto:')) return trackEvent('click_email', { link_text: label(link) });
            if (href.startsWith('tel:')) return trackEvent('click_phone', { link_text: label(link) });

            let url: URL;
            try {
                url = new URL(link.href, window.location.href);
            } catch {
                return;
            }

            if (/\.(pdf|docx?|xlsx?|pptx?|zip|csv)$/i.test(url.pathname)) {
                return trackEvent('file_download', {
                    file_name: url.pathname.split('/').pop() ?? '',
                    link_text: label(link),
                });
            }
            if (url.origin !== window.location.origin && /^https?:$/.test(url.protocol)) {
                trackEvent('click_outbound', { link_domain: url.hostname, link_text: label(link) });
            }
        }

        function onSubmit(event: SubmitEvent) {
            const form = event.target as HTMLFormElement | null;
            if (!form?.tagName || form.tagName !== 'FORM') return;
            trackEvent('form_submit', {
                form_id: form.id || form.getAttribute('name') || 'form',
                page_path: window.location.pathname,
            });
        }

        const reached = new Set<number>();
        function onScroll() {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable < 400) return;
            const percent = Math.round((window.scrollY / scrollable) * 100);
            for (const mark of [50, 90]) {
                if (percent >= mark && !reached.has(mark)) {
                    reached.add(mark);
                    trackEvent('scroll_depth', { percent: mark, page_path: window.location.pathname });
                }
            }
        }

        document.addEventListener('click', onClick, { capture: true });
        document.addEventListener('submit', onSubmit, { capture: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            document.removeEventListener('click', onClick, { capture: true });
            document.removeEventListener('submit', onSubmit, { capture: true });
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return null;
}
