'use client';

import React, { useState } from 'react';
import Button from '@/components/molecules/Button';
import { submitApplication } from '@/lib/portal';

const fieldClass =
    'w-full rounded-[8px] border-[1px] border-[#D1D1D1] bg-white px-[16px] py-[12px] font-eudoxus text-[16px] text-[#1A1A1A] outline-none placeholder:text-[#A3A3A3] focus:border-[#1A1AFF]';

/** Application form for roles that take applications through the portal. */
const ApplyForm = ({ slug, title }: { slug: string; title: string }) => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (status === 'sending') return;
        const form = new FormData(event.currentTarget);
        setStatus('sending');
        setError(null);

        const failure = await submitApplication(slug, {
            name: String(form.get('name') ?? ''),
            email: String(form.get('email') ?? ''),
            message: String(form.get('message') ?? '') || undefined,
            portfolioUrl: String(form.get('portfolioUrl') ?? '') || undefined,
            website: String(form.get('website') ?? ''),
        });

        if (failure) {
            setError(failure);
            setStatus('idle');
        } else {
            setStatus('sent');
        }
    }

    if (status === 'sent') {
        return (
            <div id="apply" role="status" className="rounded-[8px] bg-[#F4F4F4] p-[24px]">
                <p className="mb-2 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1A1A1A]">
                    Application received
                </p>
                <p className="font-eudoxus text-[16px] text-[#484848]">
                    Thank you for applying for {title}. The team will be in touch by email.
                </p>
            </div>
        );
    }

    return (
        <form id="apply" onSubmit={onSubmit} className="flex scroll-mt-[100px] flex-col gap-[16px]">
            <p className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]">Apply for this role</p>

            <label className="flex flex-col gap-[6px] font-eudoxus text-[14px] text-[#1A1A1A]">
                Full name
                <input name="name" required minLength={2} maxLength={100} autoComplete="name" className={fieldClass} />
            </label>
            <label className="flex flex-col gap-[6px] font-eudoxus text-[14px] text-[#1A1A1A]">
                Email
                <input name="email" type="email" required maxLength={160} autoComplete="email" className={fieldClass} />
            </label>
            <label className="flex flex-col gap-[6px] font-eudoxus text-[14px] text-[#1A1A1A]">
                Portfolio or LinkedIn (optional)
                <input name="portfolioUrl" type="url" maxLength={300} placeholder="https://" className={fieldClass} />
            </label>
            <label className="flex flex-col gap-[6px] font-eudoxus text-[14px] text-[#1A1A1A]">
                Tell us about yourself (optional)
                <textarea name="message" rows={5} maxLength={2000} className={fieldClass} />
            </label>

            {/* Hidden from people; bots tend to fill it in, and the portal discards those applications. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                    Leave this empty
                    <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            {error && (
                <p role="alert" className="font-eudoxus text-[14px] text-[#B40000]">
                    {error}
                </p>
            )}

            <Button
                title={status === 'sending' ? 'SENDING…' : 'SUBMIT APPLICATION'}
                height="56px"
                loading={status === 'sending'}
            />
        </form>
    );
};

export default ApplyForm;
