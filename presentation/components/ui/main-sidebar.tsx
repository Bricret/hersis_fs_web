"use client";

import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  Command,
  CreditCard,
  CreditCardIcon,
  Frame,
  GalleryVerticalEnd,
  Home,
  NotepadText,
  Package,
  PieChart,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  Store,
  Users,
} from "lucide-react";

import { NavMain } from "@/presentation/components/navigation/nav-main";
import { TeamSwitcher } from "@/presentation/components/navigation/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/presentation/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "SuperUer",
    email: "admin",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Hersis Fs 1",
      logo: GalleryVerticalEnd,
      plan: "Principal",
    },
    {
      name: "Hersis Fs 2",
      logo: AudioWaveform,
      plan: "Sucursal Norte",
    },
    {
      name: "Hersis Fs 3",
      logo: Command,
      plan: "Sucursal Sur",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Ventas",
      url: "/shop",
      icon: ShoppingCart,
    },
    {
      title: "Inventario",
      url: "/inventory",
      icon: Package,
    },
  ],
  navAdmin: [
    {
      title: "Usuarios",
      url: "/users",
      icon: Users,
      isActive: true,
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: NotepadText,
    },
    {
      title: "Transacciones",
      url: "/transactions",
      icon: CreditCard,
    },
  ],
  navAnalist: [
    {
      title: "Estadísticas",
      url: "/stats",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Notificaciones",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Sucursales",
      url: "/branches",
      icon: Store,
    },
  ],
  navManage: [
    {
      title: "Configuracion",
      url: "/settings",
      icon: Settings2,
      isActive: true,
    },
  ],
};

export function MainSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-main-content">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-main-content">
        <NavMain items={data.navMain} title="General" />
        <NavMain items={data.navAdmin} title="Administracion" />
        <NavMain items={data.navAnalist} title="Analisis" />
        <NavMain items={data.navManage} title="Sistema" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
