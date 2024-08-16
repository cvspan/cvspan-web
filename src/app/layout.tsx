import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import FullScreenAnimatedLoader from '@/components/molecules/FullScreenAnimatedLoader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CV Span',
    description: 'CV Span website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <FullScreenAnimatedLoader />
                <NextTopLoader color="#0A1EB9" height={3} />
                {children}
            </body>
        </html>
    );
}
