export default function display() {
    return (
        <div className="relative flex h-[fit] w-full items-center justify-center bg-[#000A0F] pt-[120px]">
            <div className="absolute right-0 top-0 h-full">
                <img src={'/assets/images/screens/blur.webp'} alt="elipse" className="h-full" />
            </div>
            <div className="z-10 mx-auto flex h-fit max-w-[1400px] items-center justify-center">
                <img src={`/assets/images/screens/nemo-sneakpeak.webp`} alt="" className="h-auto max-w-full" />
            </div>
        </div>
    );
}
