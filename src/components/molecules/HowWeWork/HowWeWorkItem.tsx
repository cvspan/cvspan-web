// import React from 'react';
// import { HowWeWork } from './types';

// import { motion } from 'framer-motion';
// import { ANIMATE_PROPS } from '@/helpers/motion';

// export const HowWorkItem = ({ item }: { item: HowWeWork }) => {
//     return (
//         <motion.div
//             {...ANIMATE_PROPS({ delay: 0.2 * item?.index })}
//             className="gradient-border col-span-3 w-full shrink-0 rounded-xl p-6 md:h-[278px] md:w-[282px]"
//         >
//

//             <div>
//                 <div>
//                     <div className="h-[56px] w-[56px] rounded-full bg-[#00ffb2]" />
//                 </div>
//                 <div className="mt-6">
//                     <div className="flex items-center justify-between">
//                         <span>
//                             <div className="text-gradient font-eudoxus text-[34px] font-medium leading-[42px] text-white">
//                                 {item.title}
//                             </div>
//                         </span>
//                     </div>
//                 </div>
//                 <div className="mt-3">
//                     <span className="font-eudoxus text-base font-normal leading-6 text-[#a3a3a3]">
//                         {item.description}
//                     </span>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

import React from 'react';
import { HowWeWork } from './types';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

export const HowWorkItem = ({ item, index = 0 }: { item: HowWeWork; index?: number }) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.2 * index })}
            className="gradient-border col-span-3 w-full shrink-0 rounded-xl p-6 md:h-[278px] md:w-[282px]"
        >
            <div>
                <div>
                    <div className="h-[56px] w-[56px] rounded-full">
                        <img src={item?.img} className="h-full w-full" alt="" loading="lazy" decoding="async" />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <span>
                            <div className="text-gradient font-eudoxus text-[34px] font-medium leading-[42px] text-white">
                                {item.title}
                            </div>
                        </span>
                    </div>
                </div>
                <div className="mt-3">
                    <span className="font-eudoxus text-base font-normal leading-6 text-[#a3a3a3]">
                        {item.description}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
