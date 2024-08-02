'use client';
import React from 'react';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import { icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8 } from '@/components/exports/images';
import Marquee from 'react-fast-marquee';

interface Brand {
    id: number;
    name: string;
    logo: StaticImageData;
}

const brands: Brand[] = [
    { id: 1, name: 'Brand 1', logo: icon1 },
    { id: 2, name: 'Brand 2', logo: icon2 },
    { id: 3, name: 'Brand 3', logo: icon3 },
    { id: 4, name: 'Brand 4', logo: icon4 },
    { id: 5, name: 'Brand 5', logo: icon5 },
    { id: 6, name: 'Brand 6', logo: icon6 },
    { id: 7, name: 'Brand 7', logo: icon7 },
    { id: 8, name: 'Brand 8', logo: icon8 },
];

const Clients: React.FC = () => {
    return (
        <div className="relative w-full overflow-hidden py-[50px] md:py-[120px]">
            <div className="mx-auto w-full max-w-[1200px]">
                <Marquee speed={50}>
                    <div className="flex items-center justify-between">
                        {brands.map((brand) => (
                            <div key={brand.id} className="mx-[24px]">
                                <Image src={brand.logo} alt={brand.name} className="w-[80px] md:w-[106px]" />
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>
        </div>
    );
};

export default Clients;
