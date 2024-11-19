import React from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const Volunteers = () => {
    return (
        <>
            <section className="px-[16px] py-[60px] lg:py-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0, from: 'left' })}
                        className="flex h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:h-[264px] lg:max-w-[200px]"
                    >
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdhxJuXglSewbSVpbNZdHW3BD-PwF95bZXrMHruDTCdARGaqg/viewform">
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
                                    Volunteers
                                </motion.div>
                                <motion.span
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]"
                                >
                                    Project
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
                                    CVSpan is a Creative as a Service (CaaS) agency dedicated to delivering innovative
                                    design solutions for brands across various industries. We believe in the power of
                                    creativity and collaboration to drive meaningful change. Our Design Jams are dynamic
                                    events where creative minds come together to solve real-world challenges and
                                    experiment with fresh ideas. We’re looking for passionate volunteers to help make
                                    these events a success!
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
                                    As a Design Jam Volunteer, you’ll play a crucial role in planning, organizing, and
                                    executing our Design Jam events. This is an excellent opportunity for individuals
                                    who are enthusiastic about design, collaboration, and community building. You’ll
                                    gain hands-on experience in event management, project coordination, and creative
                                    problem-solving while working closely with our team and fellow volunteers.
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
                                        <b>Event Planning & Coordination:</b> Support the planning and organization of
                                        Design Jam events, including scheduling, communication with participants, and
                                        ensuring all materials and resources are ready for the event.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Facilitation Assistance:</b> Work with facilitators to help guide teams
                                        through the Design Jam process, offering support to participants as they
                                        brainstorm, design, and develop solutions.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Participant Engagement:</b> Act as a point of contact for participants
                                        before, during, and after the event. Answer questions, provide guidance, and
                                        create a welcoming and inclusive environment for all attendees.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Resource Preparation:</b> Assist in preparing templates, tools, and resources
                                        that participants may need to succeed during the Design Jam.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Promotion & Outreach:</b> Help promote Design Jam events through social
                                        media, email outreach, and other channels to attract participants and raise
                                        awareness.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        <b>Documentation & Feedback Collection:</b> Document key moments and outcomes
                                        from the event. Collect feedback from participants to help improve future Design
                                        Jams.
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
                                        Passion for design, creativity, and community-building.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Strong communication and interpersonal skills with a friendly, approachable
                                        demeanor.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Excellent organizational skills and attention to detail.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Ability to work well in a team-oriented, remote environment.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with basic design principles and a general understanding of creative
                                        processes is a plus.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Availability to commit to planning meetings and the duration of the Design Jam
                                        event.
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
                                        Experience with event planning, facilitation, or community organizing.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Familiarity with digital collaboration tools (e.g., Zoom, Miro, Slack).
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Interest in the creative industry and an understanding of the Design Thinking
                                        process.
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
                                        Hands-on experience in event coordination and creative facilitation.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        Networking opportunities with industry professionals and fellow creatives.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        The chance to build your skills in project management, design thinking, and
                                        teamwork.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        A Certificate of Appreciation and recognition for your contributions.
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
