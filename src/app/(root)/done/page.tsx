import DoneCard from "@/components/DoneCard/DoneCard";
import { data } from "@/components/data/data";



export default function EverythingDone() {
    return (
       
        <div className="flex flex-1 h-screen bg-black justify-center items-center">
    <div className="flex flex-col items-start">
        <h2 className="[font-family:'Aeonik-Regular',Helvetica] text-white text-4xl pb-10 text-center text-justify">We get things <br /> done with quality
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
         
          
        
    );
}
