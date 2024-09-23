type MockupProps = {
    image: string;
};

const ImagePage: React.FC<MockupProps> = ({ image }) => {
    return (
        <div className="flex h-[1018px] w-full items-center justify-center bg-[#EEF1F9]">
            <div className="mx-auto flex h-fit max-w-[1400px] items-center justify-center">
                <img src={`/assets/images/screens/${image}.webp`} alt="" className="h-auto max-w-full" />
            </div>
        </div>
    );
};

export default ImagePage;
