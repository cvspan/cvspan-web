'use client';

import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type Props = { url: string; title: string };

const ICON = 'size-5 fill-current';

const Icons = {
    x: (
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    facebook: (
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    whatsapp: (
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
    ),
    link: (
        <svg
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    ),
    check: (
        <svg
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    ),
};

const buttonClass =
    'flex size-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#484848] shadow-sm transition-colors hover:border-[#1A1AFF] hover:bg-[#1A1AFF] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1AFF]';

/**
 * Share buttons for an article. On wide screens they float in the left margin and follow the reader
 * down the page; on phones they sit in a compact bar fixed to the bottom of the screen.
 */
const ShareBar = ({ url, title }: Props) => {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => () => clearTimeout(timer.current), []);

    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const targets = [
        { name: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, icon: Icons.x },
        { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: Icons.linkedin },
        { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: Icons.facebook },
        { name: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, icon: Icons.whatsapp },
    ];

    async function copy() {
        try {
            await navigator.clipboard.writeText(url);
            trackEvent('share', { method: 'Copy link', content_type: 'article', item_id: url });
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('Copy this link', url);
        }
    }

    const buttons = (
        <>
            {targets.map((target) => (
                <a
                    key={target.name}
                    href={target.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${target.name}`}
                    title={`Share on ${target.name}`}
                    onClick={() => trackEvent('share', { method: target.name, content_type: 'article', item_id: url })}
                    className={buttonClass}
                >
                    {target.icon}
                </a>
            ))}
            <button
                type="button"
                onClick={copy}
                aria-label={copied ? 'Link copied' : 'Copy link'}
                title={copied ? 'Link copied' : 'Copy link'}
                className={cn(
                    buttonClass,
                    copied && 'border-[#0F7B3F] bg-[#0F7B3F] text-white hover:border-[#0F7B3F] hover:bg-[#0F7B3F]',
                )}
            >
                {copied ? Icons.check : Icons.link}
            </button>
            <span role="status" className="sr-only">
                {copied ? 'Link copied to clipboard' : ''}
            </span>
        </>
    );

    return (
        <>
            {/* Desktop: floats beside the article and stays in view while reading. */}
            <aside
                aria-label="Share this article"
                className="sticky top-28 hidden flex-col items-center gap-2 lg:flex lg:self-start"
            >
                <span className="mb-1 font-eudoxus text-[12px] font-medium uppercase leading-[16px] tracking-wide text-[#8A8A8A]">
                    Share
                </span>
                {buttons}
            </aside>

            {/* Mobile: a bar pinned to the bottom of the screen. */}
            <aside
                aria-label="Share this article"
                className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit items-center gap-2 rounded-full border border-[#E8E8E8] bg-white/95 p-2 shadow-lg backdrop-blur lg:hidden"
            >
                {buttons}
            </aside>
        </>
    );
};

export default ShareBar;
