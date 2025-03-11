// sidebar-trigger.tsx
"use client";

import { ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useSidebar } from "./sidebar-context";

export function SidebarTrigger() {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      {collapsed ? (
        <PanelRight className="h-8 w-8" />
      ) : (
        <PanelLeft className="h-8 w-8" />
      )}
    </Button>
  );
}
