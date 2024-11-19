'use client';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type EditModalProps = {
    toggleState: number;
    toggleTab: (index: number) => void;
};

const EditModal: React.FC<EditModalProps> = ({ toggleState, toggleTab }) => {
    return (
        <div
            className={
                toggleState === 1
                    ? 'visible fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 opacity-100 transition duration-300'
                    : 'hidden opacity-0'
            }
        >
            <div className="relative h-[1000px] max-h-[90vh] w-[368px] space-y-6 overflow-y-auto rounded-[12px] bg-white p-6">
                {/* Header */}
                <div className="flex items-center">
                    <p className="flex-1 text-center font-pp-mori text-[16px] font-[500] leading-[24px] text-[#1a1a1a]">
                        Profile Information
                    </p>
                    {/* Add onClick to close the modal */}
                    <span className="cursor-pointer" onClick={() => toggleTab(0)}>
                        <img src="/assets/icons/Close.svg" alt="Close Modal" className="h-[14px] w-[14px]" />
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#d1d1d1]"></div>

                {/* Profile Picture Section */}
                <div className="flex gap-6">
                    <img src="/assets/images/profile_picture.png" alt="Profile" className="w-[100px] rounded-full" />

                    <div className="space-y-[8px]">
                        <div className="flex gap-[8px]">
                            <button className="rounded-[100px] bg-[#0b8400]/10 px-4 py-2 font-pp-mori text-[14px] font-[500] leading-[22px] text-[#0b8400]">
                                Update
                            </button>
                            <button className="rounded-[100px] bg-[#ff0000]/10 px-4 py-2 font-pp-mori text-[14px] font-[500] leading-[22px] text-[#ff0000]">
                                Remove
                            </button>
                        </div>
                        <p className="font-pp-mori text-[10px] font-[400] leading-[18px] text-[#767676]">
                            Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <div>
                    <input
                        type="text"
                        className="w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px] placeholder:text-[#838383]"
                        placeholder="First Name"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px] placeholder:text-[#838383]"
                        placeholder="Last Name"
                    />
                </div>
                <div className="w-full">
                    <Dropdown
                        placeholder="What do you do"
                        values={['Developer', 'Product Designer', 'Project Manager']}
                    />
                </div>

                <div>
                    <textarea
                        cols={15}
                        className="w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px] placeholder:text-[#838383]"
                        placeholder="Short Description"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        className="w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px] placeholder:text-[#838383]"
                        placeholder="Email"
                    />
                </div>
                <div>
                    <input
                        type="url"
                        className="w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px] placeholder:text-[#838383]"
                        placeholder="Link"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="w-full rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px] placeholder:text-[#838383]"
                        placeholder="Location"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    {/* Add onClick to close the modal */}
                    <button
                        onClick={() => toggleTab(0)}
                        className="rounded-full border-[1px] border-[#1a1aff] bg-white px-4 py-2 font-pp-mori text-[14px] font-[500] leading-[22px] text-[#1a1aff] transition duration-200 hover:bg-[#f0f0ff]"
                    >
                        Cancel
                    </button>
                    <button className="flex items-center rounded-full bg-[#1a1aff] px-4 pb-2 pt-2 font-pp-mori text-[14px] font-[500] leading-[22px] text-[#fff] transition duration-200 hover:bg-[#0f0fdd]">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

type dropdownProps = {
    placeholder: string;
    values: string[];
};

const Dropdown: React.FC<dropdownProps> = ({ placeholder, values }) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="w-full outline-none">
                    <button type="button" className="w-full">
                        <div className="flex w-full items-center justify-between rounded-[8px] border-[1px] border-[#838383] bg-transparent p-3 text-left font-eudoxus text-[16px] font-[400] leading-[24px] text-[#838383]">
                            {placeholder}

                            <span className="">
                                <img src="/assets/icons/Cheveron.svg" alt="" className="" />
                            </span>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-[5px] rounded-[12px] p-4">
                    {values.map((value, index) => (
                        <DropdownMenuItem key={index}>
                            <p className="font-gordita text-[16px] font-normal leading-[24px]">{value}</p>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default EditModal;
