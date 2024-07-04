import Homelanding from '@/components/molecules/Homelanding/Homelanding';
import React from 'react';
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

export default function Homepage() {
    return (
        <>
            <Navbar light={false} />
            <Homelanding />
            <Clients />
            <StoriesCard />
            <DigitalProducts />
            <FactsAndFigures />
            <FeaturedDigitalProducts />
            <Achievements />
            <Faqs />
            <Cta />
            <Footer />
        </>
    );
}
