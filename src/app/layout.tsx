import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { websiteUrl } from "@/lib/website";
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
  metadataBase: new URL(websiteUrl()),
  title: { default: "CVSpan Portal", template: "%s · CVSpan Portal" },
  description: "Company-wide management portal for CVSpan teams, members and programmes.",
  applicationName: "CVSpan Portal",
  /**
   * The portal is staff-only, so by default nothing in it is indexed or followed. The public
   * sign-in page overrides this, so searching for "CVSpan portal" finds the way in.
   */
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const THEME_COOKIE = "cvspan-theme";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /**
   * The chosen theme is a cookie, so the class is already on the HTML the
   * server sends — no inline script, no flash. With no cookie we leave the
   * class off and `color-scheme: light dark` follows the operating system.
   */
  const store = await cookies();
  const choice = store.get(THEME_COOKIE)?.value;
  const themeClass = choice === "dark" ? "dark" : choice === "light" ? "light" : "";

  return (
    <html lang="en" className={themeClass}>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
