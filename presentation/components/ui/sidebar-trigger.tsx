"use client";

import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useSidebar } from "./sidebar";

export function SidebarTrigger() {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      {isMobile ? (
        <PanelRight className="h-8 w-8" />
      ) : (
        <PanelLeft className="h-8 w-8" />
      )}
    </Button>
  );
}
