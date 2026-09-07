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
    /** Honeypot. Hidden from people, so anything here means a bot. */
    company?: string;
};

/** Kept in step with the limits the API enforces. */
const MAX = { fullName: 120, email: 254, message: 5000 };

export const ContactForm = () => {
    const [loading, setloading] = useState<boolean>(false);

    const [formState, setFormState] = useState<FormLabel | undefined>({
        fullName: '',
        email: '',
        message: '',
        company: '',
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
            const response = await axios.post('/api/contact', {
                fullName: formState?.fullName,
                email: formState?.email || '',
                message: formState?.message || '',
                company: formState?.company || '',
            });
            showSuccessToast({ message: response?.data?.message, description: response?.data?.description });
            setFormState({ company: '', email: '', fullName: '', message: '' });
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
        <div className="col-span-6 lg:h-full">
            <div className="rounded-xl bg-[#1a1a1a] p-6 md:p-12 lg:flex lg:h-full lg:flex-col">
                <form name="contactForm" onSubmit={onSubmitForm} className="flex flex-col lg:h-full lg:justify-between">
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <div className="relative overflow-hidden">
                            {/* The placeholder is not an accessible name: it disappears on the
                                first keystroke and is not reliably announced. Each field gets a
                                real label, visually hidden so the design is unchanged. */}
                            <label htmlFor="contact-full-name" className="sr-only">
                                Your name
                            </label>
                            <input
                                id="contact-full-name"
                                type="text"
                                name="fullName"
                                required
                                maxLength={MAX.fullName}
                                autoComplete="name"
                                value={formState?.fullName}
                                className="mt-4 w-full text-ellipsis border-b-[1px] border-[#333] bg-transparent pb-2 pt-4 font-medium text-[#8a8a8a] outline-none placeholder:text-[14px] placeholder:font-[400] placeholder:text-[#8A8A8A]"
                                onChange={onFormChange}
                                placeholder="Your Name *"
                            />
                        </div>
                        <div className="relative overflow-hidden">
                            <label htmlFor="contact-email" className="sr-only">
                                Your email address
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                required
                                maxLength={MAX.email}
                                autoComplete="email"
                                placeholder="Your Email *"
                                value={formState?.email}
                                onChange={onFormChange}
                                className="mt-4 w-full text-ellipsis border-b-[1px] border-[#333] bg-transparent pb-2 pt-4 font-medium text-[#8a8a8a] outline-none placeholder:text-[14px] placeholder:font-[400] placeholder:text-[#8A8A8A]"
                            />
                        </div>
                        <div className="relative overflow-hidden">
                            <label htmlFor="contact-message" className="sr-only">
                                Your message
                            </label>
                            <textarea
                                id="contact-message"
                                name="message"
                                required
                                maxLength={MAX.message}
                                value={formState?.message}
                                onChange={onFormChange}
                                className="mt-4 w-full text-ellipsis border-b-[1px] border-[#333] bg-transparent pb-2 pt-4 font-medium text-[#8a8a8a] outline-none placeholder:text-[14px] placeholder:font-[400] placeholder:text-[#8A8A8A]"
                                placeholder="Enter Message Here *"
                            />
                        </div>
                    </div>
                    {/* Honeypot: hidden from people and from assistive tech, so a
                        filled value means the submission came from a bot. */}
                    <input
                        type="text"
                        name="company"
                        value={formState?.company}
                        onChange={onFormChange}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    <div className="mt-10 lg:mt-0">
                        <div className="text-sm font-normal leading-[24px] text-[#a3a3a3]">
                            By clicking Submit, I consent to the{' '}
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href="/legal/privacy-policy"
                                className="text-white underline"
                            >
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
