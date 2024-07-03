'use client';

import Image from 'next/image';
import behance from '../../../../public/assets/icons/behance.svg';
import clutch from '../../../../public/assets/icons/clutch.svg';
import dribble from '../../../../public/assets/icons/dribble.svg';
import appbusiness from '../../../../public/assets/icons/appbusiness.svg';

const Achievements = () => {
    return (
        <>
            <div className="bg-faint-white bg-[#F5F5F5] pb-[60px] pl-6 pr-6 pt-[60px] lg:pb-[120px] lg:pt-[120px]">
                <div className="m-auto flex w-full max-w-[1200px] flex-col items-start gap-[60px]">
                    <h3
                        className="font-euxodus font-medium text-black sm:w-[6/12]"
                        style={{ fontSize: 'clamp(2rem, 4.6875vw, 3rem)' }}
                    >
                        Our Achievements
                    </h3>
                    <div className="grid-layout w-full items-center justify-between font-eudoxus text-black">
                        <div className="flex flex-col items-center gap-[22px] font-eudoxus text-black">
                            <Image src={behance} alt="behance" />
                            <span className="align-center">28 Behance Galleries</span>
                        </div>
                        <div className="flex flex-col items-center gap-[22px]">
                            <Image src={clutch} alt="behance" />
                            <span>5.0 Ratings on Clutch</span>
                        </div>
                        <div className="flex flex-col items-center gap-[22px]">
                            <Image src={dribble} alt="behance" />
                            <span className="align-center">28 Behance Galleries</span>
                        </div>
                        <div className="flex flex-col items-center gap-[22px]">
                            <Image src={appbusiness} alt="behance" />
                            <span className="align-center">28 Behance Galleries</span>
                        </div>
                        <div className="flex flex-col items-center gap-[22px]">
                            <Image src={dribble} alt="behance" />
                            <span className="align-center">28 Behance Galleries</span>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .grid-layout {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
                    grid-gap: 3em;
                }
            `}</style>
        </>
    );
};

export default Achievements;
