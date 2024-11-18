import React from 'react';
import { HumanResources } from '@/components/molecules/SpecificJobDetail/human-resources';
import GlobalTeam from '@/components/molecules/GlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import './index.css';

export default function SpecificJobPage() {
    return (
        <>
            <Navbar light showScrollWatcher />
            <HumanResources />
            <GlobalTeam />
            <Footer />
        </>
    );
}
