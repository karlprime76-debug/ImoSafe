import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { MobileBottomNav } from "@/components/site/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImoSafe",
  description: "Trouvez un bien immobilier en toute sécurité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#070B12] dark:text-white">
        <div className="flex min-h-full flex-col pb-[calc(72px+env(safe-area-inset-bottom))] sm:pb-0">{children}</div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
