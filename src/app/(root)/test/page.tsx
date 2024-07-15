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
import FeaturedDigitalProducts from '@/components/molecules/featuredDigitalProducts';
import Achievements from '@/components/molecules/achievements';
import Button from '@/components/molecules/Button';

function page() {
    return (
        <>
            <Navbar light />
            <div className="flex flex-col gap-[20px] bg-slate-300 p-[100px]">
                <Button title="LET'S TALK" height="56px" />
                <Button
                    title="LET'S TALK"
                    background="blue"
                    rightIcon={'/assets/icons/whie-pencil-icon.svg'}
                    rightIconSize="18px"
                />
                <Button title="OUR SERVICES" background="white" height="56px" />
                <Button title="GET STARTED" background="dark" height="56px" />
                <Button title="LET'S TALK" height="56px" fullWidth />
            </div>
            <FactsAndFigures />
            <FeaturedDigitalProducts />
            <FeaturedDigitalProducts />
            <Achievements />
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
