import React from 'react';
import { motion } from 'framer-motion';

function Button({
    title,
    background = 'blue',
    height = '40px',
    rightIcon,
    rightIconSize = '18px',

    fullWidth = false,
}: {
    title: string;
    background?: 'blue' | 'white' | 'dark' | 'transparent';
    height?: '40px' | '56px';
    rightIcon?: string;
    rightIconSize?: string;

    fullWidth?: boolean;
}) {
    const _height = `h-[${height}]`;
    const _background =
        background === 'transparent'
            ? 'text-white'
            : background === 'blue'
              ? `bg-[#1A1AFF] text-[#ffffff] border-[#1A1AFF]`
              : background === 'white'
                ? 'bg-[#ffffff] text-[#1A1A1A] border-[#ffffff]'
                : 'bg-[#050505] text-[#ffffff] border-[#050505]';
    const _padding = height === '40px' ? 'px-[16px] py-[8px]' : 'px-[32px] py-[16px]';

    const _fullWidth = fullWidth ? 'w-full' : 'self-start';

    return (
        <motion.button
            className={`flex w-auto cursor-pointer items-center justify-center gap-[16px] rounded-[100px] border-[1px] text-[16px] font-[500] leading-[24px] transition duration-300 ease-in-out hover:scale-110 ${_fullWidth} ${_background} ${_height} ${_padding}`}
        >
            <span className="font-eudoxus text-inherit">{title}</span>
            {!rightIcon ? null : (
                <img
                    alt="button_icon"
                    src={rightIcon}
                    style={{ width: rightIconSize, height: 'rightIconSize', objectFit: 'contain' }}
                />
            )}
        </motion.button>
    );
}

export default Button;
