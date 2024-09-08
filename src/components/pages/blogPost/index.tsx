'use client';

import BlogPostLanding from '@/components/molecules/blogPostLanding';
import Summary from '@/components/molecules/blogSummary';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';
import React from 'react';

const BlogPost = () => {
    return (
        <>
            <Navbar light />
            <BlogPostLanding />
            <Summary />
            <CTA_MissAnything />
            <Footer />
        </>
    );
};

export default BlogPost;
