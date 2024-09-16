import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Spinner from '@/components/molecules/Spinner';

function Button({
    title,
    background = 'blue',
    height = '40px',
    rightIcon,
    rightIconHover,
    rightIconSize = '18px',

    fullWidth = false,
    animateRightIconOnHover = false,
    onClick = () => null,
    className,
    loading,
}: {
    title: string;
    background?: 'blue' | 'white-no-border' | 'white-with-border' | 'dark' | 'transparent';
    height?: '40px' | '56px';
    rightIcon?: string;
    rightIconHover?: string;
    rightIconSize?: string;

    fullWidth?: boolean;
    animateRightIconOnHover?: boolean;
    onClick?: any;
    className?: string;
    loading?: boolean;
}) {
    const _height = `h-[${height}]`;
    const _background =
        background === 'white-with-border'
            ? 'bg-[#ffffff] text-[#1A1A1A] border-[#1A1A1A] hover:text-[#ffffff] hover:bg-[#050505] '
            : background === 'transparent'
              ? 'text-white hover:bg-[#ffffff] hover:text-[#1A1A1A]'
              : background === 'blue'
                ? `bg-[#1A1AFF] text-[#ffffff] border-[#1A1AFF] hover:opacity-80`
                : background === 'white-no-border'
                  ? 'bg-[#ffffff] text-[#1A1A1A] border-[#ffffff] hover:text-[#ffffff] hover:bg-[#050505]'
                  : 'bg-[#050505] text-[#ffffff] border-[#050505]';

    const _padding = height === '40px' ? 'px-[16px] py-[8px]' : 'px-[32px] py-[16px]';

    const _fullWidth = fullWidth ? 'w-full' : 'self-start';

    const _spinnerColor = background === 'blue' ? '#ffffff' : '#1A1AFF';

    return (
        <motion.button
            onClick={onClick}
            whileHover="on_hover"
            className={cn(
                `group flex w-auto cursor-pointer items-center justify-center gap-[16px] overflow-hidden rounded-[100px] border-[1px] text-[16px] font-[500] leading-[24px] transition duration-300 ease-in-out ${_fullWidth} ${_background} ${_height} ${_padding}`,
                className,
            )}
        >
            <span className="font-eudoxus text-inherit">{title}</span>

            {loading ? (
                <Spinner color={_spinnerColor} />
            ) : (
                <>
                    {!rightIcon ? null : (
                        <div
                            className="relative"
                            style={{
                                width: rightIconSize,
                                height: rightIconSize,
                            }}
                        >
                            <motion.img
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                variants={{
                                    on_hover: !animateRightIconOnHover
                                        ? {}
                                        : {
                                              x: 20,
                                              y: -30,
                                              opacity: 0,
                                              transition: { duration: 0.2 },
                                          },
                                }}
                                alt="button_icon"
                                src={rightIcon}
                                className={cn(
                                    'absolute h-full w-full object-contain',
                                    rightIconHover ? 'block group-hover:hidden' : '',
                                )}
                            />

                            {rightIconHover ? (
                                <motion.img
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    variants={{
                                        on_hover: !animateRightIconOnHover
                                            ? {}
                                            : {
                                                  x: 20,
                                                  y: -30,
                                                  opacity: 0,
                                                  transition: { duration: 0.2 },
                                              },
                                    }}
                                    alt="button_icon"
                                    src={rightIconHover}
                                    className={cn(
                                        'absolute h-full w-full object-contain',
                                        rightIconHover ? 'hidden group-hover:block' : '',
                                    )}
                                />
                            ) : null}

                            <motion.img
                                initial={{ x: -20, y: 30, opacity: 0 }}
                                variants={{
                                    on_hover: !animateRightIconOnHover
                                        ? {}
                                        : {
                                              x: 0,
                                              y: 0,
                                              opacity: 1,
                                              transition: { duration: 0.2 },
                                          },
                                }}
                                alt="button_icon"
                                src={rightIcon}
                                className={cn(
                                    'absolute h-full w-full object-contain',
                                    rightIconHover ? 'block group-hover:hidden' : '',
                                )}
                            />

                            {rightIconHover ? (
                                <motion.img
                                    initial={{ x: -20, y: 30, opacity: 0 }}
                                    variants={{
                                        on_hover: !animateRightIconOnHover
                                            ? {}
                                            : {
                                                  x: 0,
                                                  y: 0,
                                                  opacity: 1,
                                                  transition: { duration: 0.2 },
                                              },
                                    }}
                                    alt="button_icon"
                                    src={rightIconHover}
                                    className={cn(
                                        'absolute h-full w-full object-contain',
                                        rightIconHover ? 'hidden group-hover:block' : '',
                                    )}
                                />
                            ) : null}
                        </div>
                    )}
                </>
            )}
        </motion.button>
    );
}

export default Button;
