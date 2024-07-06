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
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <h1 className="w-[1012px] text-center font-pp-mori text-[96px] font-[600] leading-[103.68px] text-white">
                    Careers & <br /> Vacancies
                </h1>
                <p className="w-[615px] text-center font-eudoxus text-[18px] leading-[26px] text-white">
                    We are pioneering the future of work, working together to bring creativity to another scale. We are
                    a supportive and diverse community of people that are kind, truth seeking, and authentic
                </p>
                <div>
                    <Link href="/careers/open-position">
                        <Button title="JOIN US" />
                    </Link>
                </div>
                <div className="absolute bottom-12">
                    <Brands />
                </div>
            </div>
        </div>
    );
};

export default Careerlanding;
