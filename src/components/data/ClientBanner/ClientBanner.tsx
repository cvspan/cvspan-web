import React from 'react'
import Image ,{ StaticImageData } from 'next/image'
import google from '../../../../public/assets/images/google.svg'
import coinbase from '../../../../public/assets/images/coinbase.svg'
import kellogs from '../../../../public/assets/images/kellogs.svg'
import shopify from '../../../../public/assets/images/shopify.svg'
import amazon from '../../../../public/assets/images/amazon.svg'
import webflow from '../../../../public/assets/images/webflow.svg'
import reddit from '../../../../public/assets/images/reddit.svg'

const ClientBanner = () => {
  return (
    <div className='flex flex-row justify-center items-center pt-5 mx-10 p-5 gap-7'>
        <Image src={kellogs} alt='kellogs' className=""/>
        <Image src={google} alt='google' className=""/>
        <Image src={coinbase} alt='coinbase' className=""/>
        <Image src={shopify} alt='shopify' className=""/>
        <Image src={amazon} alt='amazon' className=""/>
        <Image src={webflow} alt='webflow' className=""/>
        <Image src={reddit} alt='webflow' className=""/>
      
    </div>
  )
}

export default ClientBanner
