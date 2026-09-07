'use client';

import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
import Cta from '@/components/molecules/CTA';
import { Team } from '@/components/molecules/OurTeam/types';

interface SocialLink {
    key: string;
    imageUrlInActive: string;
    imageUrlActive: string;
}

const socials: SocialLink[] = [
    {
        key: 'facebook',
        imageUrlInActive: '/assets/icons/facebook-light.svg',
        imageUrlActive: '/assets/icons/facebook-blue.svg',
    },
    {
        key: 'twitter',
        imageUrlInActive: '/assets/icons/twitter-light.svg',
        imageUrlActive: '/assets/icons/twitter-blue.svg',
    },
    {
        key: 'instagram',
        imageUrlInActive: '/assets/icons/instagram-light.svg',
        imageUrlActive: '/assets/icons/instagram-blue.svg',
    },
    {
        key: 'linkedin',
        imageUrlInActive: '/assets/icons/linkedin-light.svg',
        imageUrlActive: '/assets/icons/linkedin-blue.svg',
    },
    {
        key: 'youtube',
        imageUrlInActive: '/assets/icons/youtube-light.svg',
        imageUrlActive: '/assets/icons/youtube-blue.svg',
    },
];

const EmployeeProfile = ({ team }: { team: Team | undefined }) => {
    return (
        <>
            <div className="mt-[60px] bg-white lg:mt-[100px]">
                <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-28">
                    <div className="grid-cols-3 md:grid md:space-x-[78px]">
                        <div className="col-span-1">
                            <div className="aspect-[16/9] bg-[#fafafa]">
                                <div className="relative flex flex-shrink-0 flex-grow justify-center">
                                    <img
                                        src={team?.avatar}
                                        alt={team?.name ? `${team.name}, ${team?.role ?? 'CVSpan team member'}` : ''}
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="font-eudoxus text-base font-normal text-[#a3a3a3]">Connect</div>
                            </div>
                            <div className="mt-4 flex items-center gap-[12px]">
                                {socials.map((item) => {
                                    return (
                                        <button
                                            key={item?.key}
                                            type="button"
                                            aria-label={`${team?.name ?? 'Team member'} on ${item?.key}`}
                                            className="group relative h-[32px] w-[32px]"
                                        >
                                            {/* Decorative: the button already carries the accessible name. */}
                                            <img
                                                src={item?.imageUrlInActive}
                                                alt=""
                                                className="absolute left-0 top-0 h-full w-full transition-all duration-100 ease-in-out group-hover:scale-0"
                                            />

                                            <img
                                                src={item?.imageUrlActive}
                                                alt=""
                                                className="absolute left-0 top-0 h-full w-full scale-0 transition-all duration-100 ease-in-out group-hover:scale-100"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="col-span-2 mt-[32px] md:mt-0">
                            <div>
                                <span>
                                    <h1 className="font-pp-mori text-6xl font-semibold leading-[60px]">{team?.name}</h1>
                                    <div>
                                        <span className="font-eudoxus text-2xl font-medium text-[#a3a3a3]">
                                            {team?.role}
                                        </span>
                                    </div>
                                </span>
                                <div className="my-[25px] h-px w-full bg-[#f4f4f4]" />
                                {Array.isArray(team?.bio)
                                    ? team.bio.map((bio, index) => {
                                          return (
                                              <div
                                                  key={index}
                                                  className="mb-[25px] font-eudoxus text-lg font-normal leading-[26px] text-[#1a1a1a]"
                                              >
                                                  {bio}
                                              </div>
                                          );
                                      })
                                    : undefined}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function EmployeePage({ team }: { team: Team | undefined }) {
    return (
        <>
            <Navbar light={true} showScrollWatcher />
            <EmployeeProfile team={team} />
            <Cta />
            <Footer />
        </>
    );
}
