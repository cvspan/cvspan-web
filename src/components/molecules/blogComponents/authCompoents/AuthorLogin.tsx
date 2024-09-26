'use client';
import React, { useState } from 'react';
import Button from '../../Button';
import Link from 'next/link';

type Props = {};

const AuthorLogin = (props: Props) => {
    const [hidePassword, setHidePassword] = useState<boolean | true>(true);
    const togglePassword = () => setHidePassword((prevState: boolean) => !prevState);
    return (
        <div className="h-[780px] w-full">
            <div className="flex h-full w-full items-center justify-center">
                <div className="w-[453px] space-y-[40px]">
                    <div className="">
                        <h3 className="text-center font-eudoxus text-[48px] font-[500] leading-[56px] text-[#1a1a1a]">
                            Welcome back.
                        </h3>
                    </div>
                    <div className="space-y-[16px]">
                        <div className="flex w-full cursor-pointer items-center justify-center gap-[12px] rounded-[100px] border-[1px] border-[#d1d1d1] px-[14px] py-[12px]">
                            <img src="/assets/icons/Google.svg" alt="" />
                            <p className="font-pp-mori text-[16px] font-[400] leading-[24px] text-[#000]">
                                Sign in with Google
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-grow border-t-[1px] border-[#d1d1d1]"></div>
                            <p className="mx-2 font-pp-mori text-[16px] font-[400] leading-[24px] text-[#1a1a1a]">OR</p>
                            <div className="flex-grow border-t-[1px] border-[#d1d1d1]"></div>
                        </div>
                        <div className="w-full space-y-[16px]">
                            <input
                                type="text"
                                className="paceholder:font-[400] w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-[#838383]"
                                placeholder="Email Address"
                            />
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    className="paceholder:font-[400] relative w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-[#838383]"
                                    placeholder="Password"
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
                        </div>
                        <div className="">
                            <Button background="blue" title="Login" fullWidth height="56px" />
                        </div>
                        <div className="flex justify-center">
                            <p className="flex gap-[4px] text-center font-pp-mori text-[14px] font-[400] leading-[22px] text-[#000]">
                                No Account?
                                <Link href={'/'}>
                                    <span className="font-[500] text-[#1a1aff]"> Sign Up</span>
                                </Link>
                            </p>
                        </div>
                        <div className="">
                            <p className="flex gap-[4px] text-center font-pp-mori text-[14px] font-[400] leading-[22px] text-[#767676]">
                                Forgot password or trouble signing in?
                                <Link href={'/'}>
                                    <span className="font-[500] text-[#1a1aff]"> Get Help</span>
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

export default AuthorLogin;
