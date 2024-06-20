import { DigitalProducts } from '@/components/molecules/layout/digitalProducts';
import Navbar from '@/components/molecules/layout/navbar';
import React from 'react';
export default function Homepage() {
    return (
        <>
            <Navbar light={true} />
            <DigitalProducts />
        </>
    );
}
