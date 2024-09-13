import React from 'react';
import Link from 'next/link';
import { Team } from './types';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

import { cn } from '@/lib/utils';

// export const OurTeamItem = ({ item, index = 0 }: { item: Team; index?: number }) => {
//     return (
//         <motion.div
//             {...ANIMATE_PROPS({ delay: 0.2 * index })}
//             className="relative col-span-4 rounded-3xl bg-[#fafafa] grayscale transition-all duration-300 ease-in-out hover:grayscale-0"
//         >
//             <img src="/assets/images/team_card_bg.jpg" className="absolute left-0 top-0 h-full w-full" />
//             <div className="aspect-[16/9]">
//                 <div className="relative z-10 ms-8 mt-8 flex-grow-0">
//                     <div className="flex items-center justify-between">
//                         <span className="max-w-[300px]">
//                             <div className="font-eudoxus overflow-auto text-ellipsis whitespace-nowrap text-2xl font-medium leading-[32px] text-[#1a1a1a]">
//                                 {item.name}
//                             </div>
//                             <div className="font-eudoxus text-sm font-normal leading-[22px] text-[#1a1a1a]">
//                                 {item.role}
//                             </div>
//                         </span>
//                     </div>
//                 </div>
//                 <div className="relative flex flex-shrink-0 flex-grow justify-between">
//                     <div className="mb-7 ml-8 self-end">
//                         <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 28 24"
//                                 fill="fill-current"
//                             >
//                                 <path d="M6.69556 7.69727H1.60156V24.0001H6.69556V7.69727Z" fill="black" />
//                                 <path
//                                     d="M4.0413 0C2.16295 0 0.927734 1.2148 0.927734 2.82773C0.927734 4.41004 2.12212 5.65546 3.96984 5.65546H4.01068C5.92986 5.65546 7.12425 4.39983 7.11404 2.82773C7.0732 1.2148 5.91965 0 4.0413 0Z"
//                                     fill="black"
//                                 />
//                                 <path
//                                     d="M20.6095 7.54395C17.6899 7.54395 15.8626 9.13646 15.5258 10.2594V7.69707H9.79883C9.87029 9.05479 9.79883 23.9999 9.79883 23.9999H15.5258V15.1901C15.5258 14.6898 15.5053 14.1998 15.6483 13.8528C16.0362 12.8727 16.8835 11.8519 18.4045 11.8519C20.3952 11.8519 21.2935 13.3627 21.2935 15.5678V23.9999H27.0715V14.9348C27.0715 9.89188 24.2335 7.54395 20.6095 7.54395Z"
//                                     fill="black"
//                                 />
//                             </svg>
//                         </div>
//                     </div>
//                     <Image className="w-7/12" src={avatar} alt={`${item.name} avatar`} width={230} height={329} />
//                 </div>
//             </div>
//             <Link
//                 href={item.linkedin}
//                 aria-label={`${item.name}`}
//                 className="absolute left-0 top-0 z-[100] block h-full w-full overflow-hidden whitespace-nowrap bg-transparent outline-none"
//             ></Link>
//         </motion.div>
//     );
// };
export const OurTeamItem = ({ item, index = 0 }: { item: Team; index?: number }) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.2 * index })}
            whileHover="on_hover"
            className="group relative bg-white transition-all duration-300 ease-in-out"
        >
            <div className="aspect-[16/9] bg-[#fafafa]">
                <div className="h-[280px] w-full">
                    <img className="h-full w-full object-cover" src={item?.avatar} alt={`${item.name} avatar`} />
                </div>
            </div>
            <div className="relative mt-4 flex-grow-0">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div className="overflow-hidden truncate text-ellipsis whitespace-nowrap font-eudoxus text-[18px] font-medium leading-[24px] text-[#1a1a1a] group-hover:text-[#1a1aff] xl:text-[24px] xl:leading-[32px]">
                                {item.name}
                            </div>
                            {/* <img
                                src="/assets/icons/arrow-up-short-blue.svg"
                                className="hidden h-[16px] w-[16px] group-hover:block"
                            />
                            <img
                                src="/assets/icons/arrow-up-short-gray.svg"
                                className="h-[16px] w-[16px] group-hover:hidden"
                            /> */}

                            <div className="relative h-[16px] w-[16px]">
                                <motion.img
                                    initial={{ x: -20, y: 30, opacity: 0 }}
                                    variants={{
                                        on_hover: {
                                            x: 0,
                                            y: 0,
                                            opacity: 1,
                                            transition: { duration: 0.2 },
                                        },
                                    }}
                                    alt="button_icon"
                                    src="/assets/icons/arrow-up-short-blue.svg"
                                    className={cn('absolute h-full w-full object-contain', 'hidden group-hover:block')}
                                />

                                <motion.img
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    variants={{
                                        on_hover: {
                                            x: 20,
                                            y: -30,
                                            opacity: 0,
                                            transition: { duration: 0.2 },
                                        },
                                    }}
                                    alt="button_icon"
                                    src="/assets/icons/arrow-up-short-gray.svg"
                                    className={cn('absolute h-full w-full object-contain', 'block group-hover:hidden')}
                                />
                            </div>
                        </div>
                        <div className="mt-[0.6px] font-eudoxus text-sm font-normal leading-[22px] text-[#484848]">
                            {item.role}
                        </div>
                    </div>
                </div>
            </div>
            <Link
                href={`/about/teams/${item.id}`}
                aria-label={`${item.name}`}
                className="absolute left-0 top-0 z-[100] block h-full w-full overflow-hidden whitespace-nowrap bg-transparent outline-none"
            />
        </motion.div>
    );
};
