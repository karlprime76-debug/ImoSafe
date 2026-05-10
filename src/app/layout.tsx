import type { Metadata } from "next";
import "./globals.css";

import { MobileBottomNav } from "@/components/site/MobileBottomNav";

export const metadata: Metadata = {
  title: "ImoSafe",
  description: "Plateforme immobilière de confiance pour trouver, louer, acheter ou réserver un bien avec plus de sécurité.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#070B12] dark:text-white">
        <div className="flex min-h-full flex-col pb-[calc(72px+env(safe-area-inset-bottom))] sm:pb-0">{children}</div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
