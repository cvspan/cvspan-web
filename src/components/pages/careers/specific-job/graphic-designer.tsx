import React from 'react';
import { GraphicDesigner } from '@/components/molecules/SpecificJobDetail/graphic-designer';
import GlobalTeam from '@/components/molecules/GlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import './index.css';

export default function SpecificJobPage() {
    return (
        <>
            <Navbar light showScrollWatcher />
            <GraphicDesigner />
            <GlobalTeam />
            <Footer />
        </>
    );
}
