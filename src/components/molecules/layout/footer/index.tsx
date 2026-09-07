import React from 'react';
import { PrimaryFooter, SecondaryFooter } from './components';
import { cn } from '@/lib/utils';

function Footer({ showBorderTop }: { showBorderTop?: boolean }) {
    return (
        <footer className={cn('bg-white px-5', showBorderTop ? 'border-t-[1px] border-t-[#D1D1D1]' : '')}>
            <div className="mx-auto w-full max-w-[1200px] pb-8 pt-20">
                <div>
                    <div className="flex flex-col">
                        <PrimaryFooter />
                        <hr className="mb-8 mt-20" />
                        <SecondaryFooter />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
