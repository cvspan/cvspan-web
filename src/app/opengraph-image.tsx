import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image';
import { SITE_TAGLINE } from '@/lib/seo/config';

export const alt = `CVSpan — ${SITE_TAGLINE}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return renderOgImage({ eyebrow: 'Design & Development Agency', title: 'We Create Awesome Stuff' });
}
