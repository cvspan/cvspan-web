import React from 'react';
import DesignCard from './designCard/DesignCard';

const Design = () => {
    return (
        <section className="py-[60px] lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-[60px] overflow-hidden pl-6 pr-6 md:flex-row lg:gap-[120px]">
                <div className="lg:w-4/12">
                    <p className="font-eudoxus text-[14px] text-[#484848]">
                        Professional designers focus on creating intuitive and user-friendly interfaces that make it
                        easy for users to navigate and interact with a product or website, leading to a more satisfying
                        user experience.
                    </p>
                </div>
                <div className="flex flex-col gap-[60px] lg:w-8/12">
                    <div className="flex flex-col gap-[20px]">
                        <h2
                            className="font-pp-mori font-semibold leading-tight text-[#1A1A1A] md:w-full lg:w-full"
                            style={{ fontSize: 'clamp(2.5rem, 4.6875vw, 3.75rem)' }}
                        >
                            Discover the benefits of professional UIUX design service
                        </h2>
                        <p className="font-eudoxus text-[#484848] md:w-full lg:w-full">
                            UX design enhances user satisfaction by creating intuitive, user-friendly interfaces that
                            improve ease of use. It reduces user frustration and encourages longer engagement with
                            products or services. By focusing on usability and accessibility, UX design helps businesses
                            attract and retain customers, leading to increased conversion rates and higher
                            profitability. Additionally, it fosters brand loyalty and positive word-of-mouth referrals,
                            positioning companies as leaders in customer experience excellence.
                        </p>
                    </div>
                    <div>
                        <DesignCard
                            title="Enhanced UX"
                            description="Enhanced User Experience (UX) plays a pivotal role in modern digital interactions by significantly improving the usability, accessibility, and satisfaction derived from a product or service. By focusing on the user's needs and preferences, enhanced UX ensures that interfaces are intuitive, engaging, and efficient."
                        />
                        <DesignCard
                            title="Accessibility"
                            description="Accessibility explores the concept of ensuring products, services, and environments are usable by all people, especially those with disabilities. It focuses on designing inclusive solutions that accommodate diverse needs, promoting equal access and participation in society."
                        />
                        <DesignCard
                            title="Improved SEO"
                            description="Improved SEO refers to enhancing a website's visibility and ranking in search engine results pages (SERPs) through various strategies such as keyword optimization, content quality, backlinking, and technical improvements. It aims to attract more organic traffic, improve user experience, and ultimately drive business growth."
                        />

                        <DesignCard
                            title="Increased Conversion"
                            description="As a company, our focus is on increasing conversion rates for our clients. We achieve this by optimizing user experience, refining sales funnels, conducting targeted marketing campaigns, and leveraging data-driven insights to maximize customer engagement and drive meaningful actions, ultimately boosting our clients' business outcomes."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Design;
