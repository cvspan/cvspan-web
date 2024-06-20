import Link from 'next/link';
import React from 'react';
const DigitalProduct = ({ item }: { item: number }) => {
    return (
        <div
            className="relative col-span-4 rounded-xl border-[1px] border-transparent bg-[#1a1a1a] p-6 hover:border-[#272727]"
            key={item}
        >
            <div>
                <div className="flex items-center justify-between">
                    <span>
                        <div className="text-2xl font-medium text-white">Product Design</div>
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="fill-current"
                    >
                        <path d="M8 24L24 8M24 8H12M24 8V20" stroke="white" />
                    </svg>
                </div>
                <div className="mt-[60px]">
                    <span className="text-[#767676]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                    </span>
                </div>
            </div>
            <Link
                href="/"
                className="absolute left-0 top-0 z-[100] block h-full w-full overflow-hidden whitespace-nowrap bg-transparent outline-none"
            ></Link>
        </div>
    );
};

const DigitalProductHeader = () => {
    return (
        <div className="min-w-[564px]">
            <span>
                <h2 className="text-5xl font-medium text-white">
                    Digital Products Services <br /> and Solutions We Offer
                </h2>
            </span>
        </div>
    );
};

const DigitalProductList = () => {
    return (
        <div className="pt-[60px]">
            <div>
                <div className="grid grid-cols-12 gap-12">
                    {Array.from([1, 2, 3, 4, 5, 6], (x) => x).map((item: number, i: number) => (
                        <DigitalProduct item={item} key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
export const DigitalProducts = () => {
    return (
        <section>
            <div className="bg-[#0c0c0c]">
                <div className="mx-auto w-full max-w-[1200px] py-[120px]">
                    <DigitalProductHeader />
                    <DigitalProductList />
                </div>
            </div>
        </section>
    );
};
