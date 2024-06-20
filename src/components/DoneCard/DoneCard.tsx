import React from "react";
import './doneCard.css'
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
                <div key={id} className='rounded-lg border border-gray-400 p-2.5 flex flex-col  justify-center items-start w-56 h-56 cursor-pointer'>
                   <Image src={image} alt="duties" className="relative h-15 w-12 pb-3"/>
                    <div className=" [font-family:'Aeonik-Regular',Helvetica] text-white text-align text-lg">{title}</div>
                    <p className=" [font-family:'Aeonik-Regular',Helvetica] text-neutral-400 text-align text-sm">{text}</p>
                  
                </div>
        
    );
}
export default DoneCard;
