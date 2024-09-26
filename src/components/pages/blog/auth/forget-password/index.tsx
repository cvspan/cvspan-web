import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import ForgetPassword from '@/components/molecules/blogComponents/authCompoents/ForgetPassword';
import Navbar from '@/components/molecules/layout/navbar';

type Props = {};

const AuthorForgetPassword = (props: Props) => {
    return (
        <div>
            <Navbar light={true} showScrollWatcher />
            <div className="lg:pt-12">
                <ForgetPassword />
            </div>
            <Footer showBorderTop />
        </div>
    );
};

export default AuthorForgetPassword;
