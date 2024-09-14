'use client';
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '@/utils/toaster';

type FormLabel = {
    fullName?: string;
    email?: string;
    message?: string;
};

export const ContactForm = () => {
    const [loading, setloading] = useState<boolean>(false);

    const [formState, setFormState] = useState<FormLabel | undefined>({
        fullName: '',
        email: '',
        message: '',
    });

    const onFormChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormState((prevValue) => ({
            ...prevValue,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmitForm = async (e?: any) => {
        e.preventDefault();
        setloading(true);
        try {
            const response = await axios.post('https://api.arkson.dev/api/v1/website/contact-us/submit', {
                fullName: formState?.fullName,
                email: formState?.email || '',
                message: formState?.message || '',
            });
            showSuccessToast({ message: response?.data?.message, description: response?.data?.description });
            setFormState({ email: '', fullName: '', message: '' });
        } catch (error: any) {
            showErrorToast({
                message: error?.response?.data?.message || 'An error occured',
                description: error?.response?.data?.description || '',
            });
        } finally {
            setloading(false);
        }
    };

    return (
        <div className="col-span-6">
            <div className="rounded-2xl bg-[#1a1a1a] p-6 md:p-12">
                <form name="contactForm" onSubmit={onSubmitForm}>
                    <div className="flex flex-col gap-10">
                        <div className="relative overflow-hidden">
                            <input
                                type="text"
                                name="fullName"
                                value={formState?.fullName}
                                className="mt-4 w-full text-ellipsis border-b-[1px] border-[#333] bg-transparent pb-2 pt-4 font-medium text-[#8a8a8a] outline-none placeholder:text-[14px] placeholder:font-[400] placeholder:text-[#8A8A8A]"
                                onChange={onFormChange}
                                placeholder="Your Name *"
                            />
                        </div>
                        <div className="relative overflow-hidden">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email *"
                                value={formState?.email}
                                onChange={onFormChange}
                                className="mt-4 w-full text-ellipsis border-b-[1px] border-[#333] bg-red-400 bg-transparent pb-2 pt-4 font-medium text-[#8a8a8a] outline-none placeholder:text-[14px] placeholder:font-[400] placeholder:text-[#8A8A8A]"
                            />
                        </div>
                        <div className="relative overflow-hidden">
                            <textarea
                                name="message"
                                value={formState?.message}
                                onChange={onFormChange}
                                className="mt-4 w-full text-ellipsis border-b-[1px] border-[#333] bg-transparent pb-2 pt-4 font-medium text-[#8a8a8a] outline-none placeholder:text-[14px] placeholder:font-[400] placeholder:text-[#8A8A8A]"
                                placeholder="Enter Message Here *"
                            />
                        </div>
                    </div>
                    <div className="mt-[60px] md:mt-[146px]">
                        <div className="text-sm font-normal leading-[24px] text-[#a3a3a3]">
                            By clicking Submit, I consent to the{' '}
                            <Link target="_blank" href="/legal/privacy-policy" className="text-white underline">
                                privacy policy
                            </Link>{' '}
                            governing my service usage and provided personal data, respectively.
                        </div>
                        <div className="mt-8">
                            <Button
                                loading={loading}
                                title="Submit"
                                height="56px"
                                background="white-no-border"
                                rightIcon="/assets/icons/arrow_top_right_black.svg"
                                rightIconHover="/assets/icons/arrow-top-right-white.svg"
                                animateRightIconOnHover
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
