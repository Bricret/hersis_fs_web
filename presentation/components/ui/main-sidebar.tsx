"use client";

import {
  AudioWaveform,
  Bell,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  Home,
  NotepadText,
  Package,
  PieChart,
  Settings2,
  ShoppingCart,
  Store,
  Users,
  WalletCards,
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
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";

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
      title: "Caja",
      url: "/cashier",
      icon: WalletCards,
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
    {
      title: "Estadísticas",
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
      title: "Configuración",
      url: "/settings",
      icon: Settings2,
      isActive: true,
    },
  ],
};

export function MainSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { hasRouteAccess } = useAuthFetch();

  // Filtrar las rutas según el rol del usuario
  const filteredNavMain = data.navMain.filter((item) =>
    hasRouteAccess(item.url)
  );
  const filteredNavManage = data.navManage.filter((item) =>
    hasRouteAccess(item.url)
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-quaternary-background-color">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-quaternary-background-color">
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter className="bg-quaternary-background-color">
        <NavMain items={filteredNavManage} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
