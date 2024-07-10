import React from 'react';

const StoriesCard = () => {
    return (
        <div className="mt-10 flex h-[100%] w-[100%] items-center justify-center py-[120px]">
            <div className="mx-auto flex w-[335px] flex-col justify-between space-y-8 p-5 lg:w-[1200px] lg:flex-row lg:space-y-0">
                <div className="w-full lg:w-[384px]">
                    <h3 className="mt-2 font-eudoxus text-[34px] font-[500] leading-[42px] lg:text-[48px] lg:leading-[56px]">
                        Succes stories <br />
                        shaped by our <br /> experience
                    </h3>
                </div>

                <div className="w-full lg:w-[696px]">
                    <div className="w-[]">
                        <h5 className="pb-3 pt-2 font-eudoxus text-[24px] font-medium leading-[32px]">ABOUT US</h5>
                        <p className="text-align pb-4 font-eudoxus font-normal leading-[26px] text-black lg:text-[18px]">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem.{' '}
                        </p>
                    </div>
                    <br />
                    <br />
                    <div className="">
                        <h5 className="pb-3 pt-2 font-eudoxus text-[24px] font-medium leading-[32px]">OUR VALUES</h5>
                        <p className="text-align pb-4 font-eudoxus text-[18px] font-normal leading-[26px] text-black">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoriesCard;
