// sidebar-context.tsx
"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  collapsed: false,
  toggleSidebar: () => {},
  setCollapsed: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
