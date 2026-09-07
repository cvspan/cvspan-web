import React from 'react';
import Link from 'next/link';
import { NavbarList, SubNavbarList } from '../types';
import { motion } from 'framer-motion';

/**
 * Shared shell for both mega menus.
 *
 * `overflow-hidden` lets the rounded corners clip the blue panel cleanly, so
 * the two halves can never disagree about their radius. The hairline border
 * gives the white surface a defined edge that a soft shadow alone cannot.
 */
const MenuSurface = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    // Positioning is handled by the trigger's HoverCardContent (aligned to the
    // menu item, offset 200px left), so this is just the surface itself.
    <div
        className={`z-[1000] max-w-full overflow-hidden rounded-xl bg-white shadow-menu ring-1 ring-[rgba(16,24,40,0.06)] ${className}`}
    >
        {children}
    </div>
);

/** One service/industry entry. */
const MenuItem = ({ item }: { item: SubNavbarList }) => (
    <li>
        <Link
            href={item.link}
            className="group/item -mx-3 flex items-center gap-x-4 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-[#F5F6FF] focus-visible:bg-[#F5F6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1AFF]/40"
        >
            {/* No fill behind the icon: these glyphs are a pale #D1D1FF drawn for a
                white surface, so any grey tint behind them destroys the contrast. */}
            <span className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center">
                <img
                    src={item.icon}
                    alt=""
                    className="max-h-[36px] max-w-[36px] object-contain"
                    loading="lazy"
                    decoding="async"
                />
            </span>

            <span className="min-w-0">
                <span className="block font-eudoxus text-base font-medium leading-tight text-[#1a1a1a] transition-colors duration-150 group-hover/item:text-[#1A1AFF]">
                    {item.title}
                </span>
                <span className="mt-1 hidden font-eudoxus text-xs leading-snug text-[#767676] lg:block">
                    {item.caption}
                </span>
            </span>
        </Link>
    </li>
);

/** One labelled column of entries. */
const MenuColumn = ({ group }: { group: NavbarList }) => (
    <div>
        {group.title ? (
            // Navigation label, deliberately not a heading: the menu renders
            // above the page's <h1> and should not sit in the document outline.
            <p className="mb-5 font-eudoxus text-xs font-medium uppercase tracking-[0.08em] text-[#a3a3a3]">
                {group.title}
            </p>
        ) : null}
        <ul className="grid list-none gap-y-1">
            {group.list.map((item: SubNavbarList) => (
                <MenuItem key={item.id} item={item} />
            ))}
        </ul>
    </div>
);

// Type is scaled to the 250px card: at the previous 40px/30px sizes the heading
// broke to four lines and "LET'S TALK" wrapped onto two.
const LetsTalk = () => (
    <div className="bg relative flex h-full flex-col justify-between p-8">
        <div className="flex flex-col gap-y-3">
            <p className="font-eudoxus text-[26px] font-extrabold leading-[1.15] text-white">HAVE AN IDEA IN MIND</p>

            <p className="font-eudoxus text-sm font-normal leading-relaxed text-white/80">
                Let’s create amazing digital experiences together
            </p>
        </div>

        <Link href={'/contact'} className="mt-auto inline-block">
            <motion.span
                whileHover="on_hover"
                initial="rest"
                className="group inline-flex items-center gap-x-3 whitespace-nowrap font-eudoxus text-[21px] leading-[28px] text-white"
            >
                <span className="transition-colors duration-150 group-hover:text-white/80">LET’S TALK</span>

                <span className="relative block h-[26px] w-[26px] flex-shrink-0">
                    <motion.img
                        variants={{ rest: { x: 0, y: 0, opacity: 1 }, on_hover: { x: 24, y: -24, opacity: 0 } }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        src="/assets/icons/arrow-up-big-white.svg"
                        className="absolute inset-0 h-full w-full"
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                    <motion.img
                        variants={{ rest: { x: -24, y: 24, opacity: 0 }, on_hover: { x: 0, y: 0, opacity: 1 } }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        src="/assets/icons/arrow-up-big-white.svg"
                        className="absolute inset-0 h-full w-full"
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                </span>
            </motion.span>
        </Link>
    </div>
);

export const NavDropDownService = ({ links }: { links: NavbarList[] }) => {
    // 970px total = 720 for the links (40 padding + 300 + 40 gap + 300 + 40 padding)
    // alongside a fixed 250px CTA. The CTA is the only fixed track, so the two link
    // columns resolve to exactly 300px each and shrink together on narrower screens
    // rather than clipping.
    return (
        <MenuSurface className="lg:grid lg:w-[970px] lg:grid-cols-[1fr_250px]">
            <div>
                <div className="grid gap-x-10 gap-y-10 p-10 lg:grid-cols-2">
                    {links.map((group: NavbarList) => (
                        <MenuColumn key={group.id} group={group} />
                    ))}
                </div>
            </div>

            <div className="hidden lg:block">
                <LetsTalk />
            </div>
        </MenuSurface>
    );
};

export const NavDropDownIndustry = ({ links }: { links: NavbarList[] }) => {
    // One column of industries, so 630px = 40 + 300 + 40 padding, plus the same
    // fixed 250px CTA used by the services menu.
    return (
        <MenuSurface className="grid w-[630px] grid-cols-[1fr_250px]">
            <div>
                <div className="grid gap-y-10 p-10">
                    {links.map((group: NavbarList) => (
                        <MenuColumn key={group.id} group={group} />
                    ))}
                </div>
            </div>

            <div className="block">
                <LetsTalk />
            </div>
        </MenuSurface>
    );
};
