'use client';

import React, { useState } from 'react';

interface FaqProps {
    id: number;
    question: string;
    answer: string;
}

/**
 * One row of the FAQ accordion.
 *
 * Two things matter for how this animates:
 *
 * Height is animated with a grid track going 0fr → 1fr rather than a guessed
 * max-height, so the motion always matches the real height of the answer and
 * never races ahead of it or clips long text.
 *
 * The answer stays in the DOM and is collapsed with CSS rather than unmounted.
 * Search engines only index text present in the HTML, so rendering it
 * conditionally would keep every answer out of the index, and out of the FAQ
 * rich result the page's JSON-LD asks for.
 *
 * The open state is carried on the border colour, not its width. The previous
 * version went from a 1px border to 4px, which moved every row below it by 3px
 * on each toggle — the jump that made the accordion feel unfinished.
 */
const Faq: React.FC<FaqProps> = ({ id, question, answer }) => {
    const [open, setOpen] = useState(false);

    const triggerId = `faq-trigger-${id}`;
    const answerId = `faq-answer-${id}`;

    return (
        <div
            className={`border-t transition-colors duration-500 ease-fluid motion-reduce:transition-none ${
                open ? 'border-white/70' : 'border-[#484848]'
            }`}
        >
            <h4>
                <button
                    type="button"
                    id={triggerId}
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-controls={answerId}
                    className="group flex w-full items-start gap-x-6 py-6 text-left md:gap-x-12 lg:gap-x-32 lg:py-10"
                >
                    <span
                        className={`w-8 shrink-0 pt-1 font-eudoxus text-sm tabular-nums transition-colors duration-300 ease-fluid motion-reduce:transition-none ${
                            open ? 'text-white' : 'text-[#A3A3A3] group-hover:text-white'
                        }`}
                    >
                        {String(id).padStart(2, '0')}
                    </span>

                    <span
                        className={`flex-1 font-eudoxus font-medium leading-snug transition-colors duration-300 ease-fluid motion-reduce:transition-none ${
                            open ? 'text-white' : 'text-[#A3A3A3] group-hover:text-white'
                        }`}
                        style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                    >
                        {question}
                    </span>

                    <span className="grid h-6 w-6 shrink-0 place-items-center pt-1">
                        <svg
                            className={`h-6 w-6 transition-transform duration-500 ease-fluid motion-reduce:transition-none ${
                                open ? 'rotate-180' : 'rotate-0'
                            }`}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M19 9L12 15L5 9"
                                className={`transition-colors duration-300 ${
                                    open ? 'stroke-white' : 'stroke-[#A3A3A3] group-hover:stroke-white'
                                }`}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </button>
            </h4>

            {/* The grid track is the only thing animating the height. */}
            <div
                id={answerId}
                role="region"
                aria-labelledby={triggerId}
                className={`grid transition-[grid-template-rows] duration-500 ease-fluid motion-reduce:transition-none ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    {/* Padding lines the answer up under the question rather than
                        under the number, matching the button's column gaps. */}
                    <p
                        className={`pb-6 pl-14 pr-10 font-eudoxus text-base font-normal leading-relaxed text-[#A3A3A3] transition-[opacity,transform] duration-500 ease-fluid motion-reduce:transition-none md:pl-20 lg:pb-10 lg:pl-40 lg:pr-12 ${
                            open ? 'translate-y-0 opacity-100 delay-100' : '-translate-y-1 opacity-0'
                        }`}
                    >
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Faq;
