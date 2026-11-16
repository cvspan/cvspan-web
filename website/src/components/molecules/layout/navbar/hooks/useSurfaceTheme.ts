'use client';

import { RefObject, useEffect, useState } from 'react';

export type SurfaceMode = 'light' | 'dark';

/**
 * Works out whether the bar is currently sitting over a light or a dark part of
 * the page, so it can invert itself as sections scroll past.
 *
 * It reads the page rather than being told about it: at the bar's own midline it
 * asks the document which elements are at that point, skips the bar itself, and
 * walks up from the topmost remaining element until it finds one with an actual
 * background colour. Section wrappers are usually transparent, so that walk is
 * what resolves `bg-[#0c0c0c]` two or three levels up.
 *
 * The alternative — tagging every section with a data attribute — needs a change
 * in every component and silently does the wrong thing on any section that gets
 * missed. This has no such gap.
 *
 * What counts as "nothing found" matters here. On this site only the dark
 * sections declare a colour — `bg-[#0c0c0c]` and friends. The pale sections set
 * nothing at all and look white because that is the browser's own canvas, so
 * html and body both compute to transparent. Running out of ancestors therefore
 * means white, not dark.
 *
 * Pictures and gradients report no colour either, so they are caught separately:
 * a background image, or an image element under the sample point, reads as dark,
 * which is what every such section on this site is. Gradient *text* is excluded
 * from that, since `background-clip: text` paints letterforms rather than a
 * surface.
 */
export function useSurfaceTheme(ref: RefObject<HTMLElement>, initial: SurfaceMode) {
    const [mode, setMode] = useState<SurfaceMode>(initial);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let frame = 0;

        const read = () => {
            frame = 0;
            const el = ref.current;
            if (!el) return;

            setScrolled(window.scrollY > 8);

            const rect = el.getBoundingClientRect();
            const y = rect.top + rect.height / 2;
            const x = window.innerWidth / 2;
            if (!window.innerWidth || y < 0 || y > window.innerHeight) return;

            // Everything at that point, nearest first, minus the bar itself.
            const behind = document.elementsFromPoint(x, y).filter((node) => !el.contains(node));
            setMode(resolveMode(behind));
        };

        const onScroll = () => {
            // One read per frame at most, so a fast scroll cannot queue up work.
            if (!frame) frame = requestAnimationFrame(read);
        };

        read();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [ref]);

    return { mode, scrolled };
}

/** Decides the mode from the stack of elements sitting behind the bar. */
function resolveMode(behind: Element[]): SurfaceMode {
    for (const node of behind) {
        for (let cur: Element | null = node; cur; cur = cur.parentElement) {
            if (IMAGE_TAGS.has(cur.tagName)) return 'dark';

            const style = getComputedStyle(cur);

            const colour = parseOpaque(style.backgroundColor);
            if (colour) return luminance(colour) > 0.5 ? 'light' : 'dark';

            // A gradient or photograph is a surface; gradient text is not.
            const clip = style.backgroundClip || (style as unknown as Record<string, string>).webkitBackgroundClip;
            if (style.backgroundImage !== 'none' && clip !== 'text') return 'dark';
        }
    }

    // Nothing painted anything: what shows through is the browser's white canvas.
    return 'light';
}

const IMAGE_TAGS = new Set(['IMG', 'VIDEO', 'CANVAS']);

/** Returns the colour only if it is solid enough to be what the eye sees. */
function parseOpaque(value: string): [number, number, number] | null {
    const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/);
    if (!match) return null;
    const alpha = match[4] === undefined ? 1 : Number(match[4]);
    if (alpha < 0.5) return null;
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** WCAG relative luminance, so mid greys land on the correct side. */
function luminance([r, g, b]: [number, number, number]) {
    const channel = (value: number) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
