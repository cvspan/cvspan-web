import React from 'react';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import FullScreenAnimatedLoader from '@/components/molecules/FullScreenAnimatedLoader';
import { Toaster } from '@/components/ui/sonner';

import site_metadata from '@/utils/site-metadata';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: site_metadata?.home?.siteName,
    description: site_metadata?.home?.description,
    openGraph: {
        title: site_metadata?.home?.siteName,
        description: site_metadata?.home?.description,
        url: site_metadata?.home?.url,
        siteName: site_metadata?.home?.siteName,
        images: site_metadata?.home?.images,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <GoogleAnalytics gaId="G-2L2X0K8Q5F" />
                <FullScreenAnimatedLoader />
                <NextTopLoader color="#0A1EB9" height={3} />
                {children}
                <Toaster richColors />
            </body>
        </html>
    );
}
