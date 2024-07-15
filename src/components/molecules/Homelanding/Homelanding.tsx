import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Ribbon from '../../../../public/Ribbon-2.png';
import Button from '../Button';

type Props = {};

const Homelanding = (props: Props) => {
    return (
        <div className="relative h-[100vh] w-full bg-[#0c0c0c] px-5 sm:h-[820px]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full items-center justify-center">
                <div className="relative flex h-full w-full max-w-[1200px] justify-center sm:items-center lg:justify-start">
                    <div className="mt-[130px] w-full max-w-[941px] sm:mt-0">
                        <h1 className="m-0 mx-auto text-center font-pp-mori text-[67px] font-[100] leading-[72px] text-white sm:text-[90px] sm:leading-[99.6px] md:text-left lg:text-[120px] lg:leading-[129.6px]">
                            We{' '}
                            <span className="font-semibold">
                                Create <br /> Awesome
                            </span>{' '}
                            Stuff
                        </h1>
                        <p className="font-Exodus m-0 mx-auto mb-[32px] max-w-[660px] p-0 text-center text-[16px] font-normal leading-[24px] text-white md:mx-0 md:text-left lg:text-[18px] lg:leading-[26px]">
                            Our experts accompany our Clients from the private and public sector in their digital
                            transformation journey by providing business value solutions
                        </p>
                        <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center gap-x-[24px] gap-y-[16px] sm:flex-row md:mx-0 md:justify-start">
                            <Button background="white" title="OUR SERVICES" height="56px" fullWidth />
                            <Button background="transparent" title="GET STARTED" height="56px" fullWidth />
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-0 w-[450px] rotate-[21.43] overflow-hidden lg:w-[959.12px]">
                        <Image src={Ribbon} alt="elipse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homelanding;
