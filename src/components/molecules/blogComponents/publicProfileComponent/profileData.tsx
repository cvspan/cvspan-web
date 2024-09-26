import React from 'react';
import Button from '../../Button';

type Props = {};

const ProfileData = (props: Props) => {
    return (
        <div>
            <div className="space-y-[20px] pl-[50px]">
                <div className="">
                    <img src="/assets/images/profile_picture.png" alt="" className="size-[75px]" />
                </div>

                <div className="space-y-[20px]">
                    <div className="space-y-[4px]">
                        <h5 className="font-eudoxus text-[24px] font-[500] leading-[32px] text-[#1a1a1a]">
                            Moses Arfo
                        </h5>
                        <p className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#484848]">
                            UIUX Designer
                        </p>
                    </div>

                    <div className="">
                        <p className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#767676]">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <img src="/assets/icons/Eyes.svg" alt="" />
                        <span className="font-eudoxus text-[14px] font-[400] leading-[22px] text-[#1a1a1a]">
                            12k Total views
                        </span>
                    </div>

                    <div className="flex items-center gap-[8px]">
                        <button className="flex gap-x-2 rounded-[100px] bg-[#f4f4f4] px-4 py-2 font-eudoxus text-[14px] font-[500] leading-[22px] text-[#1a1a1a]">
                            Website
                            <span className="">
                                <img src="/assets/icons/ArrowUP.svg" alt="" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileData;
