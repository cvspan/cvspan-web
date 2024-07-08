'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import arrow from '../../../../public/assets/images/Arrow Right Up.png';

type Props = {};

const Openposition = (props: Props) => {
    const [selected, setSelected] = useState<string>('All');

    const buttons: string[] = ['All', 'Design', 'Development', 'Marketing', 'Business Development', 'Product'];

    const jobListings = [
        {
            title: 'Project Manager',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: arrow,
        },
        {
            title: 'Senior React Developer',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: arrow,
        },
        {
            title: 'Technical Consultant',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: arrow,
        },
        {
            title: 'Lead Node.js Developer',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: arrow,
        },
        {
            title: 'Design Consultant',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: arrow,
        },
    ];

    return (
        <div className="mx-auto w-[335px] space-y-[60px] py-[120px] lg:w-[1200px]">
            <div className="space-y-6">
                <p className="font-eudoxus text-[16px] font-normal leading-[24px] text-[#1a1a1a]">
                    Filter by departments
                </p>
                <div>
                    {/* Buttons for larger screens */}
                    <div className="hidden gap-3 md:flex">
                        <div className="flex gap-4">
                            {buttons.map((button) => (
                                <button
                                    key={button}
                                    className={`rounded-full border-[1px] px-8 py-4 font-eudoxus text-[16px] font-medium leading-[24px] ${
                                        selected === button ? 'bg-[#0c0c0c] text-white' : 'bg-white text-black'
                                    }`}
                                    onClick={() => setSelected(button)}
                                >
                                    {button}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dropdown for smaller screens */}
                    <div className="md:hidden">
                        <select
                            className="rounded-full border-[1px] bg-white px-8 py-4 font-eudoxus text-[16px] font-medium leading-[24px] text-black"
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                        >
                            {buttons.map((button) => (
                                <option key={button} value={button}>
                                    {button}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-start gap-6 border-t-[1px] border-[#a3a3a3] lg:flex-row">
                <div className="w-[334px] space-y-6 py-10 lg:w-[384px] lg:p-10">
                    <h4 className="font-eudoxus text-[34px] font-medium leading-[42px]">Open Positions</h4>
                    <p className="font-eudoxus text-[16px] font-normal leading-[24px]">
                        Let's write some beautiful code and make smart designs. This is what we're crazy about, and
                        we're looking for the ones who feel the same.
                    </p>
                </div>
                <div>
                    {jobListings.map((job, index) => (
                        <div
                            key={index}
                            className={`flex w-[335px] items-start justify-between py-10 lg:w-[729px] ${
                                index !== 0 ? 'border-t-[1px] border-[#1a1a1a]' : ''
                            }`}
                        >
                            <div className="w-[295px] space-y-3 lg:w-[752px]">
                                <h3 className="font-eudoxus text-[24px] font-normal leading-[32px] lg:text-[48px] lg:leading-[56px]">
                                    {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-[11px]">
                                    <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                        {job.language}
                                    </p>
                                    <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                    <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                        {job.level}
                                    </p>
                                    <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                    <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                        {job.experience}
                                    </p>
                                    <span className="h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                    <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                        {job.location}
                                    </p>
                                </div>
                            </div>
                            <div className="w-[40px]">
                                <Image src={arrow} alt="arrow" className="h-[40px] w-[40px]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Openposition;
