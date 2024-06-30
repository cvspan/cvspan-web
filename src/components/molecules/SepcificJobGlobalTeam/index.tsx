import React from 'react';
export const SpecificJobGlobalTeam = () => {
    return (
        <div className="bg-[#0c0c0c] py-[120px]">
            <div className="m-auto max-w-[1200px]">
                <div className="grid grid-cols-3 gap-x-6">
                    <div className="col-span-1">
                        <div className="h-full rounded-3xl border-[1px] border-[#272727] bg-[#1a1a1a]">
                            <div className="h-full ps-10 pt-10">
                                <div className="flex h-full flex-col">
                                    <div className="flex -space-x-4">
                                        {Array.from([1, 2, 3, 4, 5], (x) => x).map((item) => (
                                            <div
                                                className="h-[70px] w-[70px] rounded-full border-4 border-[#1a1a1a] bg-[#f4f4f4]"
                                                key={item}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="mb-[41px] mt-auto">
                                        <span className="text-gradient text-[77px] text-white">65+</span>
                                        <div className="font-eudoxus text-2xl font-medium text-white">Team Members</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="back col-span-2 h-[427px] rounded-3xl border-[1px] border-[#272727] bg-[#1a1a1a]">
                        <div className="text-gradient ml-[47px] mt-10 font-eudoxus text-[34px] font-medium leading-[42px] text-white">
                            Global remote team that <br /> operates internationally
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
