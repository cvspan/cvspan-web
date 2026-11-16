import React from 'react';
import Link from 'next/link';

import Image from 'next/image';

import { Address, THIRD_PARTY_LINK, FooterLink } from '../types';
import { ADDRESSES, FOOTER_LINKS, THIRD_PARTY_LINKS } from '../data';
import { cn } from '@/lib/utils';
import ComingSoonBadge from '@/components/molecules/ComingSoonBadge';

/** The portal is a separate app served under /portal, so it needs a full page load, not client-side routing. */
const LinkTag = ({ href, ...props }: React.ComponentProps<typeof Link>) =>
    typeof href === 'string' && href.startsWith('/portal') ? (
        <a href={href} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />
    ) : (
        <Link href={href} {...props} />
    );

const FooterOfficeAddress = () => {
    return (
        <div className="col-span-2 lg:col-span-1">
            <div>
                <Link href="/" className="relative box-border block">
                    <Image src="/assets/images/logo.svg" width={152} height={31} alt="Cvspan logo" />
                </Link>
                <div className="mt-6 hidden lg:block">
                    <h3 className="text-[16px] font-medium text-[#1A1A1A]">Address</h3>
                    <div>
                        <ul className="list-none" role="list">
                            {ADDRESSES.map((address: Address) => (
                                <li key={address.id} className="mt-6">
                                    <span className="text-[14px] font-normal text-[#484848]">
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
        <div className="col-span-2 lg:col-span-1">
            <ul className="grid list-none grid-cols-2 gap-5 md:gap-x-8 lg:grid-cols-4" role="list">
                {FOOTER_LINKS.map((link: FooterLink) => (
                    <li key={link.id} role="listitem">
                        <h3 className="text-[16px] font-medium text-[#1A1A1A]">{link.text}</h3>
                        <ul className="mt-6 list-none">
                            {link.links.map((subLink: THIRD_PARTY_LINK) => (
                                <li className="pt-2" role="listitem" key={subLink.id}>
                                    <div className="flex items-center gap-[8px]">
                                        {subLink?.disabled ? (
                                            <div
                                                className={cn(
                                                    'flex cursor-not-allowed items-center text-[14px] font-normal text-[#484848]',
                                                )}
                                            >
                                                <span>{subLink.text}</span>
                                            </div>
                                        ) : (
                                            <LinkTag
                                                href={subLink.link}
                                                // py/-my pair grows the touch area into the gap between
                                                // rows without moving anything: the text was only 21px
                                                // tall, below the 24px WCAG 2.5.8 minimum.
                                                className={cn(
                                                    '-my-1 inline-block py-1 text-[14px] font-normal text-[#484848] hover:underline',
                                                )}
                                            >
                                                {subLink.text}
                                            </LinkTag>
                                        )}

                                        {subLink?.comingSoon ? <ComingSoonBadge /> : null}
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
        <ul className="order-2 flex list-none flex-row gap-x-4" role="list">
            {THIRD_PARTY_LINKS.map((link: THIRD_PARTY_LINK) => (
                <li key={link.id}>
                    <Link
                        href={link?.link}
                        className="-my-1 inline-block py-1 text-[14px] font-normal text-[#484848] underline"
                    >
                        {link.text}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export const PrimaryFooter = () => {
    return (
        <div className="grid auto-cols-fr gap-y-[35px] lg:grid-cols-[30%_70%]">
            <FooterOfficeAddress />
            <FooterPrimaryLinks />
        </div>
    );
};
const SocialHandles = () => {
    return (
        <div className="order-3 flex flex-grow gap-x-4 lg:justify-end">
            <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/cvspanofficial"
                className="relative flex h-8 w-8 items-center overflow-hidden rounded-full bg-[#484848] p-2 opacity-80 hover:opacity-100"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.8189 0H1.18111C0.867861 0 0.567441 0.124438 0.34594 0.34594C0.124438 0.567441 0 0.867861 0 1.18111V14.8189C0 15.1321 0.124438 15.4326 0.34594 15.6541C0.567441 15.8756 0.867861 16 1.18111 16H14.8189C15.1321 16 15.4326 15.8756 15.6541 15.6541C15.8756 15.4326 16 15.1321 16 14.8189V1.18111C16 0.867861 15.8756 0.567441 15.6541 0.34594C15.4326 0.124438 15.1321 0 14.8189 0ZM4.76889 13.63H2.36333V5.98889H4.76889V13.63ZM3.56445 4.93C3.29158 4.92846 3.02528 4.84613 2.79916 4.69339C2.57304 4.54065 2.39723 4.32435 2.29392 4.07179C2.19061 3.81923 2.16443 3.54173 2.21869 3.2743C2.27294 3.00688 2.4052 2.76152 2.59877 2.56919C2.79234 2.37686 3.03854 2.24618 3.30631 2.19364C3.57408 2.1411 3.85141 2.16906 4.1033 2.27399C4.35519 2.37892 4.57036 2.55611 4.72164 2.78321C4.87293 3.01031 4.95355 3.27713 4.95333 3.55C4.95591 3.73269 4.92167 3.91403 4.85267 4.0832C4.78368 4.25238 4.68132 4.40593 4.55171 4.53471C4.42211 4.66349 4.2679 4.76486 4.09828 4.83277C3.92867 4.90068 3.74711 4.93375 3.56445 4.93ZM13.6356 13.6367H11.2311V9.46222C11.2311 8.23111 10.7078 7.85111 10.0322 7.85111C9.31889 7.85111 8.61889 8.38889 8.61889 9.49333V13.6367H6.21333V5.99445H8.52667V7.05333H8.55778C8.79 6.58333 9.60333 5.78 10.8444 5.78C12.1867 5.78 13.6367 6.57667 13.6367 8.91L13.6356 13.6367Z"
                        fill="white"
                    />
                </svg>
            </Link>

            <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/cvspanofficial"
                className="relative flex h-8 w-8 items-center overflow-hidden rounded-full bg-[#484848] p-2 opacity-80 hover:opacity-100"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_4606_3510)">
                        <path
                            d="M8.00001 1.44184C10.1374 1.44184 10.3883 1.45137 11.233 1.48948C12.0143 1.52441 12.4367 1.65462 12.7193 1.76578C13.0941 1.91187 13.3609 2.08337 13.6403 2.36284C13.9198 2.64232 14.0945 2.90909 14.2374 3.28384C14.3454 3.56649 14.4788 3.98888 14.5137 4.77015C14.5518 5.61493 14.5613 5.86582 14.5613 8.00318C14.5613 10.1405 14.5518 10.3914 14.5137 11.2362C14.4788 12.0175 14.3486 12.4399 14.2374 12.7225C14.0913 13.0973 13.9198 13.364 13.6403 13.6435C13.3609 13.923 13.0941 14.0977 12.7193 14.2406C12.4367 14.3486 12.0143 14.4819 11.233 14.5169C10.3883 14.555 10.1374 14.5645 8.00001 14.5645C5.86265 14.5645 5.61175 14.555 4.76697 14.5169C3.98571 14.4819 3.56332 14.3517 3.28067 14.2406C2.90592 14.0945 2.63914 13.923 2.35967 13.6435C2.08019 13.364 1.90552 13.0973 1.76261 12.7225C1.65463 12.4399 1.52124 12.0175 1.48631 11.2362C1.44819 10.3914 1.43867 10.1405 1.43867 8.00318C1.43867 5.86582 1.44819 5.61493 1.48631 4.77015C1.52124 3.98888 1.65145 3.56649 1.76261 3.28384C1.9087 2.90909 2.08019 2.64232 2.35967 2.36284C2.63914 2.08337 2.90592 1.90869 3.28067 1.76578C3.56332 1.6578 3.98571 1.52441 4.76697 1.48948C5.61175 1.44819 5.86582 1.44184 8.00001 1.44184ZM8.00001 0C5.82771 0 5.55459 0.00952759 4.70028 0.047638C3.84915 0.0857483 3.26797 0.22231 2.75983 0.419214C2.23263 0.622469 1.78801 0.898769 1.34339 1.34339C0.89877 1.78801 0.625646 2.23581 0.419214 2.75983C0.222311 3.26796 0.0857484 3.84915 0.047638 4.70345C0.0095276 5.55459 0 5.82771 0 8C0 10.1723 0.0095276 10.4454 0.047638 11.2997C0.0857484 12.1509 0.222311 12.732 0.419214 13.2434C0.62247 13.7705 0.89877 14.2152 1.34339 14.6598C1.78801 15.1044 2.23581 15.3775 2.75983 15.584C3.26797 15.7809 3.84915 15.9174 4.70346 15.9555C5.55777 15.9936 5.82771 16.0032 8.00318 16.0032C10.1786 16.0032 10.4486 15.9936 11.3029 15.9555C12.154 15.9174 12.7352 15.7809 13.2465 15.584C13.7737 15.3807 14.2184 15.1044 14.663 14.6598C15.1076 14.2152 15.3807 13.7674 15.5871 13.2434C15.7841 12.7352 15.9206 12.154 15.9587 11.2997C15.9968 10.4454 16.0064 10.1755 16.0064 8C16.0064 5.82453 15.9968 5.55458 15.9587 4.70028C15.9206 3.84915 15.7841 3.26796 15.5871 2.75665C15.3839 2.22946 15.1076 1.78484 14.663 1.34021C14.2184 0.895594 13.7706 0.622469 13.2465 0.416038C12.7384 0.219135 12.1572 0.0825724 11.3029 0.0444621C10.4454 0.00952759 10.1723 0 8.00001 0Z"
                            fill="white"
                        />
                        <path
                            d="M8.00001 1.44184C10.1374 1.44184 10.3883 1.45137 11.233 1.48948C12.0143 1.52441 12.4367 1.65462 12.7193 1.76578C13.0941 1.91187 13.3609 2.08337 13.6403 2.36284C13.9198 2.64232 14.0945 2.90909 14.2374 3.28384C14.3454 3.56649 14.4788 3.98888 14.5137 4.77015C14.5518 5.61493 14.5613 5.86582 14.5613 8.00318C14.5613 10.1405 14.5518 10.3914 14.5137 11.2362C14.4788 12.0175 14.3486 12.4399 14.2374 12.7225C14.0913 13.0973 13.9198 13.364 13.6403 13.6435C13.3609 13.923 13.0941 14.0977 12.7193 14.2406C12.4367 14.3486 12.0143 14.4819 11.233 14.5169C10.3883 14.555 10.1374 14.5645 8.00001 14.5645C5.86265 14.5645 5.61175 14.555 4.76697 14.5169C3.98571 14.4819 3.56332 14.3517 3.28067 14.2406C2.90592 14.0945 2.63914 13.923 2.35967 13.6435C2.08019 13.364 1.90552 13.0973 1.76261 12.7225C1.65463 12.4399 1.52124 12.0175 1.48631 11.2362C1.44819 10.3914 1.43867 10.1405 1.43867 8.00318C1.43867 5.86582 1.44819 5.61493 1.48631 4.77015C1.52124 3.98888 1.65145 3.56649 1.76261 3.28384C1.9087 2.90909 2.08019 2.64232 2.35967 2.36284C2.63914 2.08337 2.90592 1.90869 3.28067 1.76578C3.56332 1.6578 3.98571 1.52441 4.76697 1.48948C5.61175 1.44819 5.86582 1.44184 8.00001 1.44184Z"
                            fill="white"
                        />
                        <path
                            d="M8.00019 3.89355C5.73263 3.89355 3.89062 5.73238 3.89062 8.00312C3.89062 10.2739 5.72945 12.1127 8.00019 12.1127C10.2709 12.1127 12.1098 10.2739 12.1098 8.00312C12.1098 5.73238 10.2709 3.89355 8.00019 3.89355ZM8.00019 10.6677C6.52659 10.6677 5.33247 9.47354 5.33247 7.99994C5.33247 6.52634 6.52659 5.33222 8.00019 5.33222C9.47379 5.33222 10.6679 6.52634 10.6679 7.99994C10.6679 9.47354 9.47379 10.6677 8.00019 10.6677Z"
                            fill="#484848"
                        />
                        <path
                            d="M12.2716 4.68763C12.8013 4.68763 13.2307 4.25822 13.2307 3.72852C13.2307 3.19882 12.8013 2.76941 12.2716 2.76941C11.7419 2.76941 11.3125 3.19882 11.3125 3.72852C11.3125 4.25822 11.7419 4.68763 12.2716 4.68763Z"
                            fill="#484848"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_4606_3510">
                            <rect width="16" height="16" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </Link>

            <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/CVSpanOfficial"
                className="relative flex h-8 w-8 items-center overflow-hidden rounded-full bg-[#484848] p-2 opacity-80 hover:opacity-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M11.4758 8.88583L11.8904 6.15573H9.2968V4.38486C9.2968 3.63777 9.65845 2.90913 10.8201 2.90913H12V0.584857C12 0.584857 10.9297 0.400391 9.90685 0.400391C7.76986 0.400391 6.37443 1.70826 6.37443 4.07495V6.15573H4V8.88583H6.37443V15.486C6.85114 15.5617 7.33881 15.6004 7.83562 15.6004C8.33242 15.6004 8.82009 15.5617 9.2968 15.486V8.88583H11.4758Z"
                        fill="white"
                    />
                </svg>
            </Link>

            <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://x.com/Cvspanofficial"
                className="relative flex h-8 w-8 items-center overflow-hidden rounded-full bg-[#484848] p-2 opacity-80 hover:opacity-100"
            >
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.74142 0H0.185547L6.77281 8.70099L0.606948 16H3.45576L8.11925 10.4795L12.2602 15.9492H17.8161L11.0374 6.99536L11.0494 7.0108L16.886 0.101605H14.0372L9.7028 5.23251L5.74142 0ZM3.2523 1.52382H4.98193L14.7494 14.4254H13.0197L3.2523 1.52382Z"
                        fill="white"
                    />
                </svg>
            </Link>

            <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.tiktok.com/@cvspanofficial"
                className="relative flex h-8 w-8 items-center overflow-hidden rounded-full bg-[#484848] p-2 opacity-80 hover:opacity-100"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.4927 0H8.73041V10.8985C8.73041 12.1971 7.66803 13.2638 6.34593 13.2638C5.02384 13.2638 3.96145 12.1971 3.96145 10.8985C3.96145 9.6232 5.00023 8.57969 6.27512 8.53333V5.79711C3.46566 5.84347 1.19922 8.09276 1.19922 10.8985C1.19922 13.7276 3.51288 16 6.36955 16C9.22619 16 11.5398 13.7044 11.5398 10.8985V5.31013C12.5786 6.05218 13.8535 6.49276 15.1992 6.51596V3.77971C13.1217 3.71015 11.4927 2.04058 11.4927 0Z"
                        fill="white"
                    />
                </svg>
            </Link>

            <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/@cvspantv"
                className="relative flex h-8 w-8 items-center overflow-hidden rounded-full bg-[#484848] p-2 opacity-80 hover:opacity-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path
                        d="M15.6704 2.15327C15.4859 1.46793 14.9456 0.927571 14.2602 0.743058C13.0082 0.400391 7.99997 0.400391 7.99997 0.400391C7.99997 0.400391 2.99175 0.400391 1.7397 0.729878C1.06754 0.914392 0.514001 1.46793 0.329488 2.15327C0 3.40532 0 6.00168 0 6.00168C0 6.00168 0 8.61123 0.329488 9.8501C0.514001 10.5354 1.05436 11.0758 1.7397 11.2603C3.00493 11.603 7.99997 11.603 7.99997 11.603C7.99997 11.603 13.0082 11.603 14.2602 11.2735C14.9456 11.089 15.4859 10.5486 15.6704 9.86328C15.9999 8.61123 15.9999 6.01486 15.9999 6.01486C15.9999 6.01486 16.0131 3.40532 15.6704 2.15327Z"
                        fill="white"
                    />
                    <path d="M6.40527 8.39988L10.57 6.00121L6.40527 3.60254V8.39988Z" fill="#484848" />
                </svg>
            </Link>
        </div>
    );
};
export const SecondaryFooter = () => {
    return (
        <div>
            <div className="flex flex-col gap-y-8 md:items-center lg:flex-row">
                <div className="order-1 lg:mr-8">
                    <div className="text-[14px] font-normal text-[#484848]">© 2024 CVSpan. All rights reserved.</div>
                </div>
                <FooterThirdPartyLinks />
                <SocialHandles />
            </div>
        </div>
    );
};
