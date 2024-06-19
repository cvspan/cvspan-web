import React from 'react';
import { PrimaryFooter, SecondaryFooter } from './components';

function Footer() {
    return (
        <footer>
            <div className="mx-auto w-full max-w-[1200px] pb-24 pt-28">
                <div>
                    <div className="flex flex-col">
                        <PrimaryFooter />
                        <hr className="my-8" />
                        <SecondaryFooter />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
