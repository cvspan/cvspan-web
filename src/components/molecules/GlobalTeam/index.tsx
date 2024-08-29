import React from 'react';
import CustomCountUp from '@/components/molecules/CustomCountUp';

const GlobalTeam = () => {
    return (
        <div className="bg-[#0c0c0c] px-5 py-[120px]">
            <div className="m-auto max-w-[1200px]">
                <div className="grid grid-cols-3 gap-5 lg:gap-6">
                    <div className="col-span-3 lg:col-span-1">
                        <div className="h-full overflow-hidden rounded-3xl border-[1px] border-[#272727] bg-[#1a1a1a]">
                            <div className="h-full ps-6 pt-6 lg:ps-10 lg:pt-10">
                                <div className="flex h-full flex-col">
                                    <div className="flex -space-x-4">
                                        {Array.from([1, 2, 3, 4, 5], (x) => x).map((item) => (
                                            <div
                                                className="h-[70px] w-[70px] overflow-hidden rounded-full border-4 border-[#1a1a1a] bg-[#f4f4f4]"
                                                key={item}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="mb-[22px] mt-[88px] lg:mb-[41px] lg:mt-auto">
                                        <span className="text-gradient font-pp-mori text-[60px] leading-[64px] text-white lg:text-[77px] lg:leading-[83.16px]">
                                            <CustomCountUp end={65} duration={3} />+
                                        </span>
                                        <div className="font-eudoxus text-2xl font-medium text-white">Team Members</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="back relative col-span-3 max-h-[427px] min-h-[427px] overflow-hidden rounded-3xl border-[1px] border-[#272727] bg-[#1a1a1a] lg:col-span-2">
                        <img
                            src="/assets/images/univers_cta_bg.webp"
                            className="absolute left-0 top-0 h-full w-full object-cover"
                        />

                        <div className="text-gradient relative z-10 ps-6 pt-6 font-eudoxus text-2xl font-medium leading-8 text-white lg:pl-[47px] lg:pt-10 lg:text-[34px] lg:leading-[42px]">
                            Global remote team that <br /> operates internationally
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalTeam;
