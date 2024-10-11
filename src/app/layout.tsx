import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import FullScreenAnimatedLoader from '@/components/molecules/FullScreenAnimatedLoader';
import { Toaster } from '@/components/ui/sonner';
import GoogleAnalyticsScript from '@/utils/google-analytics-script';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CV Span',
    description: 'We Create Awesome Stuff',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <GoogleAnalyticsScript />
                <FullScreenAnimatedLoader />
                <NextTopLoader color="#0A1EB9" height={3} />
                {children}
                <Toaster richColors />
            </body>
        </html>
    );
}
