import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Vaishnavi Tikke — Developer GTM · AI Growth · FDE",
  description:
    "Vaishnavi Tikke — Developer GTM, AI growth and forward deployed engineering. Applying for Founding Growth Lead at Fredrin.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#0b0b0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#hero">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
