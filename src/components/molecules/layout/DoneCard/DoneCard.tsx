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
                <div key={id} className='rounded-3xl border border-gray-600 p-4 flex flex-col  justify-center items-start w-72 h-80 cursor-pointer '>
                   <Image src={image} alt="duties" className="relative h-24 w-20 pb-3 -mt-10 "/>
                    <div className=" font-eudoxus text-white text-align  text-2xl leading-8 pb-3">{title}</div>
                    <p className=" font-eudoxus text-neutral-400 text-align text-sm leading-6">{text}</p>
                  
                </div>
        
    );
}
export default DoneCard;
