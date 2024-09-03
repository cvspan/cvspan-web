'use client';

import React from 'react';
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
                                1. What Are Cookies?
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Cookies are small text files that are stored on your device (computer, tablet, or
                                mobile) when you visit a website. Cookies enable the website to recognize your device
                                and store certain information about your preferences or past actions.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                2. Types of Cookies We Use
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We use the following types of cookies on our Site:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-none text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">2.1 Essential Cookies:</span> These
                                        cookies are necessary for the Site to function properly. They enable core
                                        functionalities such as security, network management, and accessibility. Without
                                        these cookies, the Site may not perform as intended.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">
                                            2.2 Performance and Analytics Cookies:
                                        </span>{' '}
                                        These cookies help us understand how visitors interact with our Site by
                                        collecting information such as the number of visitors, the pages they visit, and
                                        the sources of traffic. This data is aggregated and anonymous, and we use it to
                                        improve the performance of our Site.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">2.3 Functional Cookies:</span> These
                                        cookies allow our Site to remember choices you make (such as your language or
                                        region) and provide enhanced, more personalized features. These cookies may also
                                        be used to remember changes you have made to text size, fonts, and other
                                        customizable parts of the Site.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">
                                            2.4 Advertising and Targeting Cookies:
                                        </span>{' '}
                                        These cookies are used to deliver relevant advertisements to you. They track
                                        your browsing habits across different websites and build a profile of your
                                        interests. This information may be shared with third-party advertisers to
                                        deliver targeted ads on our Site and elsewhere.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                3. Third-Party Cookies
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                In some cases, we use third-party cookies provided by trusted partners to enhance the
                                functionality and performance of our Site. These third-party cookies may track your
                                interactions with our Site and other websites to build a profile of your interests and
                                display relevant advertisements.
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        Information about your computer and about your visits to this website
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        Your IP address, geographical location, browser type and version, operating
                                        system, referral source, length of visit, page views and website navigation.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        Information that you provide to us for the purpose of subscribing to our website
                                        services, email notifications and/or newsletters.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
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
                                4. How We Use Cookies
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We use cookies to:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Ensure the proper functioning of our Site. Personalize your experience on our
                                        Site. Analyze how our Site is used and improve its performance. Deliver relevant
                                        advertisements to you. Understand and save your preferences for future visits.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Ensure the proper functioning of our Site.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Personalize your experience on our Site.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Analyze how our Site is used and improve its performance.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Deliver relevant advertisements to you.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="">
                                        Understand and save your preferences for future visits.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[500] leading-[32px] lg:font-[600]"
                            >
                                5. Your Choices Regarding Cookies
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                You have the option to control and manage cookies in various ways:
                            </motion.p>
                            <div className="ml-4">
                                <ul className="text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">5.1 Browser Settings:</span>Most web
                                        browsers allow you to control cookies through their settings. You can set your
                                        browser to block or delete cookies, but this may affect your ability to use
                                        certain features of the Site.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">5.2 Opt-Out:</span> You can opt out of
                                        receiving targeted ads from certain third-party networks by visiting their
                                        websites or by using industry-wide opt-out tools such as the Digital Advertising
                                        Alliance’s WebChoices tool or the Network Advertising Initiative’s Opt-Out tool.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">5.3 Do Not Track:</span>Some web
                                        browsers offer a {'"Do Not Track"'} (DNT) feature that signals to websites that
                                        you do not want your online activity tracked. Our Site does not currently
                                        respond to DNT signals.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                6. Changes to This Cookies Policy
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We may update this Cookies Policy from time to time to reflect changes in our practices
                                or for other operational, legal, or regulatory reasons. Any changes will be posted on
                                this page with the revised 25th August 2024
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
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                7. Contact Us
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                If you have any questions about these Terms, please contact us at cvspan.com
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
