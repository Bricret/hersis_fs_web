import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const geistSans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HersisFS - Pharmacy Management System",
  description: "HersisFS - Pharmacy Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-secondary-background-color`}
      >
        {children}
      </body>
    </html>
  );
}
