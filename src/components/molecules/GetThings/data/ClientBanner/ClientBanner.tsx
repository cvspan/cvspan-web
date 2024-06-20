import React from 'react';
import Image from 'next/image';
import google from '../../../../public/assets/images/google.svg';
import kellogs from '../../../../public/assets/images/kellogs.svg';
import shopify from '../../../../public/assets/images/shopify.svg';
import webflow from '../../../../public/assets/images/webflow.svg';
import reddit from '../../../../public/assets/images/reddit.svg';

import { amazon, coinbase } from '@/components/exports/images';

const ClientBanner = () => {
    return (
        <div className="mx-10 flex flex-row items-center justify-center gap-7 p-5 pt-5">
            <Image src={kellogs} alt="kellogs" className="" />
            <Image src={google} alt="google" className="" />
            <Image src={coinbase} alt="coinbase" className="" />
            <Image src={shopify} alt="shopify" className="" />
            <Image src={amazon} alt="amazon" className="" />
            <Image src={webflow} alt="webflow" className="" />
            <Image src={reddit} alt="webflow" className="" />
        </div>
    );
};

export default ClientBanner;
