import { MainSidebar } from "@/presentation/components/ui/main-sidebar";
import { SidebarProvider } from "@/presentation/components/ui/sidebar-context";
import React from "react";

export default function MainPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <MainSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
