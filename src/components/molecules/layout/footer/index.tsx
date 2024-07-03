import React from 'react';
import { PrimaryFooter, SecondaryFooter } from './components';

function Footer() {
    return (
        <footer className="bg-white">
            <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-28">
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
