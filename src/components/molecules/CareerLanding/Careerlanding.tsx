import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Brands from './Brands';
import Button from '../Button';
import Link from 'next/link';
type Props = {};

const Careerlanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#050505]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="px-auto flex w-[335px] flex-col items-center justify-center space-y-6 lg:w-[1012px]">
                    <h1 className="text-center font-pp-mori text-[48px] font-medium leading-[56px] text-white lg:w-[1012px] lg:text-[96px] lg:font-[600] lg:leading-[103.68px]">
                        Careers & <br /> Vacancies
                    </h1>
                    <p className="text-center font-eudoxus text-[16px] font-[400] leading-[24px] text-white lg:w-[615px] lg:text-[18px] lg:leading-[26px]">
                        We are pioneering the future of work, working together to bring creativity to another scale. We
                        are a supportive and diverse community of people that are kind, truth seeking, and authentic
                    </p>
                    <div className="w-full lg:w-[136px]">
                        <Link href="/careers/open-position">
                            <Button title="JOIN US" fullWidth height="56px" />
                        </Link>
                    </div>
                </div>
                {/* <div className="absolute bottom-12">
                    <Brands />
                </div> */}
            </div>
        </div>
    );
};

export default Careerlanding;
