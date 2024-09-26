import React from 'react';
import BlogNavbar from '@/components/molecules/blogComponents/reuseables/blogNavbar';
import Footer from '@/components/molecules/layout/footer';
import ResetPassword from '@/components/molecules/blogComponents/authCompoents/ResetPassword';

type Props = {};

const AuthorResetPassword = (props: Props) => {
    return (
        <div>
            <BlogNavbar />
            <div className="lg:pt-28">
                <ResetPassword />
            </div>
            <Footer />
        </div>
    );
};

export default AuthorResetPassword;
