import React from 'react';

function Button({
    title,
    background = 'blue',
    height = '40px',
    leftIcon,
    leftIconSize = '18px',
    fullWidth = false,
}: {
    title: string;
    background?: 'blue' | 'white' | 'dark' | 'transparent';
    height?: '40px' | '56px';
    leftIcon?: string;
    leftIconSize?: string;
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
        <button
            className={`flex w-auto cursor-pointer items-center justify-center gap-[16px] rounded-[100px] border-[1px] text-[16px] font-[500] leading-[24px] ${_fullWidth} ${_background} ${_height} ${_padding}`}
        >
            <span className="font-eudoxus text-inherit">{title}</span>
            {!leftIcon ? null : (
                <img
                    alt="button_icon"
                    src={leftIcon}
                    style={{ width: leftIconSize, height: 'leftIconSize', objectFit: 'contain' }}
                />
            )}
        </button>
    );
}

export default Button;
