import React from 'react';
import { formatDate, type PortalPostDetail } from '@/lib/portal';

/** Article header: category and reading time, title, summary, byline, then the cover image. */
const BlogPostLanding = ({ post }: { post: PortalPostDetail }) => {
    return (
        <header className="bg-white px-4 pt-28 lg:pt-36">
            {/* 72px = the 40px share rail + 32px gap in the body below, so title and text share one left edge. */}
            <div className="mx-auto w-full max-w-[816px] lg:pl-[72px]">
                <div className="flex items-center gap-2 font-eudoxus text-[12px] leading-[16px] text-[#484848]">
                    <span className="rounded-full bg-[#F4F4F4] px-2 py-1 font-medium text-[#1A1A1A]">
                        {post.category?.name ?? 'Article'}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{post.readingMinutes} min read</span>
                </div>

                <h1 className="mt-4 font-pp-mori text-[32px] font-semibold leading-[40px] text-[#1A1A1A] lg:text-[48px] lg:leading-[56px]">
                    {post.title}
                </h1>

                {post.excerpt && (
                    <p className="mt-4 font-eudoxus text-[18px] leading-[28px] text-[#484848]">{post.excerpt}</p>
                )}

                <div className="mt-6 flex items-center gap-3 font-eudoxus text-[14px] leading-[20px]">
                    {post.author && (
                        <>
                            <span
                                aria-hidden
                                className="flex size-8 items-center justify-center rounded-full bg-[#E8E8E8] text-[14px] font-medium text-[#1A1A1A]"
                            >
                                {post.author.charAt(0)}
                            </span>
                            <span className="font-medium text-[#1A1A1A]">{post.author}</span>
                            <span aria-hidden className="text-[#8A8A8A]">
                                ·
                            </span>
                        </>
                    )}
                    <time dateTime={post.publishedAt} className="text-[#484848]">
                        {formatDate(post.publishedAt)}
                    </time>
                </div>
            </div>

            {post.coverImageUrl && (
                <div className="mx-auto mt-8 w-full max-w-[960px] overflow-hidden rounded-xl bg-[#F4F4F4] lg:mt-10">
                    <img
                        src={post.coverImageUrl}
                        alt={post.coverAlt ?? ''}
                        className="aspect-[2/1] size-full object-cover"
                    />
                </div>
            )}
        </header>
    );
};

export default BlogPostLanding;
