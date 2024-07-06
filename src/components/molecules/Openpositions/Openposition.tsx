'use client'
import React, {useState} from 'react';
import Image from 'next/image';
import arrow from '../../../../public/assets/images/Arrow Right Up.png';

type Props = {};

const Openposition = (props: Props) => {
    const [selected, setSelected] = useState<string>('All');

    const buttons: string[] = [
        'All',
        'Design',
        'Development',
        'Marketing',
        'Business Development',
        'Product',
    ];

    return (
        <div className="mx-auto w-[1200px] space-y-[60px] py-[120px]">
            <div className="space-y-6">
                <p className="font-eudoxus text-[16px] font-normal leading-[24px] text-[#1a1a1a]">
                    Filter by departments
                </p>
                <div className="flex gap-3">
            <div className="flex gap-4">
                {buttons.map((button) => (
                    <button
                        key={button}
                        className={`border-[1px] px-8 py-4 font-eudoxus text-[16px] font-medium leading-[24px] rounded-full ${
                            selected === button ? 'bg-[#0c0c0c] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setSelected(button)}
                    >
                        {button}
                    </button>
                ))}
            </div>
        </div>
            </div>
            <div className="flex items-start gap-6 border-t-[1px] border-[#a3a3a3]">
                <div className="w-[384px] space-y-6 p-10">
                    <h4 className="font-eudoxus text-[34px] font-normal leading-[42px]">Open Positions</h4>
                    <p className="font-eudoxus text-[16px] font-normal leading-[24px]">
                        Let's write some beautiful code and make smart designs. This is what we're crazy about, and
                        we're looking for the ones who feel the same.
                    </p>
                </div>
                <div className="">
                    <div className="flex w-[729px] items-start justify-between py-10">
                        <div className="space-y-3">
                            <h3 className="font-eudoxus text-[48px] font-normal leading-[56px]">Project manager</h3>

                            <div className="flex items-center gap-x-[11px]">
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    English
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Senior
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    2 Years Experience
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Nigeria or Remote
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <Image src={arrow} alt="arrow" className="h-[40px] w-[40px]" />
                        </div>
                    </div>
                    <div className="flex w-[729px] items-start justify-between border-t-[1px] border-[#1a1a1a] py-10">
                        <div className="space-y-3">
                            <h3 className="font-eudoxus text-[48px] font-normal leading-[56px]">
                                Senior React Developer
                            </h3>

                            <div className="flex items-center gap-x-[11px]">
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    English
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Senior
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    2 Years Experience
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Nigeria or Remote
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <Image src={arrow} alt="arrow" className="h-[40px] w-[40px]" />
                        </div>
                    </div>
                    <div className="flex w-[729px] items-start justify-between border-t-[1px] border-[#1a1a1a] py-10">
                        <div className="space-y-3">
                            <h3 className="font-eudoxus text-[48px] font-normal leading-[56px]">
                                Technical Consultant
                            </h3>

                            <div className="flex items-center gap-x-[11px]">
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    English
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Senior
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    2 Years Experience
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Nigeria or Remote
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <Image src={arrow} alt="arrow" className="h-[40px] w-[40px]" />
                        </div>
                    </div>
                    <div className="flex w-[729px] items-start justify-between border-t-[1px] border-[#1a1a1a] py-10">
                        <div className="space-y-3">
                            <h3 className="font-eudoxus text-[48px] font-normal leading-[56px]">
                                Lead Node.js Developerr
                            </h3>

                            <div className="flex items-center gap-x-[11px]">
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    English
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Senior
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    2 Years Experience
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Nigeria or Remote
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <Image src={arrow} alt="arrow" className="h-[40px] w-[40px]" />
                        </div>
                    </div>
                    <div className="flex w-[729px] items-start justify-between border-t-[1px] border-[#1a1a1a] py-10">
                        <div className="space-y-3">
                            <h3 className="font-eudoxus text-[48px] font-normal leading-[56px]">Design Consultant</h3>

                            <div className="flex items-center gap-x-[11px]">
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    English
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Senior
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    2 Years Experience
                                </p>
                                <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                    Nigeria or Remote
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <Image src={arrow} alt="arrow" className="h-[40px] w-[40px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Openposition;
