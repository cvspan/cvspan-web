'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import { ANIMATE_PROPS } from '@/helpers/motion';

import { LegalBlock, LegalDocument } from './types';

/**
 * Shared layout for the privacy, cookie and terms pages.
 *
 * One centred column carries the title and the body at the same width, so the
 * page reads as a document instead of leaving a lopsided gap beside the text.
 * 760px keeps lines near the comfortable reading measure at 16px.
 */

const Block = ({ block }: { block: LegalBlock }) => {
    if (block.type === 'subheading') {
        return (
            <motion.h3
                {...ANIMATE_PROPS()}
                className="pt-2 font-eudoxus text-[18px] font-[600] leading-[28px] text-[#1A1A1A]"
            >
                {block.text}
            </motion.h3>
        );
    }

    if (block.type === 'list') {
        return (
            <motion.ul {...ANIMATE_PROPS()} className="ml-5 list-disc space-y-[10px]">
                {block.items.map((item, index) => (
                    <li key={index} className="pl-1 text-[16px] font-normal leading-[26px] text-[#484848]">
                        {item}
                    </li>
                ))}
            </motion.ul>
        );
    }

    return (
        <motion.p {...ANIMATE_PROPS()} className="text-[16px] font-normal leading-[26px] text-[#484848]">
            {block.text}
        </motion.p>
    );
};

const LegalPage = ({ document }: { document: LegalDocument }) => {
    return (
        <>
            <Navbar light showScrollWatcher />

            <main className="mx-auto w-full max-w-[760px] px-5 pb-[120px] pt-[120px]">
                <motion.h1
                    {...ANIMATE_PROPS()}
                    className="font-pp-mori text-[34px] font-[500] leading-[42px] text-[#1A1A1A] lg:text-[64px] lg:font-semibold lg:leading-[72px]"
                >
                    {document.title}
                </motion.h1>

                <motion.p {...ANIMATE_PROPS()} className="mt-5 text-[14px] font-normal leading-[22px] text-[#767676]">
                    {document.updated}
                </motion.p>

                <div className="mt-10 space-y-[18px]">
                    {document.intro.map((block, index) => (
                        <Block key={index} block={block} />
                    ))}
                </div>

                <div className="mt-[56px] space-y-[48px]">
                    {document.sections.map((section, index) => (
                        <section key={index} className="space-y-[18px]">
                            <motion.h2
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px] text-[#1A1A1A]"
                            >
                                {`${index + 1}. ${section.heading}`}
                            </motion.h2>

                            {section.blocks.map((block, blockIndex) => (
                                <Block key={blockIndex} block={block} />
                            ))}
                        </section>
                    ))}
                </div>
            </main>

            <Cta />
            <Footer />
        </>
    );
};

export default LegalPage;
