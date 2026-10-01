'use client';

import React from 'react';
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

    const search = (term: string) => {
        if (term) trackEvent('search', { search_term: term });
        router.push(term ? `${pathname}?q=${encodeURIComponent(term)}` : pathname);
    };

    return (
        <>
            <Bloglanding query={query} onSearch={search} />
            {/* Keyed by the search so a new search starts from its own server-rendered results. */}
            <BlogCards key={query} query={query} initial={initial} onClearSearch={() => search('')} />
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
