"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  Box,
  ClipboardList,
  CreditCard,
  Home,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";

export function MainSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`border-r bg-background transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {!collapsed && <span>PharmaSys</span>}
          <Package className="h-6 w-6" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
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
                <Store className="mr-2 h-4 w-4" />
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
