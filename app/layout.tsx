import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import "./sections.css";
import { SITE } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-loaded",
  adjustFontFallback: false,
  fallback: ["Iowan Old Style", "Palatino Linotype", "Palatino", "serif"],
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans-loaded",
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.title, description: SITE.description, type: "website", url: "/", siteName: SITE.name },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
};

export const viewport: Viewport = { themeColor: "#F7F6F2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
