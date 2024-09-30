type ImagePageProps = {
    desktopImage: string;
};

const DesktopScreens: React.FC<ImagePageProps> = ({ desktopImage }) => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex h-fit w-full flex-col">
                <div className="px-5">
                    <div className="mx-auto flex w-full max-w-[1200px] flex-col py-[60px]">
                        <h3 className="pt-[60px] text-[48px] font-medium">Desktop Screens</h3>
                    </div>
                </div>

                <div className="flex h-[1080px] w-full justify-center">
                    <img src={`/assets/images/screens/${desktopImage}.webp`} alt="" className="object-cover" />
                </div>
            </div>
        </div>
    );
};

export default DesktopScreens;
