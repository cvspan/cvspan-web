import Image from 'next/image';
import goodluck from '../../../../../../public/assets/images/goodluck.jpg';

const TestimonialProfile = () => {
    return (
        <div className="flex h-full w-full items-center gap-4">
            <div className="rounded-full object-cover">
                <Image src={goodluck} alt="testifier" width={60} height={60} className="rounded-full object-cover" />
            </div>
            <div className="flex flex-col gap-y-1">
                <span className="font-eudoxus font-bold">Moses Arfo</span>
                <span className="text-sm text-silver-chalice">CEO CVSpan Limited</span>
            </div>
        </div>
    );
};

export default TestimonialProfile;
