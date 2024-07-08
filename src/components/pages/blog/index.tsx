import Cta from '@/components/molecules/CTA';
import Homelanding from '@/components/molecules/Homelanding/Homelanding';
import BlogCard from '@/components/molecules/blogCards';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
import React from 'react';

const Blog = () => {
    return (
        <>
            <Navbar light />
            <Homelanding />
            <BlogCard />
            <Cta />
            <Footer />
        </>
    );
};

export default Blog;
