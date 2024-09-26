import React from 'react';
import BlogNavbar from '@/components/molecules/blogComponents/reuseables/blogNavbar';
import Footer from '@/components/molecules/layout/footer';
import Signup from '@/components/molecules/blogComponents/authCompoents/Signup';

type Props = {};

const AuthhorSignup = (props: Props) => {
    return (
        <div>
            <BlogNavbar />
            <div className="lg:pt-28">
                <Signup />
            </div>
            <Footer />
        </div>
    );
};

export default AuthhorSignup;
