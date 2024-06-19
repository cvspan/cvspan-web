import Cta from '@/components/molecules/layout/cta';
import FactsAndFigures from '@/components/molecules/layout/factsAndFigures';
import Faqs from '@/components/molecules/layout/faqs';
import Testimonials from '@/components/molecules/layout/testimonials';

export default function Homepage() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-between bg-custom-dark text-white">
            <div className="flex h-full flex-col justify-between">
                <FactsAndFigures />
                <Faqs />
                <Testimonials />
                <Cta />
            </div>
        </main>
    );
}
