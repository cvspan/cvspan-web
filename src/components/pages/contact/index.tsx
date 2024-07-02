import React from 'react';

import { ContactForm } from '@/components/molecules/Contact/ContactForm';
import { ContactAside } from '@/components/molecules/Contact/ContactAside';
import { ContactSocials } from '@/components/molecules/Contact/ContactSocial';

export default function ContactPage() {
    return (
        <section>
            <div className="bg-[#050505] pb-[110px]">
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
