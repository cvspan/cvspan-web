import React from 'react';
import BlogNavbar from '@/components/molecules/blogComponents/reuseables/blogNavbar';
import Footer from '@/components/molecules/layout/footer';
import ForgetPassword from '@/components/molecules/blogComponents/authCompoents/ForgetPassword';

type Props = {};

const AuthorForgetPassword = (props: Props) => {
    return (
        <div>
            <BlogNavbar />
            <div className="lg:pt-28">
                <ForgetPassword />
            </div>
            <Footer />
        </div>
    );
};

export default AuthorForgetPassword;
