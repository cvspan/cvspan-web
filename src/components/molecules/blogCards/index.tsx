import React from 'react';
import Rectangle from '../../../../public/assets/images/Rectangle.png';
import card2 from '../../../../public/assets/images/card2.png';
import card3 from '../../../../public/assets/images/card3.png';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

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
        <div className="px-5">
            <div className="mx-auto w-full max-w-[1200px] py-[60px] lg:py-[120px]">
                <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <Link className="mb-8 w-full md:mx-0 md:mb-16" key={index} href="/cvspan-blog/blog-post">
                            <>
                                <motion.div {...ANIMATE_PROPS({ from: 'bottom' })} className="group overflow-hidden">
                                    <div className="mb-5 h-[220px] w-full scale-100 overflow-hidden object-cover group-hover:scale-100 md:w-[384px]">
                                        <Image
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
                                                <h1 className="font-eudoxus text-[16px] font-[400] leading-5">
                                                    {article.author}
                                                </h1>
                                                <span className="font-eudoxus text-[12px] font-[400] leading-[20px] text-[#A3A3A3]">
                                                    Founder & CEO
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
