import ScreenImage from './ScreenImage';

type MockupProps = {
    image: string;
};

const ImagePage: React.FC<MockupProps> = ({ image }) => {
    return (
        <div className="flex h-fit w-full items-center justify-center bg-[#EEF1F9] md:h-[1018px]">
            <div className="mx-auto flex h-fit max-w-[1400px] items-center justify-center">
                <ScreenImage image={image} className="h-auto max-w-full" />
            </div>
        </div>
    );
};

export default ImagePage;
