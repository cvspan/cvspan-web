import Homelanding from '@/components/molecules/Homelanding/Homelanding';
import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

import StoriesCard from '@/components/molecules/Stories/StoriesCard';
import { DigitalProducts } from '@/components/molecules/DigitalProducts';
import FactsAndFigures from '@/components/molecules/FactsAndFigures';
import FeaturedDigitalProducts from '@/components/molecules/featuredDigitalProducts';

export default function Homepage() {
    return (
        <>
            <Homelanding />
            <Navbar light />
            <StoriesCard />
            <DigitalProducts />
            <FactsAndFigures />
            <FeaturedDigitalProducts />
            <Footer />
        </>
    );
}
