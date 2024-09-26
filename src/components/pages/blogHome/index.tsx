'use client';
import React from 'react';
import Cta from '@/components/molecules/CTA';
import Footer from '@/components/molecules/layout/footer';
import BlogCards from '@/components/molecules/blogComponents/publicProfileComponent/blogCards';
import BlogNavbar from '@/components/molecules/blogComponents/reuseables/blogNavbar';
import HomeBlogCard from '@/components/molecules/blogComponents/homeBlogCard';

type Props = {};

const BlogHome = (props: Props) => {
    return (
        <div className="">
            <div className="">
                <BlogNavbar />
            </div>
            <div className="lg:pt-28">
                <HomeBlogCard />
                <Cta />
            </div>
            <Footer />
        </div>
    );
};

export default BlogHome;
