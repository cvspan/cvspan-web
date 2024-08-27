import React from 'react';
import { SpecificJobDetail } from '@/components/molecules/SpecificJobDetail';
import GlobalTeam from '@/components/molecules/GlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import './index.css';

export default function SpecificJobPage() {
    return (
        <>
            <div className="scroll_watcher_wrapper">
                <div className="scroll_watcher"></div>
            </div>
            <Navbar light />
            <SpecificJobDetail />

            <GlobalTeam />
            <Footer />
        </>
    );
}
