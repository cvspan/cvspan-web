import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavigationItem {
    image: string;
    link: string;
    title: string;
}

export const blogSideBarItems: NavigationItem[] = [
    {
        image: '/assets/icons/my-posts.svg',
        link: '/blog/dashboard/my-posts',
        title: 'My Posts',
    },
    {
        image: '/assets/icons/profile.svg',
        link: '/blog/dashboard/profile',
        title: 'Profile',
    },
    {
        image: '/assets/icons/settings.svg',
        link: '/blog/dashboard/settings',
        title: 'Settings',
    },
    {
        image: '/assets/icons/logout.svg',
        link: '/blog/auth/login',
        title: 'Logout',
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
                            <img src={item?.image} className="h-[16px] w-[16px]" />{' '}
                            <span className="text-[14px] leading-[22px] text-[#1A1A1A]">{item?.title}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default BlogDashboardSideBar;
