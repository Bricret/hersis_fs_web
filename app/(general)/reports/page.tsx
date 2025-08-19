import { Suspense } from "react";
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";

import { Card, CardContent } from "@/presentation/components/ui/card";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { Header } from "@/presentation/components/common/Header";
import { Datum as Sale } from "@/core/domain/entity/report-sales.entity";
import { getReportSales } from "@/presentation/services/server/report-sales.server";
import { SalesTableClient } from "./components/SalesTableClient";

interface ReportsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    limit?: string;
  }>;
}

function SalesStatsCards({ sales }: { sales: Sale[] }) {
  const totalSales = sales.length;
  const totalRevenue = sales.reduce(
    (acc, sale) => acc + parseFloat(sale.total),
    0
  );
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalProducts = sales.reduce(
    (acc, sale) =>
      acc +
      (sale.saleDetails || []).reduce(
        (acc2, detail) => acc2 + detail.quantity,
        0
      ),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Ventas
              </p>
              <p className="text-2xl font-bold">{totalSales}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold">C$ {totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Ticket Promedio
              </p>
              <p className="text-2xl font-bold">
                C$ {averageTicket.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Productos Vendidos
              </p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de loading para las estadísticas
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-l-4 border-l-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente del servidor para cargar datos
async function SalesData({
  searchParams,
}: {
  searchParams: ReportsPageProps["searchParams"];
}) {
  // Await searchParams antes de usar sus propiedades
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const search = params.search || "";

  try {
    const reportData = await getReportSales(page, limit, search);
    console.log("reportData", reportData);

    return (
      <>
        <SalesStatsCards sales={reportData.data} />
        <SalesTableClient
          initialData={reportData}
          initialPage={page}
          initialSearch={search}
          initialLimit={limit}
        />
      </>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-red-600 font-medium mb-2">
              Error al cargar los datos de ventas
            </p>
            <p className="text-muted-foreground">
              Por favor, intente nuevamente más tarde
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// Componente principal (Server Component)
export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Reportes de Ventas"
        subTitle="Consulte el historial completo de ventas realizadas"
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <SalesData searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
