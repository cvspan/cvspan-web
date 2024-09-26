import React from 'react';

import Link from 'next/link';

import { TBlogCard } from '@/types';
import { cn } from '@/lib/utils';

const cards: TBlogCard[] = [
    {
        title: 'Top 10 Digital Design Agencies',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle.png',
    },
    {
        title: 'What is design research?',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/card2.png',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/card3.png',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle.png',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle.png',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle.png',
    },

    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle.png',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle.png',
    },
];

const BlogCards = ({
    containerClassname = '',
    maximumInRow = '3',
}: {
    containerClassname?: string;
    maximumInRow?: '3' | '2';
}) => {
    return (
        <div className={cn('px-5 py-[60px] lg:py-[120px]', containerClassname)}>
            <div className="mx-auto w-full max-w-[1200px]">
                <div
                    className={cn(
                        maximumInRow === '3'
                            ? 'grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3'
                            : 'grid grid-cols-1 gap-[24px] md:grid-cols-2',
                    )}
                >
                    {cards.map((card, index) => (
                        <BlogCard card={card} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogCards;

const BlogCard = ({ card }: { card?: TBlogCard }) => {
    return (
        <Link className="mb-8 w-full md:mx-0 md:mb-16" href="/blog/blog-post">
            <>
                <div className="group overflow-hidden">
                    <div className="mb-5 h-[220px] w-full scale-100 overflow-hidden object-cover group-hover:scale-100">
                        <img
                            src={card?.image}
                            alt={card?.title}
                            className="h-full w-full scale-105 object-cover transition duration-300 ease-in-out group-hover:scale-100"
                        />
                    </div>
                    <div className="">
                        <div className="mb-5 flex items-center gap-5">
                            <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-[14px] font-medium">
                                Article
                            </p>
                            <p className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#1A1A1A]">
                                {card?.time}
                            </p>
                        </div>

                        <h2 className="mb-5 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1A1A1A] group-hover:text-[#1A1AFF] md:text-[20px] md:leading-[28px] lg:text-[34px] lg:leading-[42px]">
                            {card?.title}
                        </h2>

                        <Link href="/blog/author/profile" className="flex items-center gap-3 hover:underline">
                            <div className="h-[48px] w-[48px] rounded-full bg-[#D9D9D9]"></div>
                            <div className="flex flex-col">
                                <h1 className="font-eudoxus text-[16px] font-[400] leading-5">{card?.author}</h1>
                                <span className="font-eudoxus text-[12px] font-[400] leading-[20px] text-[#A3A3A3]">
                                    Founder & CEO
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </>
        </Link>
    );
};
