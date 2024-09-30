'use client';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';
import MobileScreens from '@/components/molecules/Screens/MobileScreens';
import ImagePage from '@/components/molecules/Screens/image';
import DesignSystem from '@/components/molecules/CaseVisuals/CourtzVisual';
import Mockup from '@/components/molecules/Screens/Mockup';

export default function Courtz() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding
                header="Courtz"
                paragraph="Your ultimate destination for hassle-free outdoor tennis court bookings and sports equipment rentals."
                buttons={['UI/UX DESIGN', 'UX STRATEGY', 'MOBILE DESIGN', '3D DESIGN', 'BRANDING']}
            />
            <ImagePage image="courtz" />
            <AboutProject
                solution="Courtz tackles this challenge by offering an intuitive app where users can effortlessly discover nearby outdoor tennis courts and book them instantly. The app provides real-time availability, pricing, and location details, ensuring users have all the information they need at their fingertips. Additionally, Courtz offers the option to rent sports items like rackets and balls, eliminating the need for users to carry their equipment around. "
                challenge="Traditional methods of booking tennis courts often involve time-consuming phone calls, limited availability information, and uncertainty about equipment availability. How can we simplify the process and create an app that not only streamlines court reservations but also provides users with access to sports equipment, making their tennis experience more enjoyable?"
            />
            <Mockup image="courtz-mockupp" />
            <MobileScreens mobileImage="courtz-mobile" />
            <DesignSystem />
            <TheProcess />
            <TheResult />
            <Cta />
            <Footer />
        </>
    );
}
