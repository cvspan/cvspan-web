'use client';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
// import TheDesign from '@/components/molecules/TheDesign/TheDesign';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';
import MobileScreens from '@/components/molecules/Screens/MobileScreens';
import DesktopScreens from '@/components/molecules/Screens/DesktopScreens';

import ImagePage from '@/components/molecules/Screens/image';

export default function Nemo() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding
                header="Little Nemo Nursery"
                paragraph="Little Nemo Nursery, is a nursery in Tufnell Park Road London, United Kingdom."
                buttons={['UI/UX DESIGN', 'UX STRATEGY', 'MOBILE DESIGN', 'WEB DESIGN', 'BRANDING']}
            />
            <ImagePage image="nemo" />
            <AboutProject
                solution="To address these issues, we propose a comprehensive redesign that focuses on creating a visually appealing and user-friendly website. By incorporating modern design elements, intuitive navigation, and clear information architecture, we aim to enhance communication, showcase the nursery's values, services, and commitment to child development, and provide an engaging online experience for parents and potential clients."
                challenge="The current Little Nemo Nursery website suffers from poor design and usability, creating barriers in effectively engaging with parents and potential clients. The existing interface lacks visual appeal and intuitive navigation, hindering seamless communication and information access."
            />
            <DesktopScreens desktopImage="nemo-desktop" />
            <MobileScreens mobileImage="nemo-mobile" />
            <TheProcess />
            <TheResult />
            <Cta />
            <Footer />
        </>
    );
}
