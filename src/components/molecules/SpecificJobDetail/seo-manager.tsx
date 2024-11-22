import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const SEOManager = () => {
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
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeOQrlhESm3RSkr-lYbafHw3wJNX_8R-2n3u1pOVU1bIs5zPw/viewform">
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
                                    SEO Manager (Intern)
                                </motion.div>
                                <motion.span
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]"
                                >
                                    Development
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
                                    CVSpan is a Creative as a Service (CaaS) agency, dedicated to delivering top-tier
                                    design and marketing solutions that elevate our clients' brand presence. As we
                                    expand our digital reach, we’re looking for a motivated SEO Manager Intern to join
                                    our team. This role offers a unique opportunity to learn from experienced
                                    professionals and gain valuable skills in search engine optimization within a
                                    fast-paced creative agency environment.
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
                                    The SEO Manager Intern will work closely with our marketing and content teams to
                                    support SEO strategy, keyword research, and on-page optimization efforts. The role
                                    involves assisting in analyzing SEO performance, implementing strategies to improve
                                    rankings, and ensuring our digital content is optimized for search engines. This is
                                    a great opportunity to gain hands-on experience in SEO and contribute directly to
                                    the visibility of CVSpan’s online presence.
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
                                        <b>Keyword Research & Strategy:</b> Assist in researching relevant keywords and
                                        topics for target audiences and industry trends. Help develop SEO strategies
                                        based on identified opportunities.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>On-Page Optimization:</b> Support the optimization of web pages, blog posts,
                                        and other content to improve search engine rankings. This includes optimizing
                                        meta tags, headers, image alt texts, and ensuring keyword integration.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Content Support:</b> Collaborate with the content team to create SEO-friendly
                                        content. Provide guidance on best practices to ensure all content aligns with
                                        SEO goals.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Performance Tracking & Reporting:</b> Monitor SEO performance metrics, such
                                        as traffic, rankings, and conversions. Create reports with insights and
                                        suggestions for improving search engine visibility.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Link Building & Outreach:</b> Assist in identifying potential link-building
                                        opportunities and support outreach efforts to increase domain authority and
                                        drive organic traffic.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Competitor Analysis:</b> Conduct research on competitors' SEO strategies and
                                        identify gaps or opportunities that can be leveraged.
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
                                        Current student or recent graduate in Marketing, Communications, Digital Media,
                                        or a related field.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Basic understanding of SEO principles and best practices.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with SEO tools (e.g., Google Analytics, Google Search Console,
                                        Ahrefs, SEMrush) or a willingness to learn.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Strong analytical and organizational skills, with attention to detail.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Good written communication skills with a strategic approach to content.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Enthusiasm for learning about search engine optimization and digital marketing.
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
                                        Experience with website management or content management systems (e.g.,
                                        WordPress).
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Knowledge of HTML/CSS basics for SEO optimization.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Understanding of content marketing and its role in SEO.
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
                                        Hands-on experience in developing and implementing SEO strategies.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Mentorship and training from SEO and digital marketing experts.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Practical knowledge of SEO tools and techniques to enhance search engine
                                        visibility.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        The opportunity to work on real projects that will directly impact CVSpan’s
                                        online presence.
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
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeOQrlhESm3RSkr-lYbafHw3wJNX_8R-2n3u1pOVU1bIs5zPw/viewform">
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
