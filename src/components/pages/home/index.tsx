import FactsAndFigures from '@/components/molecules/layout/factsAndFigures';
import Faqs from '@/components/molecules/layout/faqs';

export default function Homepage() {
    return (
        <main className="bg-custom-dark m-auto flex min-h-screen flex-col items-center justify-between p-6 text-white">
            <div className="flex size-fit h-full max-w-7xl flex-col justify-between gap-y-20">
                <div>
                    <FactsAndFigures />
                </div>
                <div>
                    <Faqs />
                </div>
            </div>
        </main>
    );
}
