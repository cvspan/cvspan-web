import React from 'react';
import { PrimaryFooter, SecondaryFooter } from './components';
import { cn } from '@/lib/utils';

function Footer({ showBorderTop }: { showBorderTop?: boolean }) {
    return (
        <footer className={cn('bg-white px-5', showBorderTop ? 'border-t-[1px] border-t-[#D1D1D1]' : '')}>
            <div className="mx-auto w-full max-w-[1200px] pb-24 pt-28">
                <div>
                    <div className="flex flex-col">
                        <PrimaryFooter />
                        <hr className="my-8 md:my-[35px]" />
                        <SecondaryFooter />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
