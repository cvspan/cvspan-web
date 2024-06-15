import FactCard from '../mini-components/FactCard';
import { Button } from '@/components/ui/button';

const FactsAndFigures = () => {
    return (
        <section className="grid gap-x-6 gap-y-6 md:grid-cols-2">
            <div className="h-150 w-12/12 flex flex-col items-start gap-y-8 rounded-3xl bg-fact-figure bg-cover bg-center bg-no-repeat bg-origin-border p-6">
                <div className="flex flex-col gap-y-4">
                    <h2 className="font-pp-mori-semibold">Facts & Figures</h2>
                    <p className="font-eudoxus">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
                <Button className="flex items-center gap-x-4 rounded-full border border-white bg-transparent px-12 py-8">
                    ABOUT US{' '}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6 18L18 6M18 6H9M18 6V15"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div>
                    <FactCard id={'01'} rate="80%" description="of faster design asset delivery" />
                </div>
                <div>
                    <FactCard id={'02'} rate="$56k" description="Saved on creative production" />
                </div>
                <div>
                    <FactCard id={'03'} rate="+1M" description="Increase in customer base" />
                </div>
                <div>
                    <FactCard id={'04'} rate="+28%" description="Monthly E-commerce visits" />
                </div>
            </div>
        </section>
    );
};

export default FactsAndFigures;
