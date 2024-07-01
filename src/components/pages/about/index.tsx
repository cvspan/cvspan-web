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

export default function Aboutpage() {
    return (
        <>
            <Navbar light />
            <Aboutlanding />
            <StoriesCard />
            <HowweWork />
            <FactsAndFigures />
            <OurTeam />
            <Achievements />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
}
