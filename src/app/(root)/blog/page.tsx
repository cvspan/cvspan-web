import Blog from '@/components/pages/blog';
import React from 'react';
import Bloglanding from '@/components/molecules/Bloglanding/Bloglanding';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import DontMiss from '@/components/molecules/DontMiss/DontMiss';
const page = () => {
    return (
        <>
            <Navbar light />
            <Bloglanding />
            <Blog />
            <DontMiss />
            <Footer />
        </>
    );
};

export default page;
