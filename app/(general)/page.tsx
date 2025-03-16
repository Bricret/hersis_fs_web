"use client";

import { useState } from "react";
import {
  ChartNoAxesCombined,
  ChevronDown,
  LayoutDashboard,
  NotepadText,
  Store,
} from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";

import { DashboardContent } from "@/presentation/components/dashboard/dashboard-content";
import { Header } from "@/presentation/components/common/Header";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-muted">
      <Header
        title="Dashboard"
        subTitle="Bienvenido al sistema de gestión de farmacia"
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-2">
            <TabsList className="bg-secondary-background-color border border-border-main overflow-hidden shadow-sm gap-2">
              <TabsTrigger value="overview">
                <LayoutDashboard
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <ChartNoAxesCombined
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="reports">
                <NotepadText
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Reportes
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <NotepadText
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Notificaciones
              </TabsTrigger>
            </TabsList>
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
