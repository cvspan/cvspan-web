import React from 'react';

type ImagePageProps = {
    mobileImage: string;
};

const MobileScreens: React.FC<ImagePageProps> = ({ mobileImage }) => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex h-fit w-full flex-col">
                <div className="px-5">
                    <div className="mx-auto flex w-full max-w-[1200px] flex-col py-[60px]">
                        <h3 className="pt-[60px] text-[48px] font-medium">Mobile Screens</h3>
                    </div>
                </div>

                <div className="flex h-[1080px] w-full justify-center">
                    <img src={`/assets/images/screens/${mobileImage}.webp`} alt="" className="object-cover" />
                </div>
            </div>
        </div>
    );
};

export default MobileScreens;
