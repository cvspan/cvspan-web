'use client';
import React, { useState } from 'react';
import Button from '../../Button';
import Link from 'next/link';

type Props = {};

const ResetPassword = (props: Props) => {
    const [hidePassword, setHidePassword] = useState<boolean | true>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean | true>(true);
    const togglePassword = () => setHidePassword((prevState: boolean) => !prevState);
    const toggleConfirmPassword = () => setHideConfirmPassword((prevState: boolean) => !prevState);
    return (
        <div className="h-[780px] w-full">
            <div className="flex h-full w-full items-center justify-center">
                <div className="w-[453px] space-y-[40px]">
                    <div className="">
                        <h3 className="text-center font-eudoxus text-[42px] font-[500] leading-[54px] text-[#1a1a1a]">
                            Create New Password
                        </h3>
                    </div>
                    <div className="space-y-[16px]">
                        <div className="w-full space-y-[16px]">
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
                        </div>
                        <div className="">
                            <Button background="blue" title="Login" fullWidth height="56px" />
                        </div>
                        <div className="flex justify-center">
                            <p className="flex gap-[4px] text-center font-pp-mori text-[14px] font-[400] leading-[22px] text-[#000]">
                                Remember your Password?
                                <Link href={'/'}>
                                    <span className="font-[500] text-[#1a1aff]">
                                        {' '}
                                        <span className="font-[500] text-[#1a1aff]"> Sign In</span>
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </div>
                    <p className="text-center text-[14px] font-[400] leading-[22px] text-[#767676]">
                        Click “Sign in” to agree to Medium’s
                        <Link href={'/'} className="underline">
                             Terms of Service 
                        </Link>
                        and acknowledge that Medium’s 
                        <Link href={'/'} className="underline">
                            Privacy Policy 
                        </Link>
                        applies to you.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
