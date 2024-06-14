import React from 'react';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
export default function Homepage() {
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <h1>HOME</h1>
            </main>
            <Footer />
        </>
    );
}
