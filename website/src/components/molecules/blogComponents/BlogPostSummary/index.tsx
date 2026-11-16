import React from 'react';
import PortalHtml from '@/components/molecules/PortalContent/PortalHtml';
import ShareBar from '@/components/molecules/blogComponents/ShareBar';
import type { PortalPostDetail } from '@/lib/portal';

/** The article text in a single readable column, with the share buttons floating beside it. */
const PostBody = ({ post, shareUrl }: { post: PortalPostDetail; shareUrl: string }) => {
    return (
        <div className="bg-white px-4 pb-24 pt-10 lg:pt-12">
            <div className="mx-auto w-full max-w-[816px] lg:grid lg:grid-cols-[40px_minmax(0,720px)] lg:gap-8">
                <ShareBar url={shareUrl} title={post.title} />

                <article>
                    <PortalHtml html={post.bodyHtml} />

                    {post.tags.length > 0 && (
                        <ul className="mt-10 flex flex-wrap gap-2 border-t border-[#E8E8E8] pt-6" aria-label="Tags">
                            {post.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full bg-[#F4F4F4] px-3 py-1 font-eudoxus text-[12px] leading-[16px] text-[#484848]"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </article>
            </div>
        </div>
    );
};

export default PostBody;
