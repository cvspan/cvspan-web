'use client';

import React, { useCallback, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import Bloglanding from '@/components/molecules/blogComponents/Bloglanding/Bloglanding';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';
import BlogCards, { type BlogPage as BlogData } from '@/components/molecules/blogComponents/BlogCards';

/** The search term lives in the address (/blog?q=design), so results can be shared and the back button works. */
const BlogList = ({ query, initial }: { query: string; initial: BlogData | null }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [pending, startTransition] = useTransition();

    const search = useCallback(
        (term: string, live = false) => {
            if (term) trackEvent('search', { search_term: term });
            const href = term ? `${pathname}?q=${encodeURIComponent(term)}` : pathname;
            // Typing replaces the entry, so the back button isn't buried under one step per pause.
            startTransition(() =>
                live ? router.replace(href, { scroll: false }) : router.push(href, { scroll: false }),
            );
        },
        [pathname, router],
    );

    return (
        <>
            <Bloglanding query={query} onSearch={search} searching={pending} />
            {/* Keyed by the search so a new search starts from its own server-rendered results. */}
            <div className={pending ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                <BlogCards key={query} query={query} initial={initial} onClearSearch={() => search('')} />
            </div>
        </>
    );
};

/** `query` and `initial` come from the server page, so the article list is part of the HTML. */
const BlogPage = ({ query = '', initial = null }: { query?: string; initial?: BlogData | null }) => {
    return (
        <>
            <Navbar light={false} />
            <BlogList query={query} initial={initial} />
            <CTA_MissAnything />
            <Footer />
        </>
    );
};

export default BlogPage;
