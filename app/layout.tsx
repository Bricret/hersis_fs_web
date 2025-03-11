import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { MainSidebar } from "@/presentation/components/ui/main-sidebar";
import { SidebarProvider } from "@/presentation/components/ui/sidebar-context";

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
        className={`${geistSans.variable} font-inter-tight antialiased bg-secondary-background-color`}
      >
        <SidebarProvider>
          <div className="flex h-screen bg-muted/40">
            <MainSidebar />
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
