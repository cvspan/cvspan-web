'use client';

import React, { useEffect, useState } from 'react';
import CustomCountUp from '@/components/molecules/CustomCountUp';
import { TEAMS } from '@/components/ui/data';
import Globe from './Globe';

const AVATAR_COUNT = 5;

/** Fisher-Yates, on a copy so the source array is left alone. */
function shuffle<T>(arr: T[]): T[] {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

const GlobalTeam = () => {
    // This card used to shuffle during render. That runs on the server and again
    // in the browser, which picked different people each time and made React
    // throw away the server markup with a hydration warning. Render a fixed
    // slice first so both passes agree, then shuffle once the page is mounted.
    const [fiveRandomTeamMembers, setFiveRandomTeamMembers] = useState(() => TEAMS.slice(0, AVATAR_COUNT));

    useEffect(() => {
        setFiveRandomTeamMembers(shuffle(TEAMS).slice(0, AVATAR_COUNT));
    }, []);

    return (
        <div className="bg-[#0c0c0c] px-5 py-[120px]">
            <div className="m-auto max-w-[1200px]">
                <div className="grid grid-cols-3 gap-5 lg:gap-6">
                    <div className="col-span-3 lg:col-span-1">
                        <div className="h-full overflow-hidden rounded-xl border-[1px] border-[#272727] bg-[#1a1a1a]">
                            <div className="h-full ps-6 pt-6 lg:ps-10 lg:pt-10">
                                <div className="flex h-full flex-col">
                                    <div className="flex -space-x-4">
                                        {fiveRandomTeamMembers.map((item) => (
                                            <div
                                                className="h-[70px] w-[70px] overflow-hidden rounded-full border-4 border-[#1a1a1a] bg-[#f4f4f4]"
                                                key={item?.id}
                                            >
                                                {!item?.avatar ? null : (
                                                    <img
                                                        src={item?.avatar}
                                                        className="h-full w-full"
                                                        alt=""
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                )}
                                            </div>
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
                    <div className="back relative col-span-3 max-h-[427px] min-h-[427px] overflow-hidden rounded-xl border-[1px] border-[#272727] bg-[#1a1a1a] lg:col-span-2">
                        {/* Placed where the original artwork's sphere sat: radius 292px,
                            centred 184px in from the right edge and 421px down. cobe draws
                            the sphere at 0.8 of the canvas half width and keeps the rest for
                            the glow, so the box is 2 * 292 / 0.8 = 730px. */}
                        <Globe className="inset-auto right-[-337px] top-[72px] h-[652px] w-[652px] max-w-none lg:right-[-181px] lg:top-[56px] lg:h-[730px] lg:w-[730px]" />

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
