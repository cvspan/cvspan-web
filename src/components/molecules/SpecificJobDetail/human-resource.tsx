import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const HumanResource = () => {
    const parentRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // setIsAtBottom(entry.isIntersecting);
                setIsAtBottom(true);
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
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLScy7EGMxpBYdlCDvw0pxi4XK4k8Cpaa1DRdizuMFYu3uw_vsg/viewform">
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
                                    Human Resource (Intern)
                                </motion.div>
                                <motion.span
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]"
                                >
                                    Management
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
                                    CVSpan is a Creative as a Service (CaaS) agency that partners with brands to deliver
                                    top-notch creative solutions. Known for our collaborative environment and diverse
                                    team, we are passionate about building a culture that nurtures creativity and
                                    supports the growth of our people. We’re seeking an enthusiastic Human Resources
                                    Intern to join our team and contribute to the growth of our HR function while
                                    gaining valuable experience in a fast-paced, creative agency setting.
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
                                    As a Human Resources Intern at CVSpan, you will support our HR team in various tasks
                                    and projects focused on recruitment, onboarding, employee engagement, and more. This
                                    role offers a great opportunity to learn about HR best practices in a creative
                                    industry and gain hands-on experience in people operations. The ideal candidate is
                                    proactive, organized, and passionate about helping others and fostering a positive
                                    work environment.
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
                                        <b>Recruitment Support:</b> Assist with the recruitment process, including
                                        posting job openings, screening resumes, scheduling interviews, and maintaining
                                        communication with candidates.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Onboarding:</b> Help coordinate the onboarding process for new hires by
                                        preparing onboarding materials, assisting with orientation, and ensuring new
                                        employees feel welcomed and informed.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Employee Engagement:</b> Contribute to employee engagement initiatives, such
                                        as planning virtual team-building activities, sending out surveys, and gathering
                                        feedback to improve employee experience.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>HR Administration:</b> Maintain employee records, update databases, and
                                        ensure all documents and forms are organized and properly filed.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Policy & Process Support:</b> Assist in reviewing and updating HR policies,
                                        procedures, and training materials, ensuring they align with company values and
                                        industry standards.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Learning & Development:</b> Support the HR team in organizing training
                                        sessions, webinars, and other learning opportunities for employees to promote
                                        growth and skill-building.
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
                                        Current student or recent graduate in Human Resources, Business Administration,
                                        Psychology, or a related field.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Strong communication and interpersonal skills, with a high level of empathy and
                                        professionalism.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Excellent organizational skills and attention to detail.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Ability to handle sensitive and confidential information with discretion.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Proficiency in Microsoft Office and/or Google Workspace tools.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Eagerness to learn and adapt in a dynamic, creative environment.
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
                                        Prior internship or relevant experience in HR, recruitment, or administration.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with HR software (e.g., BambooHR, Workday) or applicant tracking
                                        systems is a plus.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Interest in the creative industry and an understanding of agency dynamics.
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
                                        Hands-on experience in various HR functions within a creative agency.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Mentorship from HR professionals and exposure to best practices in people
                                        operations.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        An opportunity to develop valuable communication and organizational skills.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Insight into building a strong company culture in a creative, remote-first
                                        environment.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`sticky bottom-0 left-0 right-0 z-50 mt-[60px] w-full bg-white p-4 lg:hidden ${!isAtBottom ? 'border-t border-[#D1D1D1]' : 'border-none'}`}
                    ref={stickyRef}
                >
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLScy7EGMxpBYdlCDvw0pxi4XK4k8Cpaa1DRdizuMFYu3uw_vsg/viewform">
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
