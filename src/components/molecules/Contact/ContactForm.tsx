'use client';
import React, { ChangeEvent, useState } from 'react';
import Link from 'next/link';

type FormLabel = {
    name?: string;
    email?: string;
    message?: string;
};

export const ContactForm = () => {
    const [formState, setFormState] = useState<FormLabel | undefined>({
        name: '',
        email: '',
        message: '',
    });

    const onFormChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormState((prevValue) => ({
            ...prevValue,
            [e.target.name]: e.target.value.trim(),
        }));
    };
    return (
        <div className="col-span-6">
            <div className="rounded-2xl bg-[#1a1a1a] p-12">
                <form name="contactForm">
                    <div className="flex flex-col gap-10">
                        <div className="relative overflow-hidden">
                            <input
                                type="text"
                                name="name"
                                value={formState?.name}
                                className="w-full text-ellipsis bg-transparent py-4 font-medium text-[#8a8a8a] outline-none"
                                onChange={onFormChange}
                            />
                            <div className="absolute top-0 text-ellipsis whitespace-nowrap font-normal leading-[26px] text-[#8a8a8a]">
                                Your Name <sup>*</sup>{' '}
                            </div>
                        </div>
                        <div className="relative overflow-hidden">
                            <input
                                type="email"
                                name="email"
                                value={formState?.email}
                                onChange={onFormChange}
                                className="w-full text-ellipsis bg-transparent py-4 font-medium text-[#8a8a8a] outline-none"
                            />
                            <div className="absolute top-0 text-ellipsis whitespace-nowrap font-normal leading-[26px] text-[#8a8a8a]">
                                Your Email <sup>*</sup>{' '}
                            </div>
                        </div>
                        <div className="relative overflow-hidden">
                            <textarea
                                name="message"
                                value={formState?.message}
                                onChange={onFormChange}
                                className="w-full text-ellipsis bg-transparent py-4 font-medium text-[#8a8a8a] outline-none"
                            />
                            <div className="absolute top-0 text-ellipsis whitespace-nowrap font-normal leading-[26px] text-[#8a8a8a]">
                                Enter Message Here <sup>*</sup>{' '}
                            </div>
                        </div>
                    </div>
                    <div className="mt-[146px]">
                        <div className="text-sm font-normal leading-[24px] text-[#a3a3a3]">
                            By clicking Submit, I consent to the{' '}
                            <Link href="/" className="text-white underline">
                                privacy policy
                            </Link>{' '}
                            governing my service usage and provided personal data, respectively.
                        </div>
                        <div className="mt-8">
                            <button
                                type="button"
                                className="inline-flex gap-x-[10px] rounded-full bg-white px-8 py-4 text-base font-medium text-[#1a1a1a]"
                            >
                                Submit
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9 6.75C8.58579 6.75 8.25 6.41421 8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H18C18.4142 5.25 18.75 5.58579 18.75 6V15C18.75 15.4142 18.4142 15.75 18 15.75C17.5858 15.75 17.25 15.4142 17.25 15V7.81066L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L16.1893 6.75H9Z"
                                        fill="#1A1A1A"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
