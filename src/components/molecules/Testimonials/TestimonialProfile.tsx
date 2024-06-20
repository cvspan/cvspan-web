import Image, { StaticImageData } from 'next/image';

interface TestimonialProfileProps {
    name: string;
    profession: string;
    image: StaticImageData;
}
const TestimonialProfile: React.FC<TestimonialProfileProps> = ({ name, profession, image }) => {
    return (
        <div className="flex h-full w-full items-center gap-4">
            <div className="h-[60px] w-[60px] rounded-full bg-slate-300 object-cover">
                <Image
                    src={image}
                    alt="testifier"
                    width={60}
                    height={60}
                    className="aspect-square rounded-full object-cover"
                />
            </div>
            <div className="flex flex-col gap-y-1">
                <span className="font-eudoxus font-bold">{name}</span>
                <span className="text-silver-chalice text-sm">{profession}</span>
            </div>
        </div>
    );
};

export default TestimonialProfile;
