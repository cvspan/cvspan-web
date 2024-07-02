import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Address, THIRD_PARTY_LINK, Social, FooterLink } from '../types';
import { ADDRESSES, FOOTER_LINKS, SOCIALS, THIRD_PARTY_LINKS } from '../data';

const FooterOfficeAddress = () => {
    return (
        <div className="col-span-2">
            <div>
                <Link href="/" className="relative box-border block">
                    <Image src="/assets/images/logo.svg" width={152} height={31} alt="Cvspan logo" />
                </Link>
                <div className="mt-6 hidden lg:block">
                    <h3 className="text-slate-1000 text-base font-medium">Offices</h3>
                    <div>
                        <ul className="list-none" role="list">
                            {ADDRESSES.map((address: Address) => (
                                <li key={address.id} className="mt-6">
                                    <span className="text-slate-1050">
                                        <div>{address.region}</div>
                                        <div>{address.address}</div>
                                        <div>{address.phone}</div>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FooterPrimaryLinks = () => {
    return (
        <div className="col-span-2 lg:col-span-4">
            <ul className="grid list-none grid-cols-4 gap-5 md:gap-x-8" role="list">
                {FOOTER_LINKS.map((link: FooterLink) => (
                    <li key={link.id} className="col-span-2 place-self-start lg:row-start-1" role="listitem">
                        <h3 className="text-slate-1000 text-base font-medium">{link.text}</h3>
                        <ul className="mt-6 list-none">
                            {link.links.map((subLink: THIRD_PARTY_LINK) => (
                                <li className="pt-2" role="listitem" key={subLink.id}>
                                    <div className="flex">
                                        <Link href={subLink.link} className="text-slate-1050">
                                            {subLink.text}
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const FooterThirdPartyLinks = () => {
    return (
        <ul className="order-1 list-none lg:order-2">
            <div className="flex flex-row gap-x-4">
                {THIRD_PARTY_LINKS.map((link: THIRD_PARTY_LINK) => (
                    <li key={link.id}>
                        <div className="flex-shrink-0 flex-grow">
                            <Link href="/" className="font-normal leading-snug underline">
                                {link.text}
                            </Link>
                        </div>
                    </li>
                ))}
            </div>
        </ul>
    );
};

const SecondaryFooterLink = ({ social }: { social: Social }) => {
    return (
        <Link href="/" className="relative flex h-8 w-8 overflow-hidden rounded-full bg-slate-900 p-2">
            <Image className="rounded-full object-cover" src={social.asset} alt="social" width={16} height={16} />
        </Link>
    );
};

export const PrimaryFooter = () => {
    return (
        <div className="grid-cols-span-4 grid auto-cols-fr gap-y-[35px] lg:grid-cols-6">
            <FooterOfficeAddress />
            <FooterPrimaryLinks />
        </div>
    );
};

export const SecondaryFooter = () => {
    return (
        <div>
            <div className="flex flex-col gap-y-8 md:items-center lg:flex-row">
                <div className="order-3 mr-8 lg:order-1">
                    <div className="font-normal leading-snug">© 2024 CVSpan. All rights reserved.</div>
                </div>
                <FooterThirdPartyLinks />
                <div className="order-2 flex flex-grow gap-x-4 lg:order-3 lg:justify-end">
                    {SOCIALS.map((social: Social) => (
                        <SecondaryFooterLink social={social} key={social.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};
