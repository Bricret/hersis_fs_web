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
import { CardShine } from "../ui/card-shine";

export function DashboardContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardShine>
        <div className="text-card-foreground flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-base font-medium">Ventas Totales</div>
            <div className="bg-white rounded-full">
              <DollarSign className="h-w-5 w-5 text-black/60" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +20.1%
              </span>{" "}
              desde el mes pasado
            </p>
          </div>
        </div>
      </CardShine>
      <CardShine>
        <div className="text-card-foreground flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-base font-medium">Productos Vendidos</div>
            <div className="bg-white rounded-full">
              <ShoppingCart className="h-w-5 w-5 text-black/60" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +12.5%
              </span>{" "}
              desde el mes pasado
            </p>
          </div>
        </div>
      </CardShine>
      <CardShine>
        <div className="text-card-foreground flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-base font-medium">Inventario Bajo</div>
            <div className="bg-white rounded-full">
              <Package className="h-w-5 w-5 text-black/60" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 flex items-center">
                <ArrowDown className="mr-1 h-4 w-4" />
                -2
              </span>{" "}
              desde ayer
            </p>
          </div>
        </div>
      </CardShine>
      <CardShine>
        <div className="text-card-foreground flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-base font-medium">Clientes Activos</div>
            <div className="bg-white rounded-full">
              <Users className="h-w-5 w-5 text-black/60" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +10.1%
              </span>{" "}
              desde el mes pasado
            </p>
          </div>
        </div>
      </CardShine>
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
