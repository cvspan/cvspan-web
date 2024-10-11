'use client';

import React from 'react';

import BlogDashboardWrapper from '@/components/molecules/blogComponents/BlogDashboardWrapper';
import MyBlogCards from '@/components/molecules/blogComponents/MyBlogCards';

const BlogDashboardAllPosts = () => {
    return (
        <>
            <BlogDashboardWrapper title="My Posts">
                <MyBlogCards />
            </BlogDashboardWrapper>
        </>
    );
};

export default BlogDashboardAllPosts;
