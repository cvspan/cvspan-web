import React from 'react';
import './index.css';
import { SpecificJobDetail } from '@/components/molecules/SpecificJobDetail';
import { SpecificJobGlobalTeam } from '@/components/molecules/SepcificJobGlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

export default function SpecificJobPage() {
    return (
        <>
            <Navbar light />
            <SpecificJobDetail />
            <SpecificJobGlobalTeam />
            <Footer />
        </>
    );
}
