'use client';
import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';

import { ContactForm } from '@/components/molecules/Contact/ContactForm';
import { ContactAside } from '@/components/molecules/Contact/ContactAside';
import { ContactSocials } from '@/components/molecules/Contact/ContactSocial';

export default function ContactPage() {
    return (
        <section className="lg:h-dvh lg:overflow-hidden">
            <Navbar light={false} />
            <div className="flex flex-col bg-[#050505] px-5 pb-12 pt-[60px] md:pb-[110px] md:pt-[126px] lg:h-full lg:overflow-hidden lg:pb-10 lg:pt-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col lg:h-full">
                    <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10 lg:h-full lg:items-stretch">
                        <ContactAside />
                        <ContactForm />
                        <ContactSocials />
                    </div>
                </div>
            </div>
        </section>
    );
}
