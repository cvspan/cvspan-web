'use client';

import React from 'react';

import BlogNavbar from '@/components/molecules/blogComponents/BlogNavbar';

const BlogDashboardWrite = () => {
    return (
        <>
            <BlogNavbar />
            <div className="mt-[60px] border-t-[1px] border-t-[#D1D1D1] px-5 lg:mt-20">
                <div className="mx-auto flex h-full min-h-[50vh] w-full max-w-[1200px] py-[30px] lg:py-[50px]">
                    <div className="flex-1 px-[20px]">
                        <h1 className="mb-[32px] text-[24px] font-[500] text-[#1A1A1A]">Write a post</h1>
                        <div className="border-[1px] border-[#D1D1D1]">TITLE NPUT</div>
                        <div className="mt-[12px] border-[1px] border-[#D1D1D1]">TEXT EDITOR</div>
                    </div>
                    <div className="flex max-w-[300px] flex-1 flex-col border-[1px] border-[#D1D1D1]">
                        <div className="sticky top-[100px]">WRITE WRITEWRITEWRITEWRITE WRITE</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDashboardWrite;
