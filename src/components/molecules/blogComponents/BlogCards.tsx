'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PORTAL_API_URL, formatDate, type PortalPost } from '@/lib/portal';

type Category = { name: string; slug: string };
type Page = { posts: PortalPost[]; categories: Category[]; pagination: { page: number; pages: number } };

const PAGE_SIZE = 9;

const BlogCards = ({
    containerClassname = '',
    maximumInRow = '3',
    query = '',
    onClearSearch,
}: {
    containerClassname?: string;
    maximumInRow?: '3' | '2';
    /** A search term from the blog header; narrows the list. */
    query?: string;
    onClearSearch?: () => void;
}) => {
    const [posts, setPosts] = useState<PortalPost[] | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [failed, setFailed] = useState(false);

    /** Posts come from the CVSpan Portal, where the team writes and publishes them. */
    const load = useCallback(async (nextPage: number, nextCategory: string, term: string, signal?: AbortSignal) => {
        const params = new URLSearchParams({ page: String(nextPage), pageSize: String(PAGE_SIZE) });
        if (nextCategory) params.set('category', nextCategory);
        if (term) params.set('q', term);
        const response = await fetch(`${PORTAL_API_URL}/blog?${params}`, { signal });
        if (!response.ok) throw new Error(String(response.status));
        return (await response.json()) as Page;
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setPosts(null);
        setFailed(false);
        load(1, category, query, controller.signal)
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
    }, [category, query, load]);

    async function loadMore() {
        setLoadingMore(true);
        try {
            const data = await load(page + 1, category, query);
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
            ? 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2';

    return (
        <section className={cn('bg-white px-4 py-10 lg:py-16', containerClassname)}>
            <div className="mx-auto w-full max-w-[1200px]">
                {categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                        {[{ name: 'All', slug: '' }, ...categories].map((item) => (
                            <button
                                key={item.slug || 'all'}
                                type="button"
                                onClick={() => setCategory(item.slug)}
                                aria-pressed={category === item.slug}
                                className={cn(
                                    'h-8 rounded-full border px-3 font-eudoxus text-[14px] font-medium transition-colors',
                                    category === item.slug
                                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                                        : 'border-[#D1D1D1] bg-white text-[#484848] hover:border-[#1A1A1A] hover:text-[#1A1A1A]',
                                )}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}

                {query && (
                    <p className="mb-6 flex flex-wrap items-center gap-2 font-eudoxus text-[14px] leading-[20px] text-[#484848]">
                        <span>
                            Results for <strong className="font-medium text-[#1A1A1A]">&ldquo;{query}&rdquo;</strong>
                        </span>
                        {onClearSearch && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="font-medium text-[#1A1AFF] hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </p>
                )}

                {posts === null && (
                    <div className={grid} aria-busy="true" aria-label="Loading articles">
                        {[0, 1, 2].map((item) => (
                            <div key={item} className="animate-pulse">
                                <div className="aspect-[3/2] w-full rounded-lg bg-[#F4F4F4]" />
                                <div className="mt-4 h-4 w-1/3 rounded bg-[#F4F4F4]" />
                                <div className="mt-3 h-6 w-full rounded bg-[#F4F4F4]" />
                                <div className="mt-2 h-6 w-2/3 rounded bg-[#F4F4F4]" />
                            </div>
                        ))}
                    </div>
                )}

                {posts !== null && posts.length === 0 && (
                    <p className="font-eudoxus text-[16px] leading-[24px] text-[#484848]">
                        {failed
                            ? 'We could not load the articles right now. Please try again shortly.'
                            : query
                              ? 'No articles match that search.'
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
                    <div className="mt-10 flex justify-center">
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="h-10 rounded-full border border-[#1A1A1A] px-6 font-eudoxus text-[14px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white disabled:opacity-60"
                        >
                            {loadingMore ? 'Loading…' : 'Load more articles'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogCards;

const BlogCard = ({ post }: { post: PortalPost }) => {
    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col">
            <div className="aspect-[3/2] w-full overflow-hidden rounded-lg bg-[#F4F4F4]">
                {post.coverImageUrl && (
                    <img
                        src={post.coverImageUrl}
                        alt={post.coverAlt ?? ''}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>

            <div className="mt-4 flex items-center gap-2 font-eudoxus text-[12px] leading-[16px] text-[#484848]">
                <span className="rounded-full bg-[#F4F4F4] px-2 py-1 font-medium text-[#1A1A1A]">
                    {post.category?.name ?? 'Article'}
                </span>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} min read</span>
            </div>

            <h2 className="mt-2 line-clamp-2 font-eudoxus text-[20px] font-medium leading-[28px] text-[#1A1A1A] transition-colors group-hover:text-[#1A1AFF]">
                {post.title}
            </h2>

            {post.excerpt && (
                <p className="mt-2 line-clamp-2 font-eudoxus text-[14px] leading-[20px] text-[#484848]">
                    {post.excerpt}
                </p>
            )}

            <div className="mt-4 flex items-center gap-2 font-eudoxus text-[12px] leading-[16px] text-[#484848]">
                {post.author && (
                    <>
                        <span
                            aria-hidden
                            className="flex size-6 items-center justify-center rounded-full bg-[#E8E8E8] font-medium text-[#1A1A1A]"
                        >
                            {post.author.charAt(0)}
                        </span>
                        <span className="font-medium text-[#1A1A1A]">{post.author}</span>
                        <span aria-hidden>·</span>
                    </>
                )}
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
        </Link>
    );
};
