'use client';
import React, { useState } from 'react';
import EditModal from './EditModal';

type Props = {};

const Profile: React.FC<Props> = (props) => {
    // Initialize toggleState to 0 (modal closed)
    const [toggleState, setToggleState] = useState<number>(0);

    // Function to toggle modal state
    const toggleTab = (index: number) => {
        setToggleState(index);
        console.log('Modal toggled to:', index);
    };

    return (
        <>
            <div>
                <div className="space-y-8">
                    {/* Profile Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <img
                                src="/assets/images/profile_picture.png"
                                alt="Profile Picture"
                                className="w-[124px] rounded-full"
                            />
                            <div className="space-y-1">
                                <h2 className="font-pp-mori text-[24px] font-[500] leading-[32px] text-[#1a1a1a]">
                                    Moses Arfo
                                </h2>
                                <p className="font-pp-mori text-[14px] font-[400] leading-[22px] text-[#484848]">
                                    UIUX Designer
                                </p>
                            </div>
                        </div>
                        <div>
                            {/* Add onClick to open the modal */}
                            <button
                                onClick={() => toggleTab(1)}
                                className="flex items-center gap-3 rounded-[100px] bg-[#f4f4f4] px-6 py-3 text-center transition duration-200 hover:bg-[#e0e0e0]"
                            >
                                <span>
                                    <img src={'/assets/icons/Edit_profile.svg'} alt="Edit Profile Icon" />
                                </span>
                                <span className="font-pp-mori text-[16px] font-[500] leading-[24px] text-[#161313]">
                                    Edit Profile
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="flex gap-[50px]">
                        <p className="min-w-[200px] font-pp-mori text-[14px] font-[400] leading-[22px] text-[#767676]">
                            Bio
                        </p>
                        <p className="font-pp-mori text-[16px] font-[400] leading-[24px] text-[#1a1a1a]">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo.
                        </p>
                    </div>
                    <div className="flex gap-[50px]">
                        <p className="min-w-[200px] font-pp-mori text-[14px] font-[400] leading-[22px] text-[#767676]">
                            Link
                        </p>
                        <p className="font-pp-mori text-[16px] font-[400] leading-[24px] text-[#1a1a1a]">
                            www.mosesarfo.com
                        </p>
                    </div>
                    <div className="flex gap-[50px]">
                        <p className="min-w-[200px] font-pp-mori text-[14px] font-[400] leading-[22px] text-[#767676]">
                            Location
                        </p>
                        <p className="font-pp-mori text-[16px] font-[400] leading-[24px] text-[#1a1a1a]">Nigeria</p>
                    </div>
                </div>
            </div>

            {/* Pass toggleState and toggleTab to EditModal */}
            <EditModal toggleState={toggleState} toggleTab={toggleTab} />
        </>
    );
};
export default Profile;
