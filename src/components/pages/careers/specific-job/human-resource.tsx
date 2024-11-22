import React from 'react';
import { HumanResource } from '@/components/molecules/SpecificJobDetail/human-resource';
import GlobalTeam from '@/components/molecules/GlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import './index.css';

export default function SpecificJobPage() {
    return (
        <>
            <Navbar light showScrollWatcher />
            <HumanResource />
            <GlobalTeam />
            <Footer />
        </>
    );
}
