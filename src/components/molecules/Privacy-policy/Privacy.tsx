import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';

type Props = {
    pageTitle: String;
};

const Privacy = ({ pageTitle }: Props) => {
    return (
        <>
            <Navbar light />
            <div className="mx-auto w-[1200px] space-y-[60px] pt-[120px]">
                <div className="">
                    <h1 className="font-pp-mori text-[96px] font-semibold leading-[103.68px] text-[#1A1A1A]">
                        {pageTitle}
                    </h1>
                </div>
                <div className="space-y-[30px]">
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            Our privacy policy promise
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            We are committed to maintaining the trust and confidence of our visitors to our website. In
                            particular, we want you to know that we are not in the business of selling, renting or
                            trading email lists with other companies and businesses for marketing purposes. In this
                            Privacy Policy, we’ve provided lots of detailed information on when and why we collect your
                            personal information, how we use it, the limited conditions under which we may disclose it
                            to others and how we keep it secure.
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            What information do we collect?
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            We may collect, store and use the following kinds of personal information.
                        </p>
                        <div className="ml-4">
                            <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                <li className="">
                                    Information about your computer and about your visits to this website
                                </li>
                                <li className="">
                                    Your IP address, geographical location, browser type and version, operating system,
                                    referral source, length of visit, page views and website navigation.
                                </li>
                                <li className="">
                                    Information that you provide to us for the purpose of subscribing to our website
                                    services, email notifications and/or newsletters.
                                </li>
                                <li className="">Any other information that you choose to send to us</li>
                            </ul>
                        </div>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            Before you disclose to us the personal information of another person, you must obtain that
                            person’s consent to both the disclosure and the processing of that personal information in
                            accordance with the terms of this privacy policy.
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            Using your Personal Information
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            Personal information submitted to us via this website will be used for the purposes
                            specified in this privacy policy or in relevant parts of the website. We may use your
                            personal information to:
                        </p>
                        <div className="ml-4">
                            <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                <li className="">Administer the website</li>
                                <li className="">Improve your browsing experience by personalising the website</li>
                                <li className="">Enable your use of the services available on the website</li>
                                <li className="">Send statements and invoices to you, and collect payments from you</li>
                                <li className="">Send you general (non-marketing) commercial communications</li>
                                <li className="">Send you email notifications which you have specifically requested</li>
                                <li className="">
                                    Send you our newsletter and other marketing communications relating to our business
                                    or the businesses of carefully-selected third parties which we think may be of
                                    interest to you, by post or, where you have specifically agreed to this, by email or
                                    similar technology and you can inform us at any time if you no longer require
                                    marketing communications
                                </li>
                                <li className="">
                                    Provide third parties with statistical information about our users – but this
                                    information will not be used to identify any individual user
                                </li>
                                <li className="">
                                    Deal with enquiries and complaints made by or about you relating to the website Keep
                                    the website secure and prevent fraud
                                </li>
                            </ul>
                        </div>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            Where you submit personal information for publication on our website, we will publish and
                            otherwise use that information in accordance with the licence you grant to us. We will not,
                            without your express consent, provide your personal information to any third parties for the
                            purpose of direct marketing
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            {' '}
                            Links to other websites{' '}
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            This privacy notice does not cover the links within this site linking to other websites.
                            Those sites are not governed by this Privacy Policy, and if you have questions about how a
                            site uses your information, you’ll need to check that site’s privacy statement.
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">Newsletter Signup</h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            As part of the registration process for our monthly e-newsletter, we collect personal
                            information. We use that information for a couple of reasons:
                        </p>
                        <div className="ml-4">
                            <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                <li className="">to tell you about stuff you’ve asked us to tell you about</li>
                                <li className="">
                                    to contact you if we need to obtain or provide additional information
                                </li>
                                <li className="">
                                    to check our records are right and to check every now and then that you’re happy and
                                    satisfied
                                </li>
                            </ul>
                        </div>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            We don’t rent or trade email lists with other organisations and businesses.
                            <br /> <br />
                            We use a third party provider to deliver our newsletter. We gather statistics around email
                            opening and clicks using industry standard technologies to help us monitor and improve our
                            e-newsletter
                            <br />
                            <br />
                            You can unsubscribe to general mailings at any time of the day or night by clicking the
                            unsubscribe link at the bottom of any of our emails or by emailing us via the contact page
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">Disclosures</h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            We may disclose your personal information to any of our employees, officers, agents,
                            suppliers or subcontractors insofar as reasonably necessary for the purposes set out in this
                            privacy policy. <br /> <br />
                            We may disclose your personal information to any member of our group of companies (this
                            means our subsidiaries, our ultimate holding company and all its subsidiaries) insofar as
                            reasonably necessary for the purposes set out in this privacy policy. In addition, we may
                            disclose your personal information:
                        </p>
                        <div className="ml-4">
                            <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                <li className="">To the extent that we are required to do so by law</li>
                                <li className="">In connection with any ongoing or prospective legal proceedings;</li>
                                <li className="">
                                    In order to establish, exercise or defend our legal rights (including providing
                                    information to others for the purposes of fraud prevention and reducing credit risk
                                    to any person who we reasonably believe may apply to a court or other competent
                                    authority for disclosure of that personal information where, in our reasonable
                                    opinion, such court or authority would be reasonably likely to order disclosure of
                                    that personal information.
                                </li>
                            </ul>
                        </div>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            Except as provided in this privacy policy, we will not provide your information to third
                            parties.
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            Security of your personal information
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            We will take reasonable technical and organisational precautions to prevent the loss, misuse
                            or alteration of your personal information. We will store all the personal information you
                            provide on our secure password and firewall protected server. All electronic transactions
                            entered into via the website will be protected by encryption technology. You acknowledge
                            that the transmission of information over the internet is inherently insecure, and we cannot
                            guarantee the security of data sent over the internet.
                        </p>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            Access to your personal information
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            Under new GDPR legislation you have the right to request access, amend or request
                            terminatation of any personal data that we hold. Provision of such information will be
                            subject to:
                        </p>
                        <div className="ml-4">
                            <ul className="list-disc text-[16px] font-normal leading-[24px] text-[#484848]">
                                <li className="">
                                    The supply of appropriate evidence of your identity (for this purpose, we will
                                    usually accept a photocopy of your passport certified by a solicitor or bank, plus
                                    an original copy of a utility bill showing your current address).
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-[16px]">
                        <h5 className="font-eudoxus text-[24px] font-[600] leading-[32px]">
                            Changes to this privacy notice
                        </h5>
                        <p className="text-[16px] font-normal leading-[24px] text-[#484848]">
                            We keep our privacy notice under regular review. This privacy notice was last updated on May
                            14th, 2018.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Privacy;
