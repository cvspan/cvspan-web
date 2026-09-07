import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image';

export const alt = 'Terms of Use';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return renderOgImage({ eyebrow: 'Legal', title: 'Terms of Use' });
}
