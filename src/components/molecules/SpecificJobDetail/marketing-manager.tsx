import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const MarketingManager = () => {
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
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdVOIknBU7ASlkKCowo_7Zk6hevJxh-Yw5ql4-ZUp-aaZ5RnA/viewform">
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
                                    Marketing Manager (Intern)
                                </motion.div>
                                <motion.span
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]"
                                >
                                    Marketing
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
                                    CVSpan is a Creative as a Service (CaaS) agency dedicated to crafting impactful
                                    design and marketing solutions for clients across various industries. We pride
                                    ourselves on creativity, collaboration, and delivering measurable results. As part
                                    of our commitment to nurturing talent, we’re offering a unique internship
                                    opportunity for an ambitious Marketing Manager Intern to gain hands-on experience in
                                    managing and executing marketing strategies.
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
                                    We are looking for a Marketing Manager Intern to support our marketing team in
                                    strategizing, executing, and analyzing campaigns to drive growth and brand
                                    awareness. This role involves working on digital marketing initiatives, content
                                    creation, social media management, and campaign analytics. The ideal candidate is
                                    strategic, results-driven, and excited to contribute to CVSpan’s marketing efforts.
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
                                        <b>Campaign Support:</b> Assist in planning and executing marketing campaigns
                                        across digital channels (e.g., email, social media, website). Ensure campaigns
                                        are well-coordinated and align with company goals and brand voice.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Content Creation & Management:</b> Collaborate with the creative team to
                                        develop and manage content for social media, newsletters, blog posts, and other
                                        marketing materials. Help maintain a content calendar to keep campaigns on
                                        track.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Market Research:</b> Conduct research on industry trends, competitor
                                        activities, and audience preferences to help inform marketing strategies and
                                        identify opportunities for growth.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Social Media Management:</b> Support daily social media activities, including
                                        posting, engagement, and tracking performance. Suggest new formats and ideas to
                                        increase engagement and reach.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Analytics & Reporting:</b> Track and analyze campaign performance, create
                                        reports, and provide insights and recommendations for improvement.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Collaboration:</b> Work closely with the design, sales, and other relevant
                                        teams to ensure consistent messaging across all marketing initiatives.
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
                                        Current student or recent graduate in Marketing, Business, Communications, or a
                                        related field.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with digital marketing concepts, including SEO, social media, email
                                        marketing, and content marketing.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Strong organizational skills, attention to detail, and ability to manage
                                        multiple projects.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Proficiency in marketing tools (e.g., Canva, Hootsuite, Mailchimp, or similar).
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Excellent written and verbal communication skills, with the ability to adapt to
                                        CVSpan’s brand tone and style.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Enthusiasm for staying updated on marketing trends and emerging digital
                                        channels.
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
                                        Experience with data analysis or using analytics tools (e.g., Google Analytics,
                                        social media insights).
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Basic knowledge of graphic design or copywriting.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Passion for the creative and tech industries.
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
                                        Real-world experience in developing and executing marketing strategies.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Mentorship from experienced marketing professionals and exposure to agency
                                        operations.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        The opportunity to work on impactful campaigns and build a diverse portfolio of
                                        marketing projects.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Skills in digital marketing, content management, and data analysis.
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
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdVOIknBU7ASlkKCowo_7Zk6hevJxh-Yw5ql4-ZUp-aaZ5RnA/viewform">
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
