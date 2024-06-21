import React from "react";
import { StaticImageData, } from "next/image";

import Image from 'next/image';

interface DoneCardProps {
    id: number;
    image: StaticImageData;
    text: string;
    title: string;
  }
const DoneCard:React.FC<DoneCardProps>= ({image, title, text, id}) => {
    return (
                <div key={id} className='rounded-[24px] border border-gray-600 p-[24px] flex flex-col  justify-center items-start w-72 h-80 cursor-pointer flex-start'>
                   <Image src={image} alt="duties" className="relative h-[80px] w-[86.15px] pb-3 -mt-10 "/>
                    <div className=" font-eudoxus text-white text-align  text-[24px] leading-[32px] pb-3">{title}</div>
                    <p className=" font-eudoxus text-neutral-400 text-align text-[16px] leading-[24px]">{text}</p>
                  
                </div>
        
    );
}
export default DoneCard;


