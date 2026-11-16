import React from 'react';
import type { PortalTag } from '@/lib/portal';

/**
 * Renders the tags an admin added under Site settings. The portal has already parsed them into
 * plain descriptions of a few allowed elements, so nothing here evaluates raw HTML.
 */
export default function CustomTags({ tags }: { tags: PortalTag[] }) {
    return (
        <>
            {tags.map((item, index) => {
                const { tag, attrs, content } = item;
                const props: Record<string, string | boolean> = {};
                for (const [name, value] of Object.entries(attrs)) {
                    // Bare attributes such as `async` arrive as an empty string.
                    props[
                        name === 'class'
                            ? 'className'
                            : name === 'charset'
                              ? 'charSet'
                              : name === 'crossorigin'
                                ? 'crossOrigin'
                                : name === 'http-equiv'
                                  ? 'httpEquiv'
                                  : name
                    ] = value === '' ? true : value;
                }
                const key = `${tag}-${index}`;
                if (tag === 'meta') return <meta key={key} {...props} />;
                if (tag === 'link') return <link key={key} {...props} />;
                if (tag === 'noscript') {
                    return <noscript key={key} dangerouslySetInnerHTML={{ __html: content ?? '' }} />;
                }
                if (tag === 'style') return <style key={key} dangerouslySetInnerHTML={{ __html: content ?? '' }} />;
                return (
                    <script key={key} {...props} dangerouslySetInnerHTML={content ? { __html: content } : undefined} />
                );
            })}
        </>
    );
}
