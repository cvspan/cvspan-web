'use client';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import {
    iconWhite1,
    iconWhite2,
    iconWhite3,
    iconWhite4,
    iconWhite5,
    iconWhite6,
    iconWhite7,
    iconWhite8,
} from '@/components/exports/images';

interface Brand {
    id: number;
    name: string;
    logo: StaticImageData;
}

const brands: Brand[] = [
    { id: 1, name: 'Brand 1', logo: iconWhite1 },
    { id: 2, name: 'Brand 2', logo: iconWhite2 },
    { id: 3, name: 'Brand 3', logo: iconWhite3 },
    { id: 4, name: 'Brand 4', logo: iconWhite4 },
    { id: 5, name: 'Brand 5', logo: iconWhite5 },
    { id: 6, name: 'Brand 6', logo: iconWhite6 },
    { id: 7, name: 'Brand 7', logo: iconWhite7 },
    { id: 8, name: 'Brand 8', logo: iconWhite8 },
];

const Featured = () => {
    return (
        <div className="">
            <h3 className="text-center font-eudoxus text-[16px] font-medium leading-[24px] text-gray-600">
                FEATURED IN
            </h3>
            <div className="relative mt-[1rem] w-[1125px] overflow-hidden py-2">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, #0c0c0c , rgba(255, 255, 255, 0), #0c0c0c)',
                    }}
                ></div>
                <div className="">
                    <Marquee speed={50}>
                        <div className="flex items-center justify-between">
                            {brands.map((brand) => (
                                <div key={brand.id} className="mx-[24px]">
                                    <Image src={brand.logo} alt={brand.name} />
                                </div>
                            ))}
                        </div>
                    </Marquee>
                </div>
            </div>
        </div>
    );
};

export default Featured;
