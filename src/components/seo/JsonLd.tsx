import React from 'react';

/**
 * Renders a Schema.org JSON-LD block.
 *
 * `<` is escaped to `<` so a stray `</script>` inside any string value
 * cannot terminate the script tag early — the standard XSS guard for
 * server-serialised JSON.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}
