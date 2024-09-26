import React from 'react';
import { articles } from './blogData';
import Image from 'next/image';
import Link from 'next/link';

const BlogCard = ({ article }: any) => {
    return (
        <div>
            <Link className="mb-8 w-full md:mx-0 md:mb-16" href="/cvspan-blog/blog-post">
                <>
                    <div className="group overflow-hidden">
                        <div className="mb-5 h-[220px] w-full scale-100 overflow-hidden object-cover group-hover:scale-100 md:w-[384px]">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="h-full w-full scale-105 object-cover transition duration-300 ease-in-out group-hover:scale-100"
                            />
                        </div>
                        <div className="">
                            <div className="mb-5 flex items-center gap-5">
                                <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-[14px] font-medium">
                                    Article
                                </p>
                                <p className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#1A1A1A]">
                                    {article.time}
                                </p>
                            </div>

                            <h2 className="mb-5 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1A1A1A] group-hover:text-[#1A1AFF] md:text-[20px] md:leading-[28px] lg:text-[34px] lg:leading-[42px]">
                                {article.title}
                            </h2>

                            <div className="flex items-center gap-3">
                                <div className="h-[48px] w-[48px] rounded-full bg-[#D9D9D9]"></div>
                                <div className="flex flex-col">
                                    <h1 className="font-eudoxus text-[16px] font-[400] leading-5">{article.author}</h1>
                                    <span className="font-eudoxus text-[12px] font-[400] leading-[20px] text-[#A3A3A3]">
                                        Founder & CEO
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </Link>
        </div>
    );
};

export default BlogCard;
