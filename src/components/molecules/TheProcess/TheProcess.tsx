import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

type Props = {};

const TheProcess = (props: Props) => {
    useGSAP(() => {
        SplitType.create('#about_header_title_id', { charClass: 'about_title_char' });

        const tl = gsap.timeline({});

        tl.to('.about_header_title', {
            opacity: 1,
            duration: 0.03,
        }).to('.about_title_char', {
            opacity: 1,
            stagger: 0.03,
            duration: 0.03,
        });

        return () => {
            tl.reverse();
        };
    }, {});

    return (
        <div className="bg-[#0A153E] px-5">
            <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-[60px] bg-bottom bg-no-repeat py-[120px]">
                <h3 className="max-w-[564px] text-[48px] font-medium leading-[56px] text-white">
                    The process of Infinity Product Design
                </h3>
                <div>
                    <div className="flex flex-col gap-6">
                        <div className="ml-0">
                            <button className="h-[56px] rounded-full border-[0.5px] border-gray-50 border-opacity-10 bg-white bg-opacity-15 px-[93px] py-2 text-2xl text-white">
                                Research
                            </button>
                        </div>
                        <div className="ml-[200px]">
                            <button className="h-[56px] rounded-full border-[0.5px] border-gray-50 border-opacity-10 bg-white bg-opacity-15 px-[71px] py-2 text-2xl text-white">
                                User Flow
                            </button>
                        </div>
                        <div className="ml-[400px] flex flex-row gap-10">
                            <button className="h-[56px] rounded-full border-[0.5px] border-gray-50 border-opacity-10 bg-white bg-opacity-15 px-[81px] py-2 text-2xl text-white">
                                Wireframes
                            </button>
                            <svg
                                width="60"
                                height="60"
                                viewBox="0 0 60 60"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="60" height="60" rx="30" fill="#1A1AFF" />
                                <path
                                    d="M36.9294 28.5486C36.9332 28.556 36.939 28.5621 36.946 28.5664C36.9531 28.5707 36.9613 28.5729 36.9696 28.5728C36.9779 28.5727 36.986 28.5702 36.993 28.5657C37 28.5613 37.0056 28.5549 37.0091 28.5474L40.7221 20.7542C40.7296 20.7379 40.7417 20.7241 40.757 20.7144C40.7724 20.7047 40.7902 20.6996 40.8087 20.6996H49.9399C49.9502 20.6997 49.9602 20.7023 49.9692 20.7074C49.9782 20.7125 49.9857 20.7197 49.9911 20.7285C49.9964 20.7373 49.9995 20.7473 50 20.7576C50.0003 20.7678 49.9981 20.778 49.9935 20.7872L40.5059 39.2357C40.4839 39.2774 40.4494 39.2982 40.4022 39.2982H33.386C33.3464 39.2982 33.318 39.2808 33.3007 39.2459L27.8255 28.4155C27.8197 28.4045 27.8111 28.3953 27.8003 28.3889C27.7898 28.3825 27.7775 28.3791 27.7651 28.3791C25.0652 28.376 22.3849 28.3764 19.7244 28.3802C18.6715 28.3825 18.0306 29.5166 18.3937 30.4278C18.6908 31.1706 19.2816 31.4595 20.0385 31.4584C22.6103 31.4538 24.9153 31.45 26.9535 31.447C26.9976 31.447 27.0302 31.4667 27.0515 31.5061L31.1652 39.2322C31.1894 39.2769 31.1762 39.2993 31.1253 39.2993C27.4373 39.2918 23.7292 39.294 20.001 39.3061C19.1313 39.3084 18.4135 39.2625 17.8473 39.1685C15.8189 38.8325 14.0687 37.91 12.5965 36.4008C9.93861 33.6754 9.23857 29.404 10.8811 25.9595C12.1765 23.2454 14.7216 21.3309 17.6755 20.8293C18.2165 20.7368 18.9477 20.6917 19.8689 20.6939C24.2452 20.7023 28.6321 20.703 33.0297 20.6962C33.0806 20.6962 33.1169 20.719 33.1389 20.7645L36.9294 28.5486ZM37.0079 33.573C37.0062 33.5764 37.0035 33.5792 37.0004 33.5811C36.9972 33.5831 36.9935 33.5841 36.9897 33.5841C36.986 33.5841 36.9823 33.5831 36.979 33.5811C36.9759 33.5792 36.9733 33.5764 36.9716 33.573L31.7992 22.9497C31.7852 22.9211 31.7634 22.897 31.7362 22.8803C31.709 22.8636 31.6775 22.8549 31.6456 22.8552C27.8247 22.8696 23.9356 22.8681 19.9782 22.8507C19.0714 22.8461 18.3656 22.895 17.861 22.9974C13.7177 23.8358 11.1827 28.023 12.5043 32.1249C13.3125 34.6332 15.4012 36.4998 18.009 37.0016C18.5334 37.1024 19.2182 37.1506 20.0636 37.146C22.5488 37.1331 25.0386 37.1312 27.5329 37.1404C27.5807 37.1404 27.5933 37.1194 27.5705 37.0777L25.7504 33.6674C25.7299 33.6295 25.6989 33.6105 25.6571 33.6105C23.725 33.6098 21.8222 33.6098 19.9486 33.6105C17.8234 33.6105 16.2025 32.0555 16.1286 29.9545C16.0705 28.3097 17.1314 26.9003 18.6635 26.3873C19.027 26.2659 19.5331 26.2064 20.182 26.2087C23.206 26.22 26.1666 26.2216 29.0639 26.2132C29.1095 26.2132 29.1424 26.2333 29.1629 26.2735L34.646 37.1084C34.6502 37.1169 34.6565 37.1241 34.6646 37.129C34.6727 37.1342 34.682 37.1368 34.6916 37.137H39.0932C39.1342 37.137 39.1639 37.1187 39.182 37.0822L46.4613 22.9258C46.4833 22.8825 46.4705 22.8609 46.4226 22.8609H42.1621C42.1294 22.8609 42.1059 22.8757 42.0915 22.9053L37.0079 33.573Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <div className="ml-[620px]">
                            <button className="h-[56px] rounded-full border-[0.5px] border-gray-50 border-opacity-10 bg-white px-[93px] py-2 text-2xl text-black">
                                UI Design
                            </button>
                        </div>
                        <div className="ml-[820px]">
                            <button className="h-[56px] rounded-full border-[0.5px] border-gray-50 border-opacity-10 bg-white bg-opacity-15 px-[93px] py-2 text-[24px] text-white">
                                Development
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheProcess;
