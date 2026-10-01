'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PORTAL_API_URL, type PortalPost } from '@/lib/portal';

type Category = { name: string; slug: string };
type Page = { posts: PortalPost[]; categories: Category[]; pagination: { page: number; pages: number } };

const PAGE_SIZE = 9;

const BlogCards = ({
    containerClassname = '',
    maximumInRow = '3',
}: {
    containerClassname?: string;
    maximumInRow?: '3' | '2';
}) => {
    const [posts, setPosts] = useState<PortalPost[] | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [failed, setFailed] = useState(false);

    /** Posts come from the CVSpan Portal, where the team writes and publishes them. */
    const load = useCallback(async (nextPage: number, nextCategory: string, signal?: AbortSignal) => {
        const query = new URLSearchParams({ page: String(nextPage), pageSize: String(PAGE_SIZE) });
        if (nextCategory) query.set('category', nextCategory);
        const response = await fetch(`${PORTAL_API_URL}/blog?${query}`, { signal });
        if (!response.ok) throw new Error(String(response.status));
        return (await response.json()) as Page;
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setPosts(null);
        setFailed(false);
        load(1, category, controller.signal)
            .then((data) => {
                setPosts(data.posts);
                setCategories(data.categories);
                setPage(1);
                setPages(data.pagination.pages);
            })
            .catch((error) => {
                if (error?.name !== 'AbortError') {
                    setPosts([]);
                    setFailed(true);
                }
            });
        return () => controller.abort();
    }, [category, load]);

    async function loadMore() {
        setLoadingMore(true);
        try {
            const data = await load(page + 1, category);
            setPosts((current) => [...(current ?? []), ...data.posts]);
            setPage(data.pagination.page);
            setPages(data.pagination.pages);
        } catch {
            setFailed(true);
        } finally {
            setLoadingMore(false);
        }
    }

    const grid =
        maximumInRow === '3'
            ? 'grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3'
            : 'grid grid-cols-1 gap-[24px] md:grid-cols-2';

    return (
        <div className={cn('px-5 py-[60px] lg:py-[120px]', containerClassname)}>
            <div className="mx-auto w-full max-w-[1200px]">
                {categories.length > 0 && (
                    <div className="mb-[40px] flex flex-wrap gap-[12px]" role="group" aria-label="Filter by category">
                        {[{ name: 'All', slug: '' }, ...categories].map((item) => (
                            <button
                                key={item.slug || 'all'}
                                type="button"
                                onClick={() => setCategory(item.slug)}
                                aria-pressed={category === item.slug}
                                className={cn(
                                    'rounded-[100px] border-[1px] px-[16px] py-[8px] font-eudoxus text-[16px] font-medium transition',
                                    category === item.slug
                                        ? 'border-[#050505] bg-[#050505] text-white'
                                        : 'border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#F4F4F4]',
                                )}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}

                {posts === null && (
                    <div className={grid} aria-busy="true" aria-label="Loading articles">
                        {[0, 1, 2].map((item) => (
                            <div key={item} className="animate-pulse">
                                <div className="mb-5 h-[220px] w-full bg-[#F4F4F4]" />
                                <div className="mb-3 h-[20px] w-1/3 rounded bg-[#F4F4F4]" />
                                <div className="h-[34px] w-full rounded bg-[#F4F4F4]" />
                            </div>
                        ))}
                    </div>
                )}

                {posts !== null && posts.length === 0 && (
                    <p className="font-eudoxus text-[16px] text-[#484848]">
                        {failed
                            ? 'We could not load the articles right now. Please try again shortly.'
                            : 'No articles here yet. Check back soon.'}
                    </p>
                )}

                {posts !== null && posts.length > 0 && (
                    <div className={grid}>
                        {posts.map((post) => (
                            <BlogCard post={post} key={post.slug} />
                        ))}
                    </div>
                )}

                {page < pages && (
                    <div className="mt-[40px] flex justify-center">
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="rounded-[100px] border-[1px] border-[#1A1A1A] px-[32px] py-[16px] font-eudoxus text-[16px] font-medium text-[#1A1A1A] transition hover:bg-[#050505] hover:text-white disabled:opacity-60"
                        >
                            {loadingMore ? 'Loading…' : 'Load more articles'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCards;

const BlogCard = ({ post }: { post: PortalPost }) => {
    return (
        <Link className="mb-8 w-full md:mx-0 md:mb-16" href={`/blog/${post.slug}`}>
            <div className="group overflow-hidden">
                <div className="mb-5 h-[220px] w-full overflow-hidden bg-[#F4F4F4]">
                    {post.coverImageUrl && (
                        <img
                            src={post.coverImageUrl}
                            alt={post.coverAlt ?? post.title}
                            loading="lazy"
                            className="h-full w-full scale-105 object-cover transition duration-300 ease-in-out group-hover:scale-100"
                        />
                    )}
                </div>
                <div className="mb-5 flex items-center gap-5">
                    <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-[14px] font-medium">
                        {post.category?.name ?? 'Article'}
                    </p>
                    <p className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#1A1A1A]">
                        {post.readingMinutes} min read
                    </p>
                </div>

                <h2 className="mb-5 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1A1A1A] group-hover:text-[#1A1AFF] md:text-[20px] md:leading-[28px] lg:text-[34px] lg:leading-[42px]">
                    {post.title}
                </h2>

                {post.author && (
                    <div className="flex items-center gap-3">
                        <div
                            aria-hidden
                            className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#D9D9D9] font-eudoxus text-[16px] font-medium text-[#1A1A1A]"
                        >
                            {post.author.charAt(0)}
                        </div>
                        <span className="font-eudoxus text-[16px] font-[400] leading-5">{post.author}</span>
                    </div>
                )}
            </div>
        </Link>
    );
};
