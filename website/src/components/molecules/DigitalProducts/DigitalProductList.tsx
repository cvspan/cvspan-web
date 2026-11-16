import React from 'react';
import { DigitalProduct } from './DigitalProduct';

import { services } from './data';

const tabs = [
    { title: 'Design Services', key: 'design' },
    { title: 'Development Services', key: 'development' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export const DigitalProductList = () => {
    const [current, setcurrent] = React.useState<TabKey>('design');

    return (
        <div className="">
            <div className="my-[40px] flex w-full justify-center gap-x-[24px] border-b-[3px] border-b-[#484848] sm:my-[60px] md:justify-start md:gap-x-[70px]">
                {tabs.map((tab) => {
                    const active = tab.key === current;
                    return (
                        <button
                            className={`${active ? 'border-b-[#00FFB2] text-[#00FFB2]' : 'border-b-[#484848] text-[#484848]'} mb-[-3px] flex items-center gap-[16px] border-b-[3px] pb-[16px] text-[16px] leading-[24px] md:pb-[24px] md:text-[24px] md:leading-[36px]`}
                            key={tab?.key}
                            onClick={() => setcurrent(tab?.key)}
                        >
                            <span>{tab?.title}</span>
                            {active ? (
                                <img
                                    src="/assets/icons/arrow-bottom-right-light-green.svg"
                                    className="hidden h-[16px] w-[16px] sm:block md:h-[20px] md:w-[20px]"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : (
                                <img
                                    src="/assets/icons/arrow-top-right-gray.svg"
                                    className="hidden h-[16px] w-[16px] sm:block md:h-[20px] md:w-[20px]"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
            <div>
                <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                    {services[current].map((item, index) => {
                        return <DigitalProduct item={item} key={index + item?.title} index={index} />;
                    })}
                </div>
            </div>
        </div>
    );
};
