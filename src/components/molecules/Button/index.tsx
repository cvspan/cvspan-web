import React from 'react';

function Button({
    title,
    background = 'blue',
    height = '40px',
    leftIcon,
    leftIconSize = '18px',
}: {
    title: string;
    background?: 'blue' | 'white' | 'dark';
    height?: '40px' | '56px';
    leftIcon?: string;
    leftIconSize?: string;
}) {
    const _height = `h-[${height}]`;
    const _background =
        background === 'blue'
            ? `bg-[#1A1AFF] text-[#ffffff] border-[#1A1AFF]`
            : background === 'white'
              ? 'bg-[#ffffff] text-[#1A1A1A] border-[#ffffff]'
              : 'bg-[#050505] text-[#ffffff] border-[#050505]';
    const _padding = height === '40px' ? 'px-[16px] py-[8px]' : 'px-[32px] py-[16px]';

    return (
        <button
            className={`flex w-auto cursor-pointer items-center gap-[16px] self-start rounded-[100px] border-[1px] text-[16px] font-[500] leading-[24px] ${_background} ${_height} ${_padding}`}
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
