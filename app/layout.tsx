import "./globals.css";
import type { Metadata } from "next";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/Footer";
import ClientProvider from "@/components/ClientProvider";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${brand.nameAr} | ${brand.nameEn}`,
  description: brand.shortDescriptionAr,
  keywords: [
    brand.nameAr,
    brand.nameEn,
    "مدرسة",
    "تعليم",
    "منصة تعليمية",
    "برامج دراسية",
    "school",
    "education platform",
    "academic programs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body>
        <ClientProvider>
          <AnimatePresence mode="wait">
            <Navbar />
            {children}
            <Footer />
          </AnimatePresence>
        </ClientProvider>
      </body>
    </html>
  );
}
