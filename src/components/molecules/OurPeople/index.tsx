import React from 'react';
import Image from 'next/image';

import { ourPeople1, ourPeople2, ourPeople3, ourPeople4 } from '@/components/exports/images';

export const OurPeople = () => {
    return (
        <div className="py-[120px]">
            <div className="m-auto max-w-[1200px]">
                <div className="grid grid-cols-3 gap-x-6">
                    <div className="col-span-1">
                        <h2 className="text-5xl font-medium leading-[56px]">Our People</h2>
                    </div>
                    <div className="col-span-2">
                        <div>
                            <div className="font-pp-mori text-[64px] font-semibold leading-[60px] text-[#1a1a1a]">
                                Be part of an international community
                            </div>
                        </div>
                        <div className="my-8">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem.
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-1 row-span-2">
                                <figure className="relative col-span-2 aspect-[4/3] h-full w-full place-self-stretch overflow-hidden">
                                    <div className="absolute inset-0 h-full">
                                        <Image
                                            src={ourPeople1}
                                            className="obejct-contain absolute inset-0 block h-full w-full"
                                            alt="Two People"
                                            sizes="100vw"
                                            fill
                                        />
                                    </div>
                                </figure>
                            </div>
                            <div className="col-span-1">
                                <div className="flex gap-x-6">
                                    <figure className="relative col-span-2 aspect-[4/3] w-full place-self-stretch overflow-hidden">
                                        <div className="absolute inset-0 h-full">
                                            <Image
                                                src={ourPeople2}
                                                className="obejct-cover absolute inset-0 block h-full w-full"
                                                alt="Two People"
                                                sizes="100vw"
                                                fill
                                            />
                                        </div>
                                    </figure>
                                    <figure className="relative col-span-2 aspect-[4/3] w-full place-self-stretch overflow-hidden">
                                        <div className="absolute inset-0 h-full">
                                            <Image
                                                src={ourPeople3}
                                                className="obejct-cover absolute inset-0 block h-full w-full"
                                                alt="Two People"
                                                sizes="100vw"
                                                fill
                                            />
                                        </div>
                                    </figure>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <figure className="relative col-span-2 aspect-[4/3] w-full place-self-stretch overflow-hidden">
                                    <div className="absolute inset-0 h-full">
                                        <Image
                                            src={ourPeople4}
                                            className="obejct-cover absolute inset-0 block h-full w-full"
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
