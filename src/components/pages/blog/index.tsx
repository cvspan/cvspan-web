'use client';

import React from 'react';
import Bloglanding from '@/components/molecules/blogComponents/Bloglanding/Bloglanding';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';
import BlogCards from '@/components/molecules/blogComponents/BlogCards';

const BlogPage = () => {
    return (
        <>
            <Navbar light={false} />

            <Bloglanding />
            <BlogCards />
            <CTA_MissAnything />
            <Footer />
        </>
    );
};

export default BlogPage;
