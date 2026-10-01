'use client';

import React, { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Bloglanding from '@/components/molecules/blogComponents/Bloglanding/Bloglanding';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';
import BlogCards from '@/components/molecules/blogComponents/BlogCards';

/** The search term lives in the address (/blog?q=design) so results can be shared and the back button works. */
const BlogList = () => {
    const router = useRouter();
    const pathname = usePathname();
    const query = useSearchParams().get('q') ?? '';

    const search = (term: string) => router.push(term ? `${pathname}?q=${encodeURIComponent(term)}` : pathname);

    return (
        <>
            <Bloglanding query={query} onSearch={search} />
            <BlogCards query={query} onClearSearch={() => search('')} />
        </>
    );
};

const BlogPage = () => {
    return (
        <>
            <Navbar light={false} />

            <Suspense fallback={<div className="min-h-[480px] bg-[#0c0c0c]" />}>
                <BlogList />
            </Suspense>
            <CTA_MissAnything />
            <Footer />
        </>
    );
};

export default BlogPage;
