'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

import './style.css';

type Props = {
    pageTitle: string;
};

const Privacy = ({ pageTitle }: Props) => {
    return (
        <>
            <Navbar light />

            <div className="">
                <div className="scroll_watcher_wrapper">
                    <div className="scroll_watcher"></div>
                </div>
                <div className="mx-auto w-[335px] space-y-[60px] pt-[120px] lg:w-[1200px]">
                    <motion.div {...ANIMATE_PROPS()} className="w-full">
                        <h1 className="font-pp-mori text-[34px] font-[500] leading-[42px] text-[#1A1A1A] lg:text-[96px] lg:font-semibold lg:leading-[103.68px]">
                            {pageTitle}
                        </h1>
                    </motion.div>
                    <div className="space-y-[30px]">
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Our privacy policy promise
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We are committed to maintaining the trust and confidence of our visitors to our website.
                                In particular, we want you to know that we are not in the business of selling, renting
                                or trading email lists with other companies and businesses for marketing purposes. In
                                this Privacy Policy, we’ve provided lots of detailed information on when and why we
                                collect your personal information, how we use it, the limited conditions under which we
                                may disclose it to others and how we keep it secure.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                What information do we collect?
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We may collect, store and use the following kinds of personal information.
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Information about your computer and about your visits to this website
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Your IP address, geographical location, browser type and version, operating
                                        system, referral source, length of visit, page views and website navigation.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Information that you provide to us for the purpose of subscribing to our website
                                        services, email notifications and/or newsletters.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Any other information that you choose to send to us
                                    </motion.li>
                                </ul>
                            </div>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Before you disclose to us the personal information of another person, you must obtain
                                that person’s consent to both the disclosure and the processing of that personal
                                information in accordance with the terms of this privacy policy.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Using your Personal Information
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Personal information submitted to us via this website will be used for the purposes
                                specified in this privacy policy or in relevant parts of the website. We may use your
                                personal information to:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Administer the website
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Improve your browsing experience by personalising the website
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Enable your use of the services available on the website
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Send statements and invoices to you, and collect payments from you
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Send you general (non-marketing) commercial communications
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Send you email notifications which you have specifically requested
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Send you our newsletter and other marketing communications relating to our
                                        business or the businesses of carefully-selected third parties which we think
                                        may be of interest to you, by post or, where you have specifically agreed to
                                        this, by email or similar technology and you can inform us at any time if you no
                                        longer require marketing communications
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Provide third parties with statistical information about our users – but this
                                        information will not be used to identify any individual user
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Deal with enquiries and complaints made by or about you relating to the website
                                        Keep the website secure and prevent fraud
                                    </motion.li>
                                </ul>
                            </div>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Where you submit personal information for publication on our website, we will publish
                                and otherwise use that information in accordance with the licence you grant to us. We
                                will not, without your express consent, provide your personal information to any third
                                parties for the purpose of direct marketing
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                {' '}
                                Links to other websites{' '}
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                This privacy notice does not cover the links within this site linking to other websites.
                                Those sites are not governed by this Privacy Policy, and if you have questions about how
                                a site uses your information, you’ll need to check that site’s privacy statement.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Newsletter Signup
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                As part of the registration process for our monthly e-newsletter, we collect personal
                                information. We use that information for a couple of reasons:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        to tell you about stuff you’ve asked us to tell you about
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        to contact you if we need to obtain or provide additional information
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        to check our records are right and to check every now and then that you’re happy
                                        and satisfied
                                    </motion.li>
                                </ul>
                            </div>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We don’t rent or trade email lists with other organisations and businesses.
                                <br /> <br />
                                We use a third party provider to deliver our newsletter. We gather statistics around
                                email opening and clicks using industry standard technologies to help us monitor and
                                improve our e-newsletter
                                <br />
                                <br />
                                You can unsubscribe to general mailings at any time of the day or night by clicking the
                                unsubscribe link at the bottom of any of our emails or by emailing us via the contact
                                page
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Disclosures
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We may disclose your personal information to any of our employees, officers, agents,
                                suppliers or subcontractors insofar as reasonably necessary for the purposes set out in
                                this privacy policy. <br /> <br />
                                We may disclose your personal information to any member of our group of companies (this
                                means our subsidiaries, our ultimate holding company and all its subsidiaries) insofar
                                as reasonably necessary for the purposes set out in this privacy policy. In addition, we
                                may disclose your personal information:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        To the extent that we are required to do so by law
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        In connection with any ongoing or prospective legal proceedings;
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        In order to establish, exercise or defend our legal rights (including providing
                                        information to others for the purposes of fraud prevention and reducing credit
                                        risk to any person who we reasonably believe may apply to a court or other
                                        competent authority for disclosure of that personal information where, in our
                                        reasonable opinion, such court or authority would be reasonably likely to order
                                        disclosure of that personal information.
                                    </motion.li>
                                </ul>
                            </div>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Except as provided in this privacy policy, we will not provide your information to third
                                parties.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Security of your personal information
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We will take reasonable technical and organisational precautions to prevent the loss,
                                misuse or alteration of your personal information. We will store all the personal
                                information you provide on our secure password and firewall protected server. All
                                electronic transactions entered into via the website will be protected by encryption
                                technology. You acknowledge that the transmission of information over the internet is
                                inherently insecure, and we cannot guarantee the security of data sent over the
                                internet.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Access to your personal information
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Under new GDPR legislation you have the right to request access, amend or request
                                terminatation of any personal data that we hold. Provision of such information will be
                                subject to:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        The supply of appropriate evidence of your identity (for this purpose, we will
                                        usually accept a photocopy of your passport certified by a solicitor or bank,
                                        plus an original copy of a utility bill showing your current address).
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                Changes to this privacy notice
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We keep our privacy notice under regular review. This privacy notice was last updated on
                                May 14th, 2018.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Privacy;
