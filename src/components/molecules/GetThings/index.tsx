import React from 'react';
import { data } from '@/components/molecules/GetThings/data/data';
import DoneCard from './DoneCard';

export default function GetThings({ title = 'We get things done with quality' }: { title?: string }) {
    return (
        <div className="flex flex-1 items-center justify-center bg-black pb-10 pt-10">
            <div className="m-0 flex flex-col items-start justify-center">
                <div className="w-[100%] max-w-[524px]">
                    {' '}
                    <h2 className="pb-10 font-eudoxus text-[48px] leading-[56px] text-white">{title}</h2>
                </div>

                <div className="grid w-[1200px] grid-cols-4 items-center justify-center gap-[12px] self-center">
                    {data.map((details) => (
                        <DoneCard
                            key={details.id}
                            id={details.id}
                            image={details.image}
                            text={details.text}
                            title={details.title}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
