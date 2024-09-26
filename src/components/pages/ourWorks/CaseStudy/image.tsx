type ImagePageProps = {
    image: string;
};

const ImagePage: React.FC<ImagePageProps> = ({ image }) => {
    return (
        <div className="flex h-fit w-full justify-center">
            <img src={`/assets/images/screens/${image}`} alt="" />
        </div>
    );
};

export default ImagePage;
