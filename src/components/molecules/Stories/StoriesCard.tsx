import React from 'react';

const StoriesCard = () => {
    return (
        <div className="px-5 py-[60px] md:py-[80px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-y-[40px] lg:flex-row">
                <div className="w-full max-w-[384px]">
                    <h3 className="font-eudoxus text-[34px] font-[500] leading-[42px] md:text-[48px] md:leading-[56px]">
                        Succes Stories Shaped By Our Experience
                    </h3>
                </div>

                <div className="w-full max-w-[696px]">
                    <div className="w-full">
                        <h5 className="pb-3 font-eudoxus text-[24px] font-[500] leading-[32px] text-[#1A1A1A]">
                            ABOUT US
                        </h5>
                        <p className="text-align font-eudoxus text-[18px] font-[300] leading-[26px] text-[#484848]">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem.{' '}
                        </p>
                    </div>

                    <div className="mt-[40px] md:mt-[60px]">
                        <h5 className="pb-3 font-eudoxus text-[24px] font-[500] leading-[32px] text-[#1A1A1A]">
                            OUR VALUES
                        </h5>
                        <p className="text-align font-eudoxus text-[18px] font-[300] leading-[26px] text-[#484848]">
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
