import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../Button';
export const OurTeamHeader = () => {
    const router = useRouter();
    return (
        <div>
            <div className="flex items-end justify-between">
                <div className="max-w-[565px]">
                    <span>
                        <h2 className="font-eudoxus text-[34px] font-medium leading-[42px] text-black lg:text-5xl lg:leading-[56px]">
                            Our Team
                        </h2>
                        <div className="mt-3">
                            <div className="font-eudoxus text-lg font-normal leading-[26px] text-[#484848]">
                                Meet the dedicated professionals driving our success and delivering exceptional
                                solutions to elevate your digital projects.
                            </div>
                        </div>
                    </span>
                </div>
                <div>
                    <Button
                        title="SEE ALL OUR TEAM"
                        height="56px"
                        background="blue"
                        animateRightIconOnHover
                        rightIcon="/assets/icons/arrow-top-right-white.svg"
                        onClick={() => router.push('/about/team')}
                    />
                </div>
            </div>
        </div>
    );
};
