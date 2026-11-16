'use client';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
import TheDesign from '@/components/molecules/TheDesign/TheDesign';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';
import { CASE_STUDY_RESULTS } from '@/components/molecules/TheResult/data';
import MobileScreens from '@/components/molecules/Screens/MobileScreens';
import DesktopScreens from '@/components/molecules/Screens/DesktopScreens';
import Visual from '@/components/molecules/CaseVisuals/NeverbareVisual';

import ImagePage from '@/components/molecules/Screens/image';

export default function NeverBare() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding
                header="NeverBare"
                paragraph="NeverBare is a design agency that thrives on breaking creative barriers. With a passion for crafting captivating visuals, it specializes in transforming ideas into remarkable design experiences."
                buttons={['UI/UX DESIGN', 'UX STRATEGY', 'MOBILE DESIGN', '3D DESIGN', 'BRANDING']}
            />
            <ImagePage image="neverbare" />
            <AboutProject
                solution="To meet client expectations and timelines, the design agency should adopt structured processes, encourage collaboration, prioritize efficient management, foster skill development, focus on user-centric design, and implement regular reviews. This ensures impactful designs and growth."
                challenge="The design agency is grappling with the challenge of consistently delivering innovative and impactful design solutions to clients while managing tight timelines and evolving client expectations. The demand for creative excellence is high, and the agency must navigate through varying project scopes, resource constraints, and the need to balance aesthetics with functionality."
            />
            <TheDesign />
            <DesktopScreens desktopImage="neverbare-desktop" />
            <MobileScreens mobileImage="neverbare-mobile" />
            <Visual />
            <TheProcess />
            <TheResult results={CASE_STUDY_RESULTS['neverbare']} />
            <Cta />
            <Footer />
        </>
    );
}
