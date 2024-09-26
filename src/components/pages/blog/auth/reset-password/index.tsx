import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import ResetPassword from '@/components/molecules/blogComponents/authCompoents/ResetPassword';
import Navbar from '@/components/molecules/layout/navbar';

const BlogResetPassword = () => {
    return (
        <div>
            <Navbar light={true} showScrollWatcher />
            <div className="lg:pt-12">
                <ResetPassword />
            </div>
            <Footer showBorderTop />
        </div>
    );
};

export default BlogResetPassword;
