'use client';
import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
// import TheDesign from '@/components/molecules/TheDesign/TheDesign';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';
import { CASE_STUDY_RESULTS } from '@/components/molecules/TheResult/data';
import MobileScreens from '@/components/molecules/Screens/MobileScreens';
// import DesktopScreens from '@/components/molecules/Screens/DesktopScreens';

import ImagePage from '@/components/molecules/Screens/image';

export default function Phozio() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding
                header="Phozio"
                paragraph=""
                buttons={['UI/UX DESIGN', 'UX STRATEGY', 'MOBILE DESIGN', '3D DESIGN', 'SEO']}
            />
            <ImagePage image="phozio" />
            <AboutProject
                solution="We will design a mobile application that will serve as a platform where photographers and photo lovers can sell their pictures to Big brands conducting marketing campaigns through the platform. The platform will be a social media platform to implement the kind of community these users are already used to. It will give a business feel as well as a fun feel."
                challenge="Photographer and Picture lovers needs a dedicated App to share pictures and also sell and make money directly from the platform. Phozio seeks to create a dedicated niche where these kind of users can make money from their pictures and Brands can get value running campaigns."
            />
            <MobileScreens mobileImage="phozio-mobile" />
            <TheProcess />
            <TheResult results={CASE_STUDY_RESULTS['phozio']} />
            <Cta />
            <Footer />
        </>
    );
}
