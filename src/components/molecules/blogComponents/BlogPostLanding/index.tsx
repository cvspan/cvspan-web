import Link from 'next/link';
import React from 'react';

const BlogPostLanding = () => {
    return (
        <div>
            <div className="px-4 pt-10 md:px-6 lg:px-8">
                <div className="mx-auto mt-[100px] w-full max-w-[1200px]">
                    <div>
                        <h1 className="xs:text-[30px] xs:font-[500] font-pp-mori text-[clamp(34px,calc(60/1200*100vw),60px)] font-[600] leading-tight">
                            Top 10 Digital Design Agencies
                        </h1>

                        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
                            <Link href="/blog/author/profile" className="flex items-center gap-3 hover:underline">
                                <div className="h-12 w-12 rounded-full bg-[#D9D9D9] md:h-[48px] md:w-[48px]"></div>
                                <div className="flex flex-col">
                                    <h1 className="font-eudoxus text-sm font-[400] leading-5 md:text-base">
                                        Moses Arfo
                                    </h1>
                                    <span className="font-eudoxus text-xs font-[400] leading-[20px] text-[#A3A3A3] md:text-sm">
                                        Founder & CEO
                                    </span>
                                </div>
                            </Link>
                            <div className="flex items-center gap-3 md:gap-5">
                                <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-xs font-medium md:text-sm">
                                    Article
                                </p>
                                <p className="font-eudoxus text-xs font-[400] leading-[22px] text-[#1A1A1A] md:text-sm">
                                    3 mins read
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <img
                src={'/assets/images/Rectangle.png'}
                alt="  alt text"
                className="mt-[60px] h-auto w-full overflow-hidden object-cover sm:h-[208px] lg:h-[377px]"
            />
        </div>
    );
};

export default BlogPostLanding;
