import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Inter stands in for Aeonik, which is the CVSpan brand face.
 * Swap this for a next/font/local Aeonik once the licensed files are in place.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVSpan Portal",
  description: "Company-wide management portal for CVSpan teams, members and programmes.",
};

/** Applies the stored theme before paint so dark mode never flashes. */
const themeScript = `
try {
  var stored = localStorage.getItem('cvspan-theme');
  var dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script id="cvspan-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
