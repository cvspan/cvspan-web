import React from 'react';
import PortalHtml from '@/components/molecules/PortalContent/PortalHtml';
import type { PortalPostDetail } from '@/lib/portal';

/** The excerpt as a summary, then the full article, in the site's two-column reading layout. */
const Summary = ({ post }: { post: PortalPostDetail }) => {
    return (
        <div className="mx-auto mt-10 flex h-[100%] w-[100%] max-w-[1200px] flex-col items-center justify-center pb-24 pt-10">
            {post.excerpt && (
                <div className="flex w-full flex-col justify-center p-5 md:flex-row">
                    <div className="flex flex-col justify-between gap-10 md:flex-row">
                        <div className="w-full md:w-[384px]">
                            <p>Summary</p>
                        </div>
                        <div className="pt-3">
                            <div className="w-full md:w-[792px]">
                                <p className="pb-4 font-eudoxus text-[24px] font-[500] leading-[32px] text-black">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex w-full flex-col justify-center p-5 md:flex-row">
                <div className="flex flex-col justify-between gap-10 md:flex-row">
                    <div className="w-full md:w-[384px]">
                        <p>Reading</p>
                        {post.tags.length > 0 && (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <li
                                        key={tag}
                                        className="rounded-[20px] bg-[#F4F4F4] px-3 py-1 font-eudoxus text-[12px] text-[#484848]"
                                    >
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="pt-3">
                        <div className="w-full md:w-[792px]">
                            <PortalHtml html={post.bodyHtml} className="text-[18px] leading-[26px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
