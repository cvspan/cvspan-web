import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const GraphicDesigner = () => {
    const parentRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsAtBottom(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 1.0,
            },
        );
        if (parentRef.current) {
            const target = parentRef.current.lastElementChild;
            if (target) observer.observe(target);

            return () => observer.disconnect();
        }
    }, []);

    return (
        <>
            <section className="py-[60px] lg:py-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] px-[16px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0, from: 'left' })}
                        className="hidden h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:flex lg:h-[264px] lg:max-w-[200px]"
                    >
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfeR7_HdqxTtLij4rGNxYGhqYliTW0_cGvmZQ2jpEp6eRr-mQ/viewform">
                            <Button
                                fullWidth
                                height="56px"
                                title="APPLY HERE"
                                rightIcon={'/assets/images/arrowUp.svg'}
                                animateRightIconOnHover
                                rightIconSize="24px"
                            />
                        </Link>
                    </motion.div>
                    <div className="ml-auto w-full pt-[60px] lg:max-w-[800px] lg:pt-0">
                        <div className="flex flex-col gap-[20px]">
                            <div className="mb-[32px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-3 font-pp-mori text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:text-[60px] lg:leading-[64px]"
                                >
                                    Graphic Designer (Intern)
                                </motion.div>
                                <motion.span
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]"
                                >
                                    Design
                                </motion.span>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    About Us
                                </motion.div>
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-base font-normal text-[#484848]"
                                >
                                    CVSpan is a Creative as a Service (CaaS) agency dedicated to delivering exceptional
                                    design solutions for a wide range of clients. We focus on fostering creativity,
                                    collaboration, and innovation to help brands communicate their vision. As a growing
                                    creative agency, we’re excited to offer a dynamic internship opportunity for
                                    aspiring graphic designers to gain hands-on experience in a professional setting.
                                </motion.div>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    Position Overview
                                </motion.div>
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-base font-normal text-[#484848]"
                                >
                                    We are looking for a talented Graphic Design Intern to join our team. This role
                                    involves working closely with our creative and marketing teams to create engaging
                                    visuals that align with our clients’ branding and campaign goals. You will have the
                                    opportunity to work on real projects, from concept to execution, while building a
                                    portfolio and refining your skills in a supportive, fast-paced environment.
                                </motion.div>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    Responsibilities
                                </motion.div>
                                <ul className="ml-3 list-outside list-disc space-y-4 pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Visual Design:</b> Assist in creating high-quality visuals for a variety of
                                        mediums, including social media, web, email, and print. Projects may include
                                        creating social media posts, website banners, presentations, and promotional
                                        materials.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Brand Alignment:</b> Work with team members to ensure all design work is
                                        on-brand and maintains a consistent look and feel. Adhere to brand guidelines
                                        and incorporate feedback from clients and stakeholders.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Concept Development:</b> Contribute ideas and concepts to brainstorming
                                        sessions. Work on initial drafts and present design options for team review.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>File Management & Organization:</b> Maintain organized design files, ensuring
                                        all assets are labeled and stored correctly for easy access and collaboration.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Research & Inspiration Gathering:</b> Stay up-to-date on design trends,
                                        particularly in the digital and creative spaces, and bring fresh ideas to the
                                        team that align with current aesthetics and industry standards.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Feedback Incorporation:</b> Collaborate with senior designers and other team
                                        members to receive constructive feedback and iterate on designs to meet project
                                        goals.
                                    </motion.li>
                                </ul>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    Requirements
                                </motion.div>

                                <ul className="ml-3 list-outside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Current student or recent graduate in Graphic Design, Visual Arts, or a related
                                        field.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Proficiency in design tools such as Adobe Creative Suite (Photoshop,
                                        Illustrator, InDesign) or similar.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Strong understanding of design principles, typography, color theory, and layout.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Ability to work on multiple projects simultaneously and meet deadlines.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Excellent communication skills and a willingness to learn and adapt.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Enthusiasm for creativity and design, with a desire to stay on top of industry
                                        trends.
                                    </motion.li>
                                </ul>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    Preferred Qualifications
                                </motion.div>

                                <ul className="ml-3 list-outside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with additional design tools (e.g., Canva, Figma).
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Basic knowledge of video editing or animation tools (e.g., Adobe Premiere Pro,
                                        After Effects) is a plus.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Experience with social media design or digital content creation.
                                    </motion.li>
                                </ul>
                            </div>

                            <div className="">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    What You’ll Gain
                                </motion.div>
                                <ul className="ml-3 list-outside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Hands-on experience designing for a variety of digital and print mediums.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Mentorship from experienced designers and exposure to a professional creative
                                        agency environment.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Opportunities to work on real projects that can be added to your portfolio.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        A chance to build connections within the design and creative community.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`sticky bottom-0 left-0 right-0 z-50 mt-[60px] w-full bg-white p-4 lg:hidden ${!isAtBottom ? 'border-t-[1px] border-[#D1D1D1]' : ''}`}
                    ref={stickyRef}
                >
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfeR7_HdqxTtLij4rGNxYGhqYliTW0_cGvmZQ2jpEp6eRr-mQ/viewform">
                        <Button
                            fullWidth
                            height="56px"
                            title="APPLY HERE"
                            rightIcon={'/assets/images/arrowUp.svg'}
                            animateRightIconOnHover
                            rightIconSize="24px"
                        />
                    </Link>
                </div>
            </section>
        </>
    );
};
