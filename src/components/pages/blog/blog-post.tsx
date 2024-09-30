'use client';

import React from 'react';
import BlogPostLanding from '@/components/molecules/blogComponents/BlogPostLanding';
import BlogPostSummary from '@/components/molecules/blogComponents/BlogPostSummary';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';

const BlogPost = () => {
    return (
        <>
            <Navbar light />
            <BlogPostLanding />
            <BlogPostSummary />
            <CTA_MissAnything />
            <Footer />
        </>
    );
};

export default BlogPost;
