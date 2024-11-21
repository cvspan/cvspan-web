'use client';

import React from 'react';

import BlogDashboardWrapper from '@/components/molecules/blogComponents/BlogDashboardWrapper';
import Profile from '@/components/molecules/blogComponents/authorProfile/Profile';

const BlogDashboardProfile = () => {
    return (
        <>
            <BlogDashboardWrapper title="My Profile">
                <Profile />
            </BlogDashboardWrapper>
        </>
    );
};

export default BlogDashboardProfile;
