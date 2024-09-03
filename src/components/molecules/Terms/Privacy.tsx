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
                                Our term and condition
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
                                1. Use of the Site
                            </motion.h5>
                            <div className="">
                                <ul className="text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="text-base leading-8 text-[#1a1a1a]">
                                        <span className="text-[20px] font-medium">1.1 Eligibility:</span> You must be at
                                        least [age] years old to use this Site. By using the Site, you represent and
                                        warrant that you meet this age requirement.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4 text-base leading-8 text-[#1a1a1a]">
                                        <span className="text-[20px] font-medium">1.2 Account Registration:</span>{' '}
                                        Certain features of our Site may require you to create an account. You agree to
                                        provide accurate and complete information during registration and to keep your
                                        account information updated. You are responsible for maintaining the
                                        confidentiality of your account credentials.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4 text-base leading-8 text-[#1a1a1a]">
                                        <span className="text-[20px] font-medium">1.3 Prohibited Activities</span> You
                                        agree not to use the Site for any unlawful purpose or in a way that violates
                                        these Terms. Prohibited activities include, but are not limited to:
                                        <div className="">
                                            <ul className="list-disc pl-4 text-[16px] font-normal leading-[24px] text-[#484848]">
                                                <motion.li {...ANIMATE_PROPS()} className="">
                                                    Hacking or interfering with the Site{"'"}s operation.
                                                </motion.li>
                                                <motion.li {...ANIMATE_PROPS()} className="">
                                                    Uploading or sharing harmful or illegal content.
                                                </motion.li>
                                                <motion.li {...ANIMATE_PROPS()} className="">
                                                    Infringing on the intellectual property rights of others.
                                                </motion.li>
                                                <motion.li {...ANIMATE_PROPS()} className="">
                                                    Impersonating another person or entity.
                                                </motion.li>
                                            </ul>
                                        </div>
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                2. Intellectual Property
                            </motion.h5>
                            <div className="ml-4">
                                <ul className="text-[16px] font-normal leading-8 text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        2.1 Ownership: All content, features, and functionality on the Site, including
                                        text, graphics, logos, and software, are the exclusive property of [Your Company
                                        Name] or its licensors and are protected by intellectual property laws.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        2.2 License: We grant you a limited, non-exclusive, non-transferable license to
                                        access and use the Site for personal or business purposes, subject to these
                                        Terms. You may not reproduce, distribute, or create derivative works from the
                                        Site{"'"}s content without our prior written consent.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                3. User-Generated Content
                            </motion.h5>
                            <div className="">
                                <ul className="text-[16px] font-normal leading-[24px] text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">3.1 Ownership:</span> All content,
                                        features, and functionality on the Site, including text, graphics, logos, and
                                        software, are the exclusive property of CV Span
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">3.2 Responsibility:</span> If you
                                        submit or post content on our Site, you represent and warrant that you have the
                                        right to do so and that your content does not violate
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">3.3 License to Us:</span> By
                                        submitting content, you grant us a worldwide, non-exclusive, royalty-free
                                        license to use, reproduce, modify, and display your content in connection with
                                        the operation of the Site.
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS()} className="mt-4">
                                        <span className="text-[20px] font-medium">3.4 Removal of Content: </span> We
                                        reserve the right to remove or modify any user-generated content at our
                                        discretion.censors and are protected by intellectual property laws.
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                4. Privacy
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                Your privacy is important to us. Please refer to our [Privacy Policy] for information on
                                how we collect, use, and protect your personal information.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                6. Indemnification
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                You agree to indemnify and hold harmless [Your Company Name], its affiliates, and
                                employees from any claims, liabilities, damages, or expenses arising from your use of
                                the Site or violation of these Terms.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                7. Changes to the Terms
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                We may update these Terms from time to time. Any changes will be posted on this page
                                with the revised {'Last Updated'} date. Your continued use of the Site after such
                                changes constitutes acceptance of the new Terms.
                            </motion.p>
                        </div>
                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                8. Governing Law
                            </motion.h5>
                            <motion.p
                                {...ANIMATE_PROPS()}
                                className="text-[16px] font-normal leading-[24px] text-[#484848]"
                            >
                                These Terms are governed by and construed in accordance with the laws of [Your
                                Jurisdiction], without regard to its conflict of law principles.
                            </motion.p>
                        </div>

                        <div className="space-y-[16px]">
                            <motion.h5
                                {...ANIMATE_PROPS()}
                                className="font-eudoxus text-[24px] font-[600] leading-[32px]"
                            >
                                9. Contact Us
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
