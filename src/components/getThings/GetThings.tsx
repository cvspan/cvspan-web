import React from 'react'
import { data } from '@/components/data/data'
import DoneCard from '../molecules/layout/DoneCard/DoneCard'

export default function GetThings () {
  return (

    <div className="flex flex-1 bg-black justify-center items-center pb-10 pt-10 ">
    <div className="flex flex-col items-start m-0">
<h2 className="font-eudoxus text-white text-5xl pb-10 text-justify ">We get things <br /> done with quality
        </h2>
        <div className="grid grid-cols-4 items-center justify-center gap-10">
            {data.map((details) => (
                <DoneCard 
                    key={details.id}
                    id={details.id}
                    image={details.image}
                    text={details.text}
                    title={details.title}
                />
            ))}
        </div>
        </div>
 </div>
        


  )
}


