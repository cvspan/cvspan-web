import React from 'react';
import StoriesCard from '@/components/molecules/Stories/StoriesCard';
import { DigitalProducts } from '@/components/molecules/DigitalProducts';
import FactsAndFigures from '@/components/molecules/FactsAndFigures';
import FeaturedDigitalProducts from '@/components/molecules/featuredDigitalProducts';

export default function Homepage() {
    return (
        <>
            <StoriesCard />
            <DigitalProducts />
            <FactsAndFigures />
            <FeaturedDigitalProducts />
        </>
    );
}
