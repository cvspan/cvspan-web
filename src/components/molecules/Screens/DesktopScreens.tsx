type ImagePageProps = {
    desktopImage: string;
};

const DesktopScreens: React.FC<ImagePageProps> = ({ desktopImage }) => {
    return (
        <div className="h-fit">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col py-[60px]">
                <h3 className="pt-[60px] text-[48px] font-medium">Desktop Screens</h3>
            </div>
            <div className="flex h-fit justify-center">
                <img src={`/assets/images/screens/${desktopImage}.png`} alt="" />
            </div>
        </div>
    );
};

export default DesktopScreens;
