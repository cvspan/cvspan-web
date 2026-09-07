import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og-image';

export const alt = 'Mobile App Development Services';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return renderOgImage({ eyebrow: 'Services', title: 'Mobile Development' });
}
