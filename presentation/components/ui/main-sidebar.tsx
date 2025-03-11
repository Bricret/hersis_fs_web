"use client";

import Link from "next/link";
import {
  BarChart3,
  Bell,
  Box,
  ChevronsUpDown,
  ClipboardList,
  CreditCard,
  Home,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { useSidebar } from "./sidebar-context";
import { SidebarTrigger } from "./sidebar-trigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useState } from "react";

const teams = [
  {
    name: "HersisFS",
    logo: Package,
    plan: "Principal",
  },
  {
    name: "HersisFS 2",
    logo: Package,
    plan: "Sucursal Norte",
  },
  {
    name: "HersisFS 3",
    logo: Package,
    plan: "Sucursal Sur",
  },
];

export function MainSidebar() {
  const { collapsed } = useSidebar();

  const [activeTeam, setActiveTeam] = useState(teams[0]);

  return (
    <div
      className={`border-r border-r-border-main bg-secondary-background-color transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-14 items-center border-b border-b-border-main px-4 w-full">
        <div className="flex items-center gap-2 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className="bg-transparent w-full text-black hover:bg-secondary-background-color shadow-none"
              >
                {<activeTeam.logo className="size-6 shrink-0" />}
                {!collapsed && (
                  <>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeTeam.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeTeam.plan}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={collapsed ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Sucursales
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <team.logo className="size-4 shrink-0" />
                  </div>
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Agrega una sucursal
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2
              className={`mb-2 px-4 text-xs font-semibold tracking-tight ${
                collapsed ? "sr-only" : ""
              }`}
            >
              General
            </h2>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/ventas">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {!collapsed && <span>Ventas</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/inventario">
                <Box className="mr-2 h-4 w-4" />
                {!collapsed && <span>Inventario</span>}
              </Link>
            </Button>
          </div>
          <div className="space-y-1 pt-4">
            <h2
              className={`mb-2 px-4 text-xs font-semibold tracking-tight ${
                collapsed ? "sr-only" : ""
              }`}
            >
              Administración
            </h2>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/usuarios">
                <Users className="mr-2 h-4 w-4" />
                {!collapsed && <span>Usuarios</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/reportes">
                <ClipboardList className="mr-2 h-4 w-4" />
                {!collapsed && <span>Reportes</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/transacciones">
                <CreditCard className="mr-2 h-4 w-4" />
                {!collapsed && <span>Transacciones</span>}
              </Link>
            </Button>
          </div>
          <div className="space-y-1 pt-4">
            <h2
              className={`mb-2 px-4 text-xs font-semibold tracking-tight ${
                collapsed ? "sr-only" : ""
              }`}
            >
              Análisis
            </h2>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/estadisticas">
                <BarChart3 className="mr-2 h-4 w-4" />
                {!collapsed && <span>Estadísticas</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/notificaciones">
                <Bell className="mr-2 h-4 w-4" />
                {!collapsed && <span>Notificaciones</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/sucursales">
                <Package className="mr-2 h-4 w-4" />
                {!collapsed && <span>Sucursales</span>}
              </Link>
            </Button>
          </div>
          <div className="space-y-1 pt-4">
            <h2
              className={`mb-2 px-4 text-xs font-semibold tracking-tight ${
                collapsed ? "sr-only" : ""
              }`}
            >
              Sistema
            </h2>
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
              asChild
            >
              <Link href="/configuracion">
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Configuración</span>}
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
