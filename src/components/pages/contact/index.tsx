import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';

import { ContactForm } from '@/components/molecules/Contact/ContactForm';
import { ContactAside } from '@/components/molecules/Contact/ContactAside';
import { ContactSocials } from '@/components/molecules/Contact/ContactSocial';

export default function ContactPage() {
    return (
        <section>
            <Navbar light />
            <div className="mt-9 bg-[#050505] px-5 pb-12 pt-[60px] md:pb-[110px]">
                <div className="mx-auto w-full max-w-[1200px]">
                    <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12">
                        <ContactAside />
                        <ContactForm />
                        <ContactSocials />
                    </div>
                </div>
            </div>
        </section>
    );
}
