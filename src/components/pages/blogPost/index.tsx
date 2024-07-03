import Cta from '@/components/molecules/CTA';
import BlogPostLanding from '@/components/molecules/blogPostLanding';
import Summary from '@/components/molecules/blogSummary';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
import React from 'react';

const BlogPost = () => {
    return (
        <>
            <Navbar light />
            <BlogPostLanding />
            <Summary />
            <Cta />
            <Footer />
        </>
    );
};

export default BlogPost;
