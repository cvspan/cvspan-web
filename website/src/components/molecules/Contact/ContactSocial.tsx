import React from 'react';
import Link from 'next/link';

import { CONTACT_SOCIALS } from './socials';

/** Mobile-only social row; the desktop equivalent lives in ContactAside. */
export const ContactSocials = () => {
    return (
        <div className="col-span-6 block md:hidden">
            <div className="flex justify-center gap-x-3 md:justify-start">
                {CONTACT_SOCIALS.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        aria-label={`CVSpan on ${item.label}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block h-8 w-8 text-inherit no-underline"
                    >
                        <img
                            src={item.imageUrlInActive}
                            alt=""
                            className="absolute left-0 top-0 h-full w-full transition-all duration-100 ease-in-out group-hover:scale-0"
                        />
                        <img
                            src={item.imageUrlActive}
                            alt=""
                            className="absolute left-0 top-0 h-full w-full scale-0 transition-all duration-100 ease-in-out group-hover:scale-100"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};
