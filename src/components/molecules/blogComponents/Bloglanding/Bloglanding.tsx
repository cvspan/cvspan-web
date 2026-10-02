'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

/** Compact blog header: a title, one line of context and a search box that filters the list below. */
const SEARCH_DELAY_MS = 350;

const Bloglanding = ({
    query = '',
    onSearch,
    searching = false,
}: {
    query?: string;
    /** `live` is true while typing (results follow along without adding history entries). */
    onSearch: (query: string, live?: boolean) => void;
    searching?: boolean;
}) => {
    const [value, setValue] = useState(query);
    /** The last term sent, so the results arriving for it don't overwrite what has been typed since. */
    const lastSent = useRef(query);

    // Keep the box in step with the address when it changes from elsewhere (back button, "clear search").
    useEffect(() => {
        if (query !== lastSent.current) {
            lastSent.current = query;
            setValue(query);
        }
    }, [query]);

    // Search as you type, a moment after you pause.
    useEffect(() => {
        const term = value.trim();
        if (term === lastSent.current) return;
        const timer = setTimeout(() => {
            lastSent.current = term;
            onSearch(term, true);
        }, SEARCH_DELAY_MS);
        return () => clearTimeout(timer);
    }, [value, onSearch]);

    return (
        <div className="relative overflow-hidden bg-[#0c0c0c]">
            <img
                src="/assets/images/homepage_banner.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-10 opacity-60"
            />
            <div className="relative z-20 mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-12 pt-32 lg:pb-16 lg:pt-40">
                <div className="flex max-w-[640px] flex-col gap-3">
                    <h1 className="font-pp-mori text-[36px] font-semibold leading-[44px] text-white lg:text-[56px] lg:leading-[64px]">
                        Blog &amp; Articles
                    </h1>
                    <motion.p
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="font-eudoxus text-[16px] leading-[24px] text-[#D1D1D1]"
                    >
                        Product design, research and development notes from the CVSpan team.
                    </motion.p>
                </div>

                <motion.form
                    {...ANIMATE_PROPS({ delay: 0.1 })}
                    role="search"
                    onSubmit={(event) => {
                        // Enter or the button searches straight away, without waiting for the pause.
                        event.preventDefault();
                        lastSent.current = value.trim();
                        onSearch(value.trim());
                    }}
                    className="flex w-full max-w-[560px] items-center gap-2 rounded-full border border-[#3A3A3A] bg-[#1A1A1A] p-1 focus-within:border-[#6B6BFF]"
                >
                    <img src="/assets/icons/Vector.png" alt="" aria-hidden className="ml-3 size-5 shrink-0" />
                    <input
                        type="search"
                        name="q"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        maxLength={80}
                        aria-label="Search articles"
                        placeholder="Search articles"
                        className="h-10 min-w-0 flex-1 bg-transparent font-eudoxus text-[16px] text-white outline-none placeholder:text-[#8A8A8A]"
                    />
                    <button
                        type="submit"
                        aria-busy={searching}
                        className="h-10 shrink-0 rounded-full bg-[#1A1AFF] px-5 font-eudoxus text-[14px] font-medium text-white transition hover:opacity-80"
                    >
                        Search
                    </button>
                </motion.form>
            </div>
        </div>
    );
};

export default Bloglanding;
