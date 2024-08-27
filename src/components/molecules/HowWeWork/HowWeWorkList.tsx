import React from 'react';
import { HowWeWork } from './types';
import { HowWorkItem } from './HowWeWorkItem';

const HOWWEWORK: HowWeWork[] = [
    {
        id: 1,
        title: 'Discovery',
        description: 'Once we’ve heard more about your goals and timeline, we’ll start assembling your team',
    },
    {
        id: 2,
        title: 'Staffing',
        description:
            'We’ll send you high-quality candidates for consideration, ensuring a perfect fit for your company',
    },
    {
        id: 3,
        title: 'Kickoff',
        description: 'Your new development team will work tirelessly to deliver on your product vision',
    },
    {
        id: 4,
        title: 'Ramp up',
        description: 'Following release, we’ll easily scale your team to match your product’s success',
    },
];
export const HowWeWorkList = () => {
    return (
        <div className="pt-[60px]">
            <div>
                <div className="flex flex-wrap justify-between max-[1200px]:justify-start max-[1200px]:gap-[20px]">
                    {HOWWEWORK.map((item: HowWeWork, i: number) => (
                        <HowWorkItem item={item} key={i} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
