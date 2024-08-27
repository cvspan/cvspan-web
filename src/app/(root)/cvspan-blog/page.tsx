'use client';

import React from 'react';
import Bloglanding from '@/components/molecules/Bloglanding/Bloglanding';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';
import BlogCard from '@/components/molecules/blogCards';

const page = () => {
    return (
        <>
            <Navbar />
            <Bloglanding />
            <BlogCard />
            <CTA_MissAnything />
            <Footer />
        </>
    );
};

export default page;
