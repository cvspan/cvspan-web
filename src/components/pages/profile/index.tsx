import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import BlogCards from '@/components/molecules/blogComponents/publicProfileComponent/blogCards';
import ProfileData from '@/components/molecules/blogComponents/publicProfileComponent/profileData';
import BlogNavbar from '@/components/molecules/blogComponents/reuseables/blogNavbar';

type Props = {};

const Profile = (props: Props) => {
    return (
        <div className="">
            <div className="">
                <BlogNavbar />
            </div>

            <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-3 gap-[50px]">
                <div className="col-span-2 lg:py-28">
                    <BlogCards />
                </div>
                <div className="col-span-1 border-l-[1px] border-[#d1d1d1] lg:py-28">
                    <ProfileData />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
