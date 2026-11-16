'use client';

import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Cta from '@/components/molecules/CTA';
import GlobalTeam from '@/components/molecules/GlobalTeam';
import Footer from '@/components/molecules/layout/footer';
import { OurTeamList } from '@/components/molecules/OurTeam/OurTeamList';
import type { Team } from '@/components/molecules/OurTeam/types';

const HeroHeader = () => {
    return (
        <div className="mx-auto max-w-[1132px]">
            {/* Page's primary heading — was a plain div, leaving the page with no <h1>. */}
            <h1 className="text-center font-pp-mori text-6xl font-medium leading-[64px] text-[#1a1a1a]">
                We have a wealth of skills and experience from diverse backgrounds.
            </h1>
            <div className="mt-6">
                <div className="mx-auto max-w-[510px]">
                    <div className="text-center font-eudoxus text-lg font-normal leading-[26px] text-[#484848]">
                        Our philosophy is simple; hire great people and give them the resources and support to do
                        awesome work.
                    </div>
                </div>
            </div>
        </div>
    );
};
const Hero = ({ team }: { team: Team[] }) => {
    return (
        <div className="relative box-border overflow-hidden">
            <div className="absolute -left-[103px] -top-[70px] h-[398px] w-[398px] rounded-[398px] bg-[#1a1aff] opacity-20 blur-[150px]" />

            <div className="absolute -right-[79px] top-[163px] h-[398px] w-[398px] rounded-[398px] bg-[#00ffb2] opacity-20 blur-[150px]" />
            <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-28">
                <HeroHeader />
                <OurTeamList teams={team} />
            </div>
        </div>
    );
};
export default function TeamPage({ team }: { team: Team[] }) {
    return (
        <>
            <Navbar light={true} />
            <Hero team={team} />
            <GlobalTeam />
            <Cta />
            <Footer />
        </>
    );
}
