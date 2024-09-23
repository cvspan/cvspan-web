'use client';
import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Aboutlanding from '@/components/molecules/Aboutlanding/Aboutlanding';
import { HowweWork } from '@/components/molecules/HowWeWork';
import { OurTeam } from '@/components/molecules/OurTeam';
import Achievements from '@/components/molecules/achievements';
import StoriesCard from '@/components/molecules/Stories/StoriesCard';
import FactsAndFigures from '@/components/molecules/FactsAndFigures';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import GlobalTeam from '@/components/molecules/GlobalTeam';

export default function Aboutpage() {
    return (
        <>
            <Navbar light={false} />
            <Aboutlanding />
            <StoriesCard />
            <HowweWork />
            <FactsAndFigures
                title="Facts & Figures"
                description={`We have developed over 20 sustainable startup products and assisted more than 100 brands in securing substantial funding, achieving successful acquisitions, and establishing themselves as globally recognized companies.`}
                card1Number={80}
                card2Number={56}
                card3Number={1}
                card4Number={28}
                containerBackground="/assets/images/backgrounds/about-figures-bg.webp"
            />

            <OurTeam />
            <Achievements />
            <GlobalTeam />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
}
