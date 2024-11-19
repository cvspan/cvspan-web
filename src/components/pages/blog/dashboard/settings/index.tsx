'use client';

import React from 'react';

import BlogDashboardWrapper from '@/components/molecules/blogComponents/BlogDashboardWrapper';
import BlogSettings from '@/components/molecules/blogComponents/BlogSettings.tsx';

const BlogDashboardSettings = () => {
    return (
        <>
            <BlogDashboardWrapper title="Settings">
                <BlogSettings />
            </BlogDashboardWrapper>
        </>
    );
};

export default BlogDashboardSettings;
