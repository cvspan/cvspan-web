import React from 'react';

/**
 * Case-study screen image with responsive sources.
 *
 * The originals are 6000px wide, which phones were downloading in full to
 * render at ~375px. `scripts/generate-responsive-screens.mjs` emits 1200w and
 * 2400w siblings; this picks the right one via srcset.
 *
 * Only sources wider than 3000px were split, so images without variants
 * (mockups, blurs) fall back to a plain src.
 */
const RESPONSIVE_BASES = new Set([
    'coastal',
    'coastal-mobile',
    'courtz',
    'courtz-mobile',
    'leedeon',
    'leedeon-mobile',
    'nemo',
    'nemo-desktop',
    'nemo-mobile',
    'neverbare',
    'neverbare-desktop',
    'neverbare-mobile',
    'phozio',
    'phozio-mobile',
]);

const VARIANT_WIDTHS = [1200, 2400];
const ORIGINAL_WIDTH = 6000;

type Props = {
    /** File name without extension, e.g. `courtz-mobile`. */
    image: string;
    className?: string;
    alt?: string;
    /** Set for anything above the fold so it is not deferred. */
    priority?: boolean;
};

const ScreenImage = ({ image, className, alt = '', priority = false }: Props) => {
    const base = `/assets/images/screens/${image}`;
    const src = `${base}.webp`;

    const srcSet = RESPONSIVE_BASES.has(image)
        ? [...VARIANT_WIDTHS.map((w) => `${base}-${w}w.webp ${w}w`), `${src} ${ORIGINAL_WIDTH}w`].join(', ')
        : undefined;

    return (
        <img
            src={src}
            srcSet={srcSet}
            // These render edge to edge, so the viewport width is the picking rule.
            sizes={srcSet ? '100vw' : undefined}
            alt={alt}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
    );
};

export default ScreenImage;
