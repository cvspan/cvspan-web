'use client';

import React from 'react';

import BlogDashboardWrapper from '@/components/molecules/blogComponents/BlogDashboardWrapper';
import MyBlogCards from '@/components/molecules/blogComponents/MyBlogCards';

const BlogDashboardMyPosts = () => {
    return (
        <>
            <BlogDashboardWrapper title="My Posts">
                <MyBlogCards />
            </BlogDashboardWrapper>
        </>
    );
};

export default BlogDashboardMyPosts;
