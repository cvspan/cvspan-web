'use client';
import React, { useState, useEffect } from 'react';
import Homelanding from '@/components/molecules/Homelanding/Homelanding';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

import StoriesCard from '@/components/molecules/Stories/StoriesCard';
import { DigitalProducts } from '@/components/molecules/DigitalProducts';
import FactsAndFigures from '@/components/molecules/FactsAndFigures';
import FeaturedDigitalProducts from '@/components/molecules/featuredDigitalProducts';
import Clients from '@/components/molecules/Clients';
import Achievements from '@/components/molecules/achievements';
import Faqs from '@/components/molecules/FAQS';
import Cta from '@/components/molecules/CTA';
import Testimonials from '@/components/molecules/Testimonials';
export default function Homepage() {
    const [light, setLight] = useState<boolean | false>(false);

    const onNavbarBgChange = () => {
        window.scrollY >= 820 ? setLight(true) : setLight(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', onNavbarBgChange);
        return () => {
            window.removeEventListener('scroll', onNavbarBgChange);
        };
    }, []);
    return (
        <>
            <Navbar light={light} />
            <Homelanding />
            <Clients />
            <StoriesCard />
            <DigitalProducts />
            <FactsAndFigures />
            <FeaturedDigitalProducts />
            <Achievements />
            <Faqs />
            <Testimonials />

            <Cta />
            <Footer />
        </>
    );
}
