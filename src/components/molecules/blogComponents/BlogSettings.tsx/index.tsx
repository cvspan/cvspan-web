'use client';
import React, { useState } from 'react';
import Button from '../../Button';

type Props = {};

const BlogSettings = (props: Props) => {
    const [hidePassword, setHidePassword] = useState<boolean | true>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean | true>(true);
    const togglePassword = () => setHidePassword((prevState: boolean) => !prevState);
    const toggleConfirmPassword = () => setHideConfirmPassword((prevState: boolean) => !prevState);
    return (
        <div className="flex h-full items-center justify-center">
            <div className="w-[350px] space-y-[24px]">
                <div className="space-y-[16px]">
                    <h1 className="font-pp-mori text-[16px] font-[500] leading-[24px] text-[#1a1a1a]">
                        Change Password
                    </h1>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="paceholder:font-[400] relative w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-[#838383]"
                            placeholder="Enter Current Password"
                        />
                        <button
                            type="button"
                            aria-label={`${hidePassword ? 'Hide' : 'Reveal'} Password`}
                            className="absolute right-5 top-[calc(50%-12px)] h-5 w-5 border-none bg-transparent outline-none"
                            onClick={togglePassword}
                        >
                            {hidePassword ? (
                                <img src="/assets/icons/Eyes.svg" alt="Hide Password" />
                            ) : (
                                <img src="/assets/icons/Eye.svg" alt="Reveal Password" />
                            )}
                        </button>
                    </div>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="paceholder:font-[400] relative w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-[#838383]"
                            placeholder="Enter New Password"
                        />
                        <button
                            type="button"
                            aria-label={`${hidePassword ? 'Hide' : 'Reveal'} Password`}
                            className="absolute right-5 top-[calc(50%-12px)] h-5 w-5 border-none bg-transparent outline-none"
                            onClick={toggleConfirmPassword}
                        >
                            {hideConfirmPassword ? (
                                <img src="/assets/icons/Eyes.svg" alt="Hide Password" />
                            ) : (
                                <img src="/assets/icons/Eye.svg" alt="Reveal Password" />
                            )}
                        </button>
                    </div>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="paceholder:font-[400] relative w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-[#838383]"
                            placeholder="Confirm New Password"
                        />
                        <button
                            type="button"
                            aria-label={`${hidePassword ? 'Hide' : 'Reveal'} Password`}
                            className="absolute right-5 top-[calc(50%-12px)] h-5 w-5 border-none bg-transparent outline-none"
                            onClick={toggleConfirmPassword}
                        >
                            {hideConfirmPassword ? (
                                <img src="/assets/icons/Eyes.svg" alt="Hide Password" />
                            ) : (
                                <img src="/assets/icons/Eye.svg" alt="Reveal Password" />
                            )}
                        </button>
                    </div>
                    <div className="">
                        <Button background="blue" title="Change Password " fullWidth height="56px" />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#d1d1d1]"></div>
                <div className="space-y-[14px]">
                    <button className="h-[48px] w-full rounded-[100px] bg-[#f4f4f4] text-center font-eudoxus text-[16px] font-[500] leading-[24px] text-[#1a1a1a]">
                        Deactivate account
                    </button>
                    <p className="text-center text-[12px] font-[400] leading-[20px] text-[#767676]">
                        Deactivating will suspend your account until you sign back in.
                    </p>
                </div>
                <div className="space-y-[14px]">
                    <button className="h-[48px] w-full rounded-[100px] bg-[#f4f4f4] text-center font-eudoxus text-[16px] font-[500] leading-[24px] text-[#1a1a1a]">
                        Delect account
                    </button>
                    <p className="text-center text-[12px] font-[400] leading-[20px] text-[#767676]">
                        Permanently delete your account and all of your content.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogSettings;
