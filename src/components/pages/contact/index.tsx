import React from 'react';
import { ContactForm } from '@/components/molecules/Contact/ContactForm';
import { ContactAside } from '@/components/molecules/Contact/ContactAside';

export default function ContactPage() {
    return (
        <section>
            <div className="bg-[#050505] pb-[110px]">
                <div className="mx-auto w-full max-w-[1200px]">
                    <div className="grid grid-cols-12">
                        <ContactAside />
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
