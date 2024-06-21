import React from 'react';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import FactsAndFigures from '@/components/molecules/FactsAndFigures';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import Clients from '@/components/molecules/Clients';
import GetThings from '@/components/molecules/GetThings';
import { DigitalProducts } from '@/components/molecules/DigitalProducts';
function page() {
    return (
        <>
            <Navbar light />
            <FactsAndFigures />
            <Faqs />
            <Testimonials />
            <Cta />
            <Clients />
            <GetThings />
            <DigitalProducts />
            <Footer />
        </>
    );
}

export default page;
