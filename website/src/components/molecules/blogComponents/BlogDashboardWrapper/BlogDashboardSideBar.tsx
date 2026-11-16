import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TUserType } from '@/types/blog';
import { count } from 'console';

interface NavigationItem {
    image: string;
    link: string;
    title: string;
    user_type: TUserType[];
    count?: number;
}

export const blogSideBarItems: NavigationItem[] = [
    {
        image: '/assets/icons/my-posts.svg',
        link: '/blog/dashboard/my-posts',
        title: 'My Posts',
        user_type: ['author'],
        count: 5,
    },

    {
        image: '/assets/icons/my-posts.svg',
        link: '/blog/dashboard/all-posts',
        title: 'All Posts',
        user_type: ['admin'],
        count: 0,
    },
    {
        image: '/assets/icons/profile.svg',
        link: '/blog/dashboard/profile',
        title: 'Profile',
        user_type: ['admin', 'author'],
        count: 0,
    },

    {
        image: '/assets/icons/profile.svg',
        link: '/blog/dashboard/authors',
        title: 'Authors',
        user_type: ['admin', 'author'],
        count: 0,
    },

    {
        image: '/assets/icons/settings.svg',
        link: '/blog/dashboard/settings',
        title: 'Settings',
        user_type: ['admin', 'author'],
        count: 0,
    },
    {
        image: '/assets/icons/logout.svg',
        link: '/blog/auth/login',
        title: 'Logout',
        user_type: ['admin', 'author'],
        count: 0,
    },
];

function BlogDashboardSideBar() {
    const pathname = usePathname();
    return (
        <div className="hidden max-w-[194px] flex-1 flex-col border-r-[1px] border-r-[#D1D1D1] py-[30px] lg:flex lg:py-[50px]">
            <div className="sticky top-[100px]">
                {blogSideBarItems?.map((item) => {
                    const active = pathname === item?.link;
                    return (
                        <Link
                            href={item?.link}
                            key={item?.title}
                            className={cn(
                                'flex h-[40px] w-full items-center justify-start gap-[10px] rounded-bl-[8px] rounded-tl-[8px] p-[12px]',
                                active ? 'bg-[#F4F4F4]' : '',
                            )}
                        >
                            <img
                                src={item?.image}
                                className="h-[16px] w-[16px]"
                                alt=""
                                loading="lazy"
                                decoding="async"
                            />{' '}
                            <span className="text-[14px] leading-[22px] text-[#1A1A1A]">{item?.title}</span>
                            {(item?.count || 0) > 0 ? (
                                <div>
                                    <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#B40000]">
                                        <span className="text-[11px] text-white">
                                            {(item?.count || 0) > 99 ? '99+' : item?.count}
                                        </span>
                                    </div>
                                </div>
                            ) : undefined}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default BlogDashboardSideBar;
