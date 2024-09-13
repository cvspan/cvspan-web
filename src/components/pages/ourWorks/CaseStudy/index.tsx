import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import AboutProject from '@/components/molecules/AboutProject/AboutProject';
import CaseStudyLanding from '@/components/molecules/CaseStudyLanding/CaseStudyLanding';
import TheDesign from '@/components/molecules/TheDesign/TheDesign';
import TheProcess from '@/components/molecules/TheProcess/TheProcess';
import TheResult from '@/components/molecules/TheResult/TheResult';

import ImagePage from './image';

export default function CaseStudy() {
    return (
        <>
            <Navbar />
            <CaseStudyLanding />
            <ImagePage />
            <AboutProject />
            <TheDesign />
            <TheProcess />
            <TheResult />
            <Cta />
            <Footer />
        </>
    );
}
