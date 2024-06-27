import React from 'react';
import Image from 'next/image';
import { arrowUp, userOnBike } from '@/components/exports/images';
import Button from '@/components/molecules/Button';

const OurVisionAndMission = () => {
    return (
        <div className="p-[120px]">
            <div className="m-auto max-w-[1220px]">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 rounded-3xl bg-[#f5f5f5]">
                        <div className="ml-[40.5px] grid grid-cols-3">
                            <div className="col-span-1 my-10 flex flex-col">
                                <div className="w-[385px] font-pp-mori text-6xl font-semibold leading-[64px] text-[#1a1a1a]">
                                    Our Vision <br />
                                    and Mission
                                </div>

                                <div className="mt-auto">
                                    <Button title="SEE JOB OPENINGS" leftIcon={arrowUp} />
                                </div>
                            </div>

                            <figure className="relative col-span-2 aspect-[3/2] w-full place-self-stretch overflow-hidden">
                                <div className="absolute inset-0 h-full">
                                    <Image
                                        src={userOnBike}
                                        className="obejct-cover absolute inset-0 block h-full w-full"
                                        alt="User on bike"
                                        sizes="100vw"
                                        fill
                                    />
                                </div>
                            </figure>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="rounded-3xl bg-[#f5f5f5]">
                            <div className="p-10">
                                <div className="text-[34px] font-medium leading-[42px] text-[#1a1a1a]">
                                    CVSpan’s Vision is to create more equal opportunities globally, by accelerating the
                                    world’s transition to online work.
                                </div>
                                <div className="mt-6">
                                    <span className="text-lg font-normal leading-[26px] text-[#484848]">
                                        We believe online work is the greatest equalizer in the 21st century - unlocking
                                        the globalization of services and democratizing opportunities for both talent
                                        and companies.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="h-full rounded-3xl bg-[#f5f5f5]">
                            <div className="p-10">
                                <div className="text-[34px] font-medium leading-[42px] text-[#1a1a1a]">
                                    CVSpan’s Mission is to build the best creative service in the world.
                                </div>
                                <div className="mt-6">
                                    <span className="text-lg font-normal leading-[26px] text-[#484848]">
                                        To create more equal opportunities globally, we believe creativity is an
                                        excellent place to start. It is not constrained by language, we are all
                                        increasingly part of the same global monoculture.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CareersPage() {
    return (
        <>
            <OurVisionAndMission />
        </>
    );
}
