import React from 'react';
import Link from 'next/link';
import { formatDate, type PortalPost } from '@/lib/portal';

/** Links to other articles. Good for readers, and the internal links help search engines find and rank every post. */
const RelatedPosts = ({ posts }: { posts: PortalPost[] }) => {
    if (posts.length === 0) return null;

    return (
        <section aria-labelledby="more-articles" className="border-t border-[#E8E8E8] bg-white px-4 py-12 lg:py-16">
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <h2
                        id="more-articles"
                        className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1A1A1A]"
                    >
                        More from the blog
                    </h2>
                    <Link href="/blog" className="font-eudoxus text-[14px] font-medium text-[#1A1AFF] hover:underline">
                        All articles
                    </Link>
                </div>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <li key={post.slug}>
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
                                <p className="mt-4 font-eudoxus text-[12px] leading-[16px] text-[#484848]">
                                    {post.category?.name ?? 'Article'} · {formatDate(post.publishedAt)}
                                </p>
                                <h3 className="mt-2 line-clamp-2 font-eudoxus text-[20px] font-medium leading-[28px] text-[#1A1A1A] transition-colors group-hover:text-[#1A1AFF]">
                                    {post.title}
                                </h3>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default RelatedPosts;
