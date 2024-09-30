import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import BlogLoginComponent from '@/components/molecules/blogComponents/authCompoents/BlogLogin';
import Navbar from '@/components/molecules/layout/navbar';

const BlogLogin = () => {
    return (
        <div>
            <Navbar light={true} showScrollWatcher />
            <div className="lg:pt-12">
                <BlogLoginComponent />
            </div>
            <Footer showBorderTop />
        </div>
    );
};

export default BlogLogin;
