"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Input } from "@/presentation/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";

import { MainSidebar } from "@/presentation/components/ui/main-sidebar";
import { DashboardContent } from "@/presentation/components/dashboard/dashboard-content";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos, ventas, usuarios..."
                className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline-flex">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenido al sistema de gestión de farmacia
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sucursal Principal
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sucursal Principal</DropdownMenuItem>
                <DropdownMenuItem>Sucursal Norte</DropdownMenuItem>
                <DropdownMenuItem>Sucursal Sur</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Todas las Sucursales</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Tabs
          defaultValue="overview"
          className="mt-6"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardContent />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Analytics content would go here */}
              <div className="rounded-lg border bg-card p-6 shadow">
                <h3 className="text-lg font-medium">Análisis de Ventas</h3>
                <p className="text-sm text-muted-foreground">
                  El contenido de análisis se mostrará aquí
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Reports content would go here */}
              <div className="rounded-lg border bg-card p-6 shadow">
                <h3 className="text-lg font-medium">Reportes</h3>
                <p className="text-sm text-muted-foreground">
                  El contenido de reportes se mostrará aquí
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Notifications content would go here */}
              <div className="rounded-lg border bg-card p-6 shadow">
                <h3 className="text-lg font-medium">Notificaciones</h3>
                <p className="text-sm text-muted-foreground">
                  El contenido de notificaciones se mostrará aquí
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
