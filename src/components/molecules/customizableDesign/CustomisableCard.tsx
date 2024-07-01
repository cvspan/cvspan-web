import React from 'react';

const CustomisableCard = () => {
    return (
        <div
            style={{ height: '452px', width: '336px' }}
            className="group flex h-[452px] w-[336px] transform flex-col justify-between gap-[156px] bg-white p-8 transition-transform duration-300 hover:transform hover:bg-[#1A1AFF] hover:transition-transform hover:duration-300 group-hover:text-white"
        >
            <div className="flex flex-col gap-[18px] group-hover:text-white lg:p-[12px]">
                <span className="text-#767676 hover: font-eudoxus">01</span>
                <h5
                    className="font-eudoxus font-medium leading-[32px] text-[#1A1A1A] group-hover:text-white"
                    style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                >
                    Discovering your goals and vision
                </h5>
                <p className="font-eudoxus font-normal text-[#767676] group-hover:hidden group-hover:text-white">
                    Make your decision personal and make sense
                </p>
                <p className="hidden font-eudoxus text-[16px] font-normal text-white group-hover:flex">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                </p>
            </div>
            <div className="flex h-[60px] w-[60px] items-center justify-center self-end justify-self-end bg-[#1A1AFF] group-hover:hidden">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.75 2C0.75 1.30964 1.30964 0.75 2 0.75H17C17.6904 0.75 18.25 1.30964 18.25 2C18.25 2.69036 17.6904 3.25 17 3.25H5.01777L22.8839 21.1161C23.372 21.6043 23.372 22.3957 22.8839 22.8839C22.3957 23.372 21.6043 23.372 21.1161 22.8839L3.25 5.01777V17C3.25 17.6904 2.69036 18.25 2 18.25C1.30964 18.25 0.75 17.6904 0.75 17V2Z"
                        fill="white"
                    />
                </svg>
            </div>
        </div>
    );
};

export default CustomisableCard;
