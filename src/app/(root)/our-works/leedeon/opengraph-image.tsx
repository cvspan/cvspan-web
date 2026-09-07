import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image';

export const alt = 'Lee Deon — Community App Case Study';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return renderOgImage({ eyebrow: 'Case Study', title: 'Lee Deon' });
}
