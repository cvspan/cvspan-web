import React from 'react';
import OpenPositionPage from '@/components/pages/careers/open-position';
import JsonLd from '@/components/seo/JsonLd';
import { fetchJobs } from '@/lib/portal';
import { absoluteUrl } from '@/lib/seo/config';
import { buildGraph } from '@/lib/seo/structured-data';

/** Roles are opened in the CVSpan Portal; the list is rendered on the server and refreshed every minute. */
export const revalidate = 60;

export default async function Page() {
    let initial = null;
    try {
        initial = await fetchJobs();
    } catch {
        /* the client falls back to its built-in list */
    }

    return (
        <>
            {initial && initial.jobs.length > 0 ? (
                <JsonLd
                    data={buildGraph([
                        {
                            '@type': 'ItemList',
                            itemListElement: initial.jobs.map((job, index) => ({
                                '@type': 'ListItem',
                                position: index + 1,
                                url: absoluteUrl(`/careers/${job.slug}`),
                                name: job.title,
                            })),
                        },
                    ])}
                />
            ) : null}
            <OpenPositionPage initial={initial} />
        </>
    );
}
