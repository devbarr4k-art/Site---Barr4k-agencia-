import NoHashLinks from "@/components/NoHashLinks";
import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "BB Agency — Streaming & CS Marketing",
  description:
    "Operating since 2021, BB Agency was created within the streaming industry. Specializing in CS gambling partnerships, creators and events.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <NoHashLinks />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
