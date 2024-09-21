import React from 'react';
import { NavLink } from '../../types';
import Link from 'next/link';
import ComingSoonBadge from '@/components/molecules/ComingSoonBadge';
import { cn } from '@/lib/utils';

const NavWithoutDropDown = ({ navLink }: { navLink: NavLink }) => {
    const className =
        'inline-flex items-center font-eudoxus text-[34px] font-medium leading-[39px] text-[#1a1a1a] lg:text-sm lg:font-normal lg:leading-[22px]';

    return (
        <div className="flex items-center gap-[8px]">
            {navLink?.disabled ? (
                <div className={cn(className, 'cursor-not-allowed text-[#767676] opacity-[60%]')}>{navLink.text}</div>
            ) : (
                <Link href={navLink.link} className={className}>
                    {navLink.text}
                </Link>
            )}

            {navLink?.comingSoon ? <ComingSoonBadge /> : null}
        </div>
    );
};

export { NavWithoutDropDown };
