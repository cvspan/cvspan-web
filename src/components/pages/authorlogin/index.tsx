import React from 'react';
import BlogNavbar from '@/components/molecules/blogComponents/reuseables/blogNavbar';
import Footer from '@/components/molecules/layout/footer';
import AuthorLogin from '@/components/molecules/blogComponents/authCompoents/AuthorLogin';

type Props = {};

const Authorlogin = (props: Props) => {
    return (
        <div>
            <BlogNavbar />
            <div className="lg:pt-28">
                <AuthorLogin />
            </div>
            <Footer />
        </div>
    );
};

export default Authorlogin;
