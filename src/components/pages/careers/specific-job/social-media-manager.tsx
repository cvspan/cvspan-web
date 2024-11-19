import React from 'react';
import { SocialMediaManager } from '@/components/molecules/SpecificJobDetail/social-media-manager';
import GlobalTeam from '@/components/molecules/GlobalTeam';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import './index.css';

export default function SpecificJobPage() {
    return (
        <>
            <Navbar light showScrollWatcher />
            <SocialMediaManager />
            <GlobalTeam />
            <Footer />
        </>
    );
}
