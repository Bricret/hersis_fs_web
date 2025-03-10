"use client";

import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";

import { InventoryTable } from "./tables/inventory-table";
import { RecentSalesTable } from "./tables/recent-sales-table";
import { SalesChart } from "./tables/sales-chart";

export function DashboardContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$15,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              +20.1%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Productos Vendidos
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              +12.5%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventario Bajo</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 flex items-center">
              <ArrowDown className="mr-1 h-4 w-4" />
              -2
            </span>{" "}
            desde ayer
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Clientes Activos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              +10.1%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ventas Mensuales</CardTitle>
          <CardDescription>
            Comparativa de ventas por sucursal en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <SalesChart />
        </CardContent>
      </Card>
      <Card className="col-span-4 md:col-span-2">
        <CardHeader>
          <CardTitle>Inventario Bajo</CardTitle>
          <CardDescription>
            Productos que requieren reabastecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable />
        </CardContent>
      </Card>
      <Card className="col-span-4 md:col-span-2">
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>Últimas transacciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSalesTable />
        </CardContent>
      </Card>
    </div>
  );
}
