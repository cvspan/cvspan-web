'use client';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
import DesignSystem from '@/components/molecules/CaseVisuals/LeeDeonVisual';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';
import { CASE_STUDY_RESULTS } from '@/components/molecules/TheResult/data';
import MobileScreens from '@/components/molecules/Screens/MobileScreens';
import ImagePage from '@/components/molecules/Screens/image';

export default function LeeDeon() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding
                header="Lee Deon"
                paragraph="A revolutionary app that celebrates acts of kindness within your community."
                buttons={['UI/UX DESIGN', 'UX STRATEGY', 'MOBILE DESIGN', '3D DESIGN', 'BRANDING']}
            />
            <ImagePage image="leedeon" />
            <AboutProject
                solution="Lee Doan addresses this challenge by providing a user-friendly app where individuals can share their stories of goodwill and receive tokens of appreciation in return. By leveraging geolocation technology, users can easily find and recognize local heroes who make a positive impact. "
                challenge="In today's fast-paced world, acts of kindness often go unnoticed and unrewarded. People want to express their gratitude but lack a simple and meaningful way to do so. How can we create a platform that not only acknowledges good deeds but also empowers users to show their appreciation through tangible rewards?"
            />
            <MobileScreens mobileImage="leedeon-mobile" />
            <DesignSystem />
            <TheProcess />
            <TheResult results={CASE_STUDY_RESULTS['leedeon']} />
            <Cta />
            <Footer />
        </>
    );
}
