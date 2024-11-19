import React from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const Frontend = () => {
    return (
        <>
            <section className="px-[16px] py-[60px] lg:py-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0, from: 'left' })}
                        className="flex h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:h-[264px] lg:max-w-[200px]"
                    >
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLScSP_ysNA2v3DcHUI7czJs5yJw0hkTZ8dFVKjMPTIDqP0Ab3A/viewform">
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
                    <div className="ml-auto w-full lg:max-w-[800px]">
                        <div className="flex flex-col gap-[20px]">
                            <div className="mb-[32px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-3 font-pp-mori text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:text-[60px] lg:leading-[64px]"
                                >
                                    Front-End Developer (Intern)
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
                                    CVSpan is a Creative as a Service (CaaS) agency committed to delivering exceptional
                                    design and digital solutions to our clients. Our team thrives on collaboration and
                                    innovation, pushing the boundaries of creativity to bring brands to life online. As
                                    we grow, we’re excited to offer an opportunity for a talented Front-End Developer
                                    Intern to join our team and contribute to building visually compelling and highly
                                    functional user interfaces.
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
                                    We are seeking a Front-End Developer Intern to work closely with our design and
                                    development teams. This role involves coding, testing, and optimizing website
                                    components to deliver a seamless user experience. You’ll be actively involved in
                                    projects that combine design with functionality, allowing you to build a strong
                                    foundation in front-end development while learning about best practices in a
                                    creative agency environment.
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
                                        <b>Web Development:</b> Develop and maintain front-end components of web
                                        applications and websites using HTML, CSS, JavaScript, and related frameworks.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Responsive Design:</b> Ensure that websites and applications are
                                        mobile-responsive and optimized for different devices and screen sizes.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Cross-Functional Collaboration:</b> Work closely with designers to translate
                                        wireframes, mockups, and UI designs into interactive and functional components.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Code Optimization:</b> Write clean, efficient, and reusable code to enhance
                                        website performance and loading speed.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Testing & Debugging:</b> Conduct testing and debugging across browsers and
                                        devices to ensure cross-browser compatibility and a smooth user experience.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Continuous Learning:</b> Stay up-to-date with emerging front-end
                                        technologies, frameworks, and design trends to bring fresh ideas to our
                                        projects.
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

                                <ul className="list-inside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Current student or recent graduate in Computer Science, Web Development, or a
                                        related field.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Proficiency in HTML, CSS, and JavaScript, with basic knowledge of responsive
                                        design principles.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with front-end frameworks (e.g., React, Angular, Vue) is a plus.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Good understanding of version control systems, especially Git.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Strong attention to detail and a passion for creating visually appealing,
                                        user-friendly websites.{' '}
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Ability to work independently and in a team in a remote setting.
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

                                <ul className="list-inside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Experience with web design tools like Figma or Adobe XD.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with CSS preprocessors (e.g., Sass, LESS) and build tools (e.g.,
                                        Webpack, Gulp).
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Basic knowledge of back-end technologies (e.g., Node.js) is a bonus.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Interest in UI/UX design principles and their application to web development.
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
                                <ul className="list-inside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Real-world experience in front-end development within a creative agency.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Mentorship and training from experienced developers and designers.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Hands-on experience working on live projects that can be added to your
                                        portfolio.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Opportunities to build your skills in modern web development and UI/UX design.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
