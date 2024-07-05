import React from 'react';
import Rectangle from '../../../../public/assets/images/Rectangle.png';
import card2 from '../../../../public/assets/images/card2.png';
import card3 from '../../../../public/assets/images/card3.png';

import Image from 'next/image';
import Link from 'next/link';

const articles = [
    {
        title: 'Top 10 Digital Design Agencies',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: Rectangle,
    },
    {
        title: 'What is design research?',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: card2,
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: card3,
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: Rectangle,
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: Rectangle,
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: Rectangle,
    },
];

const BlogCard = () => {
    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-24 pt-10">
            <div className="flex flex-wrap justify-center">
                {articles.map((article, index) => (
                    <Link className="mb-16 w-full px-4 sm:w-1/2 lg:w-1/3" key={index} href="/blog/blog-post">
                        <>
                            <div className="overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    className="mb-5 h-[220px] w-[384px] object-cover"
                                />
                                <div className="">
                                    <div className="mb-5 flex items-center gap-5">
                                        <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-[14px] font-medium">
                                            Article
                                        </p>
                                        <p className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#1A1A1A]">
                                            {article.time}
                                        </p>
                                    </div>

                                    <h2 className="mb-5 font-eudoxus text-[24px] font-medium leading-[32px] md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[30px]">
                                        {article.title}
                                    </h2>

                                    <div className="flex items-center gap-3">
                                        <div className="h-[48px] w-[48px] rounded-full bg-[#D9D9D9]"></div>
                                        <div className="flex flex-col">
                                            <h1 className="font-eudoxus text-[16px] font-[400] leading-5">
                                                {article.author}
                                            </h1>
                                            <span className="font-eudoxus text-[12px] font-[400] leading-[20px] text-[#A3A3A3]">
                                                Founder & CEO
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogCard;
