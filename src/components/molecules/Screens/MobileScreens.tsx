type ImagePageProps = {
    mobileImage: string;
};

const MobileScreens: React.FC<ImagePageProps> = ({ mobileImage }) => {
    return (
        <div className="h-fit">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col py-[60px]">
                <h3 className="pt-[60px] text-[48px] font-medium">Mobile Screens</h3>
            </div>
            <div className="flex h-fit justify-center">
                <img src={`/assets/images/screens/${mobileImage}.png`} alt="" />
            </div>
        </div>
    );
};

export default MobileScreens;
