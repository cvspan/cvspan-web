import Cta from '@/components/molecules/layout/cta';
import FactsAndFigures from '@/components/molecules/layout/factsAndFigures';
import Faqs from '@/components/molecules/layout/faqs';
import Testimonials from '@/components/molecules/layout/testimonials';

export default function Homepage() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-between bg-custom-dark text-white">
            <div className="flex h-full flex-col justify-between gap-y-24">
                <div className="m-auto w-full max-w-7xl pl-6 pr-6">
                    <FactsAndFigures />
                </div>
                <div className="m-auto w-full max-w-7xl pl-6 pr-6">
                    <Faqs />
                </div>
                <div className="m-auto w-full max-w-7xl pl-6 pr-6">
                    <Testimonials />
                </div>
                <div className="bg-cta-bg w-full bg-cover bg-center bg-no-repeat bg-origin-border pl-6 pr-6">
                    <Cta />
                </div>
            </div>
        </main>
    );
}
