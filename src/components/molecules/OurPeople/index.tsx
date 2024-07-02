import React from 'react';
import Image from 'next/image';

import { ourPeople1, ourPeople2, ourPeople3, ourPeople4 } from '@/components/exports/images';

export const OurPeople = () => {
    return (
        <div className="py-[60px] lg:py-[120px]">
            <div className="m-auto max-w-[1200px] px-5">
                <div className="grid grid-cols-3 gap-3 lg:gap-6">
                    <div className="col-span-3 lg:col-span-1">
                        <h2 className="font-eudoxus text-base font-medium leading-6 lg:text-5xl lg:leading-[56px]">
                            Our People
                        </h2>
                    </div>
                    <div className="col-span-3 lg:col-span-2">
                        <div>
                            <div className="font-eudoxus text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:font-pp-mori lg:text-[60px] lg:leading-[64px]">
                                Be part of an international community
                            </div>
                        </div>
                        <div className="my-8">
                            <div className="font-eudoxus text-base font-normal leading-6 text-[#484848] lg:text-lg lg:leading-[26px]">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
                                amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                                labore et dolore magnam aliquam quaerat voluptatem.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-2 md:gap-6">
                            <div className="col-span-1 row-span-2">
                                <figure className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-xl">
                                    <div className="absolute inset-0 h-full rounded-xl">
                                        <Image
                                            src={ourPeople1}
                                            className="absolute inset-0 block h-full w-full rounded-xl object-cover"
                                            alt="Two People"
                                            sizes="100vw"
                                            fill
                                        />
                                    </div>
                                </figure>
                            </div>
                            <div className="col-span-1 row-span-1">
                                <div className="flex h-full gap-x-6">
                                    <figure className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-xl">
                                        <div className="absolute inset-0 h-full">
                                            <Image
                                                src={ourPeople2}
                                                className="absolute inset-0 block h-full w-full object-cover"
                                                alt="Two People"
                                                sizes="100vw"
                                                fill
                                            />
                                        </div>
                                    </figure>
                                    <figure className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-xl">
                                        <div className="absolute inset-0 h-full">
                                            <Image
                                                src={ourPeople3}
                                                className="absolute inset-0 block h-full w-full object-cover"
                                                alt="Two People"
                                                sizes="100vw"
                                                fill
                                            />
                                        </div>
                                    </figure>
                                </div>
                            </div>
                            <div className="col-span-1 row-span-1">
                                <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                                    <div className="absolute inset-0 h-full rounded-xl">
                                        <Image
                                            src={ourPeople4}
                                            className="absolute inset-0 block h-full w-full rounded-xl object-cover"
                                            alt="Two People"
                                            sizes="100vw"
                                            fill
                                        />
                                    </div>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
