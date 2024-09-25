'use client';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
import VisualDesign from '@/components/molecules/CaseVisuals/CoastalVisual';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';
import MobileScreens from '@/components/molecules/Screens/MobileScreens';
import ImagePage from '@/components/molecules/Screens/image';
import Mockup from '@/components/molecules/Screens/Mockup';

export default function CoastalLoans() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding
                header="California Costal Loans"
                paragraph="An app that offers personalized mortgage loans based on your credit score and calculates your DTI ratio, ensuring informed decisions."
                buttons={['UI/UX DESIGN', 'UX STRATEGY', 'MOBILE DESIGN', '3D DESIGN', 'BRANDING']}
            />
            <ImagePage image="coastal" />
            <AboutProject
                solution="California Coastal Loans provide personalized mortgage options using credit scores and calculate DTI ratios for financial clarity. This app empowers users to navigate the California real estate market confidently and responsibly."
                challenge="Simplifying real estate and mortgage loans while ensuring financial well-being is a complex task. How can we create an app that grants mortgage loans based on credit scores, calculates DTI ratios, and empowers users to make smart property decisions?"
            />
            <Mockup image="coastal-mockup" />
            <MobileScreens mobileImage="coastal-mobile" />
            <VisualDesign />
            <TheProcess />
            <TheResult />
            <Cta />
            <Footer />
        </>
    );
}
