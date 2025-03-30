import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/presentation/components/ui/sonner";
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HersisFS - Pharmacy Management System",
  description: "Sistema de gestión para farmacias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${interTight.className} font-inter-tight antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
