import ScreenImage from './ScreenImage';

type ImagePageProps = {
    image: string;
};

const ImagePage: React.FC<ImagePageProps> = ({ image }) => {
    return (
        <div className="flex w-full items-center justify-center">
            <div className="mx-auto flex h-[503px] w-full items-center justify-center">
                {/* Hero banner of the case study: above the fold, so not deferred. */}
                <ScreenImage image={image} priority className="h-[503px] w-full object-cover" />
            </div>
        </div>
        // <div className="flex h-fit w-full items-center justify-center">
        //     <div className="flex h-[503px] w-full items-center justify-center">
        //         <img src={`/assets/images/screens/${image}.webp`} alt="" className="h-fit object-cover" />
        //     </div>
        // </div>
    );
};

export default ImagePage;
{
    /* <div className={`flex h-fit w-full items-center justify-center bg-[#1A61E2]`}>
<div className="mx-auto flex h-fit max-w-[1400px] items-center justify-center">
    <img src={`/assets/images/screens/${image}.webp`} alt="" className="h-auto max-w-full" />
</div>
</div> */
}
