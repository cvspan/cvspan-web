import Image from 'next/image'
import React from 'react'
import Rectangle from '../../../../public/assets/images/Rectangle.png';

const BlogPostLanding = () => {
  return (
    <>
  
    <div className="mx-auto w-full max-w-[1200px] pb-24 pt-10">
        <div>
            <h1 className='text-[96px] leading-[103.68px] font-pp-mori'>
        Top 10 Digital Design Agencies

            </h1>
            <div className='flex items-center mt-14 gap-10'>
                <div className='flex items-center gap-3'>

                <div className='h-[48px] w-[48px] rounded-full bg-[#D9D9D9]'></div>
                <div className='flex flex-col'>
                <h1 className='text-[16px] leading-5 font-eudoxus font-[400]'>Moses Arfo</h1>
                <span className='text-[12px] text-[#A3A3A3] leading-[20px] font-eudoxus font-[400]'>Founder & CEO</span>
                </div>
              
                </div>
                <div className='flex gap-5 items-center'>
                <p className='bg-[#F4F4F4] rounded-[20px] p-2 text-[14px] font-eudoxus font-medium'>Article</p>
                <p className='font-eudoxus font-[400] text-[14px] leading-[22px] text-[#1A1A1A]'>3 mins read</p>
                </div>
               
            </div>
        </div>
    </div>
    <Image src={Rectangle} alt=''/>
    </>
  )
}

export default BlogPostLanding