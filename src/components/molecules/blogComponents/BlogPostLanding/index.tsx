import React from 'react';
import { formatDate, type PortalPostDetail } from '@/lib/portal';

const BlogPostLanding = ({ post }: { post: PortalPostDetail }) => {
    return (
        <div>
            <div className="px-4 pt-10 md:px-6 lg:px-8">
                <div className="mx-auto mt-[100px] w-full max-w-[1200px]">
                    <div>
                        <h1 className="xs:text-[30px] xs:font-[500] font-pp-mori text-[clamp(34px,calc(60/1200*100vw),60px)] font-[600] leading-tight">
                            {post.title}
                        </h1>

                        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
                            {post.author && (
                                <div className="flex items-center gap-3">
                                    <div
                                        aria-hidden
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9D9D9] font-eudoxus text-base font-medium text-[#1A1A1A]"
                                    >
                                        {post.author.charAt(0)}
                                    </div>
                                    {/* Author byline, not a page heading — the post title above is the <h1>. */}
                                    <span className="font-eudoxus text-sm font-[400] leading-5 md:text-base">
                                        {post.author}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center gap-3 md:gap-5">
                                <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-xs font-medium md:text-sm">
                                    {post.category?.name ?? 'Article'}
                                </p>
                                <p className="font-eudoxus text-xs font-[400] leading-[22px] text-[#1A1A1A] md:text-sm">
                                    {post.readingMinutes} min read
                                </p>
                                <time
                                    dateTime={post.publishedAt}
                                    className="font-eudoxus text-xs font-[400] leading-[22px] text-[#484848] md:text-sm"
                                >
                                    {formatDate(post.publishedAt)}
                                </time>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {post.coverImageUrl && (
                <img
                    src={post.coverImageUrl}
                    alt={post.coverAlt ?? ''}
                    className="mt-[60px] h-auto w-full overflow-hidden object-cover sm:h-[208px] lg:h-[377px]"
                />
            )}
        </div>
    );
};

export default BlogPostLanding;
