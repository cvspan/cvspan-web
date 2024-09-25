type ImagePageProps = {
    image: string;
};

const ImagePage: React.FC<ImagePageProps> = ({ image }) => {
    return (
        <div className="flex w-full items-center justify-center">
            <div className="mx-auto flex h-fit max-w-[1400px] items-center justify-center">
                <img src={`/assets/images/screens/${image}.webp`} alt="" className="h-auto max-w-full" />
            </div>
        </div>
    );
};

export default ImagePage;
