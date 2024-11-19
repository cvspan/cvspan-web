import React from 'react';
import { Frontend } from '@/components/molecules/SpecificJobDetail/front-end';
import GlobalTeam from '@/components/molecules/GlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import './index.css';

export default function SpecificJobPage() {
    return (
        <>
            <Navbar light showScrollWatcher />
            <Frontend />
            <GlobalTeam />
            <Footer />
        </>
    );
}
