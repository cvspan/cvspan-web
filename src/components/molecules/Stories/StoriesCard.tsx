import React from 'react';

const StoriesCard = () => {
    return (
        <div className="mt-10 flex h-[100%] w-[100%] items-center justify-center">
            <div className="flex w-[1200px] flex-row justify-center p-5">
                <div className="flex flex-col">
                    <div className="w-[384px]">
                        <h1 className="mt-2 font-eudoxus text-[48px] leading-[56px]">
                            Succes stories <br />
                            shaped by our <br /> experience
                        </h1>
                        <img src="" alt="" />
                    </div>
                </div>

                <div className="mx-10 pt-3">
                    <div className="w-[]">
                        <h1 className="pb-3 pt-2 text-[24px] leading-[32px]">ABOUT US</h1>
                        <p className="text-align pb-4 font-eudoxus text-[18px] leading-[26px] text-black">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vita dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem.
                        </p>
                    </div>
                    <br />
                    <br />
                    <div className="">
                        <h1 className="pb-3 pt-2 text-[26px] leading-[32px]">OUR VALUES</h1>
                        <p className="text-align pb-4 font-eudoxus text-[18px] leading-[26px] text-black">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vita dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoriesCard;
