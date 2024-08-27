'use client';
import React from 'react';
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
    return (
        <>
            <Navbar light={false} />
            <Homelanding />
            <Clients />
            <StoriesCard />
            <DigitalProducts />
            <FactsAndFigures
                title="Facts & Figures"
                description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
                card1Number={80}
                card2Number={56}
                card3Number={1}
                card4Number={28}
                containerBackground="/assets/images/backgrounds/about-figures-bg.webp"
            />
            <FeaturedDigitalProducts />
            <Achievements />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
}
