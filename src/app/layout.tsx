import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShaanoShaukat | Luxury Home Decor",
  description:
    "Elevate your living space with ShaanoShaukat. Premium home decor, artisan ceramics, luxury textiles, and curated collections crafted for elegant homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${playfair.variable} ${inter.variable} font-body antialiased bg-[#121212] text-white flex flex-col min-h-screen overflow-x-hidden`}
      >
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
