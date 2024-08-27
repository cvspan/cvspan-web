'use client';
import { cn } from '@/lib/utils';
import React from 'react';

import Marquee from 'react-fast-marquee';

interface Brand {
    id: number;
    name: string;
    logo: string;
    logoDark: string;
}

const brands: Brand[] = [
    {
        id: 1,
        name: 'Brand 1',
        logo: '/assets/images/clients/amazon.svg',
        logoDark: '/assets/images/clients/amazon-dark.svg',
    },
    {
        id: 2,
        name: 'Brand 2',
        logo: '/assets/images/clients/coinbase.svg',
        logoDark: '/assets/images/clients/coinbase-dark.svg',
    },
    {
        id: 3,
        name: 'Brand 3',
        logo: '/assets/images/clients/google.svg',
        logoDark: '/assets/images/clients/google-dark.svg',
    },
    {
        id: 4,
        name: 'Brand 4',
        logo: '/assets/images/clients/kellogs.svg',
        logoDark: '/assets/images/clients/kellogs-dark.svg',
    },
    {
        id: 5,
        name: 'Brand 5',
        logo: '/assets/images/clients/meta.svg',
        logoDark: '/assets/images/clients/meta-dark.svg',
    },
    {
        id: 6,
        name: 'Brand 6',
        logo: '/assets/images/clients/reddit.svg',
        logoDark: '/assets/images/clients/reddit-dark.svg',
    },
    {
        id: 7,
        name: 'Brand 7',
        logo: '/assets/images/clients/shopify.svg',
        logoDark: '/assets/images/clients/shopify-dark.svg',
    },
    {
        id: 8,
        name: 'Brand 8',
        logo: '/assets/images/clients/webflow.svg',
        logoDark: '/assets/images/clients/webflow-dark.svg',
    },
];

const Clients = ({ darkMode = false, containerClassName }: { darkMode?: boolean; containerClassName: string }) => {
    return (
        <div
            className={cn(
                'relative mx-auto w-full max-w-[1200px] overflow-hidden py-[50px] md:py-[120px]',
                containerClassName,
            )}
        >
            <div className="relative mx-auto w-full max-w-[1200px]">
                <div
                    className={`absolute left-0 top-0 z-[133] hidden h-full w-[450px] bg-gradient-to-r ${darkMode ? 'from-[#0C0C0C]' : 'from-[#ffffff]'} md:block`}
                />
                <div
                    className={`absolute right-0 top-0 z-[133] hidden h-full w-[450px] bg-gradient-to-l ${darkMode ? 'from-[#0C0C0C]' : 'from-[#ffffff]'} md:block`}
                />

                <Marquee speed={50}>
                    <div className="flex items-center justify-between">
                        {brands.map((brand) => (
                            <div key={brand.id} className="mx-[24px]">
                                <img
                                    src={darkMode ? brand?.logoDark : brand.logo}
                                    alt={brand.name}
                                    className="w-[80px] md:w-[106px]"
                                />
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>
        </div>
    );
};

export default Clients;
