import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import BlogCards from '@/components/molecules/blogComponents/BlogCards';
import ProfileData from './profileData';
import Navbar from '@/components/molecules/layout/navbar';

const Profile = () => {
    return (
        <div>
            <Navbar light />

            <div className="mt-[60px] border-t-[1px] border-t-[#D1D1D1] px-5 lg:mt-20">
                <div className="mx-auto flex h-full min-h-[50vh] w-full max-w-[1200px]">
                    <div className="flex-1 px-[20px] py-[30px] lg:py-[50px]">
                        <BlogCards containerClassname="py-0 lg:py-0 px-0" maximumInRow="2" />
                    </div>
                    <div className="flex max-w-[300px] flex-1 flex-col border-l-[1px] border-l-[#D1D1D1] py-[30px] lg:py-[50px]">
                        <div className="sticky top-[100px]">
                            <ProfileData />
                        </div>
                    </div>
                </div>
            </div>
            <Footer showBorderTop />
        </div>
    );
};

export default Profile;
