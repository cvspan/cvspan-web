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
                <div className="mt-6">
                    <h3 className="text-base font-medium text-slate-1000">Offices</h3>
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
        <div className="col-span-4">
            <ul className="grid list-none gap-x-8" role="list">
                {FOOTER_LINKS.map((link: FooterLink) => (
                    <li key={link.id} className="row-start-2 place-self-start" role="listitem">
                        <h3 className="text-base font-medium text-slate-1000">{link.text}</h3>
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
        <ul className="list-none">
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
        <div className="grid auto-cols-fr grid-cols-6">
            <FooterOfficeAddress />
            <FooterPrimaryLinks />
        </div>
    );
};

export const SecondaryFooter = () => {
    return (
        <div>
            <div className="flex flex-row items-center">
                <div className="flex flex-grow flex-row">
                    <div className="mr-8">
                        <div className="font-normal leading-snug">© 2024 CVSpan. All rights reserved.</div>
                    </div>
                    <FooterThirdPartyLinks />
                </div>
                <div className="flex flex-grow justify-end gap-x-4">
                    {SOCIALS.map((social: Social) => (
                        <SecondaryFooterLink social={social} key={social.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};
