import React from 'react';
import UIlanding from '@/components/molecules/UILanding/UIlanding';
import Design from '@/components/molecules/design/page';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';

const DesignPage = () => {
    return (
        <>
            <Navbar light />
            <UIlanding />
            <Design />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default DesignPage;
