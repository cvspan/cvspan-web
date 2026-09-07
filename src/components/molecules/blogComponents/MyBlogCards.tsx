import React from 'react';
import { TBlogCard } from '@/types';
type Props = {};
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const cards: TBlogCard[] = [
    {
        title: 'Top 10 Digital Design Agencies',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle-1200w.webp',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
    {
        title: 'What is design research?',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/card2.png',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/card3.png',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle-1200w.webp',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle-1200w.webp',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle-1200w.webp',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },

    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: '/assets/images/Rectangle-1200w.webp',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
    {
        title: 'UX Research for an NFT platform – Metastaq',
        author: 'Moses Arfo',
        time: '3 mins read',
        image: 'c',
        blogMiniText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremq',
    },
];

const MyBlogCards = (props: Props) => {
    return (
        <div className="mt-[20px]">
            <div className="grid w-full grid-cols-2 gap-5">
                {cards.map((card, index) => (
                    <MyBlogCard card={card} key={index} />
                ))}
            </div>
        </div>
    );
};

const MyBlogCard = ({ card }: { card?: TBlogCard }) => {
    return (
        <div className="flex gap-5 border-[.5px] border-[#D1D1d1] p-5">
            <div className="h-[101px] w-[140px]">
                <img src="/assets/images/blog-cover.svg" alt="" className="object-contains" />
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-1">
                    <h3 className="font-pp-mori text-[16px] font-[500] leading-[24px] text-[#1a1a1a]">
                        Top 10 Digital Design Agencies
                    </h3>
                    <span className="">
                        <img src="/assets/icons/arrow_top_right_black.svg" alt="" className="h-[9px] w-[9px]" />
                    </span>
                </div>

                <p className="font-pp-mori text-[16px] font-[400] leading-[24px] text-[#767676]">
                    {card?.blogMiniText}...
                </p>
                <div className="flex items-center justify-between">
                    <p className="font-pp-mori text-[12px] font-[400] leading-[20px] text-[#1a1a1a]">
                        Published&nbsp;on&nbsp; <span className="font-[500]">Aug 9, 2024</span> · 4 min read
                    </p>
                    <span className="">
                        <Dropdown />
                    </span>
                </div>
            </div>
        </div>
    );
};

const Dropdown = () => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <button>
                        <img src="/assets/icons/menu-dots.svg" alt="" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-[5px] rounded-xl p-4">
                    <DropdownMenuItem>
                        <div className="">
                            <p className="font-gordita text-[16px] font-normal leading-[24px]">Edit</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <div className="">
                            <p className="font-gordita text-[16px] font-normal leading-[24px] text-[#ff0000]">Delete</p>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default MyBlogCards;
