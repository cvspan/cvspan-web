'use client';

import React from 'react';

import Footer from '@/components/molecules/layout/footer';
import BlogNavbar from '@/components/molecules/blogComponents/BlogNavbar';
import BlogDashboardSideBar from './BlogDashboardSideBar';

const BlogDashboardWrapper = ({ children, title }: { children: React.ReactNode; title?: string }) => {
    return (
        <>
            <BlogNavbar />

            <div className="px-5">
                <div className="mx-auto mt-[60px] flex h-full min-h-[50vh] w-full max-w-[1200px] lg:mt-20">
                    <BlogDashboardSideBar />
                    <div className="flex-1 px-[20px] py-[30px] lg:py-[50px]">
                        {title ? <h2 className="mb-[32px] text-[24px] font-[500] text-[#1A1A1A]">{title}</h2> : null}
                        {children}
                    </div>
                </div>
            </div>
            <Footer showBorderTop />
        </>
    );
};

export default BlogDashboardWrapper;
