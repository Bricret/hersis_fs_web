"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  LineChart,
  Loader2,
  Package,
  Receipt,
  RefreshCw,
  ShoppingCart,
  Wallet,
  Users,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Calendar as CalendarComponent } from "@/presentation/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Label } from "@/presentation/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";

// Importamos componentes de gráficos
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Header } from "@/presentation/components/common/Header";

// Registramos los componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Tipos de datos
type TimeFilter = "day" | "week" | "month" | "quarter" | "year" | "custom";
type ReportType =
  | "profit-loss"
  | "balance-sheet"
  | "cash-flow"
  | "inventory"
  | "sales"
  | "expenses";

// Datos de ejemplo para ventas mensuales
const monthlySalesData = {
  labels: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  datasets: [
    {
      label: "Ventas 2025",
      data: [
        18500, 19200, 21000, 20100, 22500, 24800, 26500, 27200, 28100, 29500,
        30200, 32000,
      ],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.3,
      fill: true,
    },
    {
      label: "Ventas 2024",
      data: [
        15200, 16500, 17800, 18200, 19500, 21000, 22300, 23100, 24000, 25200,
        26500, 28000,
      ],
      borderColor: "rgb(156, 163, 175)",
      backgroundColor: "rgba(156, 163, 175, 0.1)",
      tension: 0.3,
      fill: true,
      borderDash: [5, 5],
    },
  ],
};

// Datos de ejemplo para gastos por categoría
const expensesByCategoryData = {
  labels: [
    "Productos",
    "Salarios",
    "Alquiler",
    "Servicios",
    "Marketing",
    "Mantenimiento",
    "Otros",
  ],
  datasets: [
    {
      label: "Gastos",
      data: [45000, 28000, 12000, 5000, 3500, 2500, 4000],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
        "rgba(139, 92, 246, 0.7)",
        "rgba(236, 72, 153, 0.7)",
        "rgba(107, 114, 128, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
};

// Datos de ejemplo para ventas por categoría de producto
const salesByCategoryData = {
  labels: [
    "Analgésicos",
    "Antibióticos",
    "Antiinflamatorios",
    "Antialérgicos",
    "Antiácidos",
    "Suplementos",
    "Otros",
  ],
  datasets: [
    {
      label: "Ventas por Categoría",
      data: [32000, 25000, 18000, 15000, 12000, 10000, 8000],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
        "rgba(139, 92, 246, 0.7)",
        "rgba(236, 72, 153, 0.7)",
        "rgba(107, 114, 128, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
};

// Datos de ejemplo para productos más vendidos
const topSellingProducts = [
  {
    id: "PROD001",
    name: "Paracetamol 500mg",
    category: "Analgésicos",
    sales: 1250,
    revenue: 7487.5,
    profit: 3125.0,
  },
  {
    id: "PROD008",
    name: "Aspirina 100mg",
    category: "Analgésicos",
    sales: 980,
    revenue: 4410.0,
    profit: 2156.0,
  },
  {
    id: "PROD002",
    name: "Ibuprofeno 400mg",
    category: "Antiinflamatorios",
    sales: 850,
    revenue: 5525.0,
    profit: 2550.0,
  },
  {
    id: "PROD004",
    name: "Loratadina 10mg",
    category: "Antialérgicos",
    sales: 720,
    revenue: 5220.0,
    profit: 2160.0,
  },
  {
    id: "PROD007",
    name: "Cetirizina 10mg",
    category: "Antialérgicos",
    sales: 680,
    revenue: 5610.0,
    profit: 2380.0,
  },
  {
    id: "PROD003",
    name: "Amoxicilina 500mg",
    category: "Antibióticos",
    sales: 520,
    revenue: 8190.0,
    profit: 3640.0,
  },
  {
    id: "PROD005",
    name: "Omeprazol 20mg",
    category: "Antiácidos",
    sales: 490,
    revenue: 4895.1,
    profit: 2205.0,
  },
  {
    id: "PROD006",
    name: "Diclofenaco 50mg",
    category: "Antiinflamatorios",
    sales: 450,
    revenue: 3487.5,
    profit: 1575.0,
  },
];

// Datos de ejemplo para el estado de inventario
const inventoryStatusData = {
  labels: ["Stock Óptimo", "Stock Bajo", "Stock Crítico", "Agotado"],
  datasets: [
    {
      label: "Estado del Inventario",
      data: [65, 20, 10, 5],
      backgroundColor: [
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
        "rgba(107, 114, 128, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
};

// Datos de ejemplo para el flujo de caja
const cashFlowData = {
  labels: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  datasets: [
    {
      label: "Ingresos",
      data: [
        18500, 19200, 21000, 20100, 22500, 24800, 26500, 27200, 28100, 29500,
        30200, 32000,
      ],
      backgroundColor: "rgba(16, 185, 129, 0.7)",
      borderColor: "rgb(16, 185, 129)",
      borderWidth: 1,
    },
    {
      label: "Gastos",
      data: [
        15000, 15800, 16500, 16200, 17500, 18200, 19500, 20100, 21000, 22000,
        22800, 24000,
      ],
      backgroundColor: "rgba(239, 68, 68, 0.7)",
      borderColor: "rgb(239, 68, 68)",
      borderWidth: 1,
    },
  ],
};

// Datos de ejemplo para KPIs financieros
const financialKPIs = {
  salesRevenue: 320000,
  salesGrowth: 12.5,
  cogs: 192000,
  cogsPercentage: 60,
  grossProfit: 128000,
  grossMargin: 40,
  operatingExpenses: 76800,
  operatingExpensesPercentage: 24,
  netProfit: 51200,
  netMargin: 16,
  inventoryTurnover: 5.2,
  averageTransactionValue: 45.75,
  customerCount: 7000,
  returnRate: 2.3,
};

// Datos de ejemplo para el balance general
const balanceSheetData = {
  assets: {
    current: {
      cash: 85000,
      accountsReceivable: 35000,
      inventory: 120000,
      prepaidExpenses: 8000,
      totalCurrent: 248000,
    },
    fixed: {
      property: 350000,
      equipment: 120000,
      furniture: 45000,
      accumulatedDepreciation: -75000,
      totalFixed: 440000,
    },
    totalAssets: 688000,
  },
  liabilities: {
    current: {
      accountsPayable: 65000,
      shortTermDebt: 25000,
      accruedExpenses: 18000,
      totalCurrent: 108000,
    },
    longTerm: {
      longTermDebt: 180000,
      totalLongTerm: 180000,
    },
    totalLiabilities: 288000,
  },
  equity: {
    capital: 300000,
    retainedEarnings: 100000,
    totalEquity: 400000,
  },
};

// Componente para el filtro de tiempo
function TimeFilterControl({
  currentFilter,
  onFilterChange,
  dateRange,
  onDateRangeChange,
  children,
}: {
  currentFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex">
        <Button
          variant={currentFilter === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("day")}
          className="rounded-r-none"
        >
          Día
        </Button>
        <Button
          variant={currentFilter === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("week")}
          className="rounded-none border-l-0"
        >
          Semana
        </Button>
        <Button
          variant={currentFilter === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("month")}
          className="rounded-none border-l-0"
        >
          Mes
        </Button>
        <Button
          variant={currentFilter === "quarter" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("quarter")}
          className="rounded-none border-l-0"
        >
          Trimestre
        </Button>
        <Button
          variant={currentFilter === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("year")}
          className="rounded-none border-l-0"
        >
          Año
        </Button>
        <Button
          variant={currentFilter === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("custom")}
          className="rounded-l-none border-l-0"
        >
          Personalizado
        </Button>
      </div>

      {currentFilter === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {dateRange.from.toLocaleDateString()} -{" "}
                    {dateRange.to.toLocaleDateString()}
                  </>
                ) : (
                  dateRange.from.toLocaleDateString()
                )
              ) : (
                "Seleccionar fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={{ from: dateRange.from!, to: dateRange.to }}
              onSelect={(range: DateRange | undefined) =>
                onDateRangeChange(range || { from: undefined, to: undefined })
              }
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
      {children}
    </div>
  );
}

// Componente para tarjetas de KPI
function KPICard({
  title,
  value,
  change,
  icon,
  trend = "neutral",
  format = "currency",
}: {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  format?: "currency" | "percentage" | "number" | "decimal";
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `$${val.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      case "percentage":
        return `${val}%`;
      case "decimal":
        return val.toLocaleString("es-ES", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
      default:
        return val.toLocaleString("es-ES");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground">
            <span
              className={`flex items-center ${
                trend === "up"
                  ? "text-emerald-500"
                  : trend === "down"
                  ? "text-rose-500"
                  : "text-gray-500"
              }`}
            >
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : trend === "down" ? (
                <ArrowDown className="mr-1 h-4 w-4" />
              ) : null}
              {change > 0 ? "+" : ""}
              {change}% desde el período anterior
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para generar reportes
function ReportGenerator({
  open,
  onClose,
  onGenerate,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (
    reportType: ReportType,
    format: string,
    dateRange: { from?: Date; to?: Date }
  ) => void;
}) {
  const [reportType, setReportType] = useState<ReportType>("profit-loss");
  const [format, setFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulamos la generación del reporte
    setTimeout(() => {
      onGenerate(reportType, format, dateRange);
      setIsGenerating(false);
      onClose();
    }, 1500);
  };

  const getReportTypeName = (type: ReportType) => {
    switch (type) {
      case "profit-loss":
        return "Estado de Resultados";
      case "balance-sheet":
        return "Balance General";
      case "cash-flow":
        return "Flujo de Caja";
      case "inventory":
        return "Reporte de Inventario";
      case "sales":
        return "Reporte de Ventas";
      case "expenses":
        return "Reporte de Gastos";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generar Reporte</DialogTitle>
          <DialogDescription>
            Seleccione el tipo de reporte y el período de tiempo para generar
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de Reporte</Label>
            <Select
              value={reportType}
              onValueChange={(value: ReportType) => setReportType(value)}
            >
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Seleccionar tipo de reporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit-loss">
                  Estado de Resultados
                </SelectItem>
                <SelectItem value="balance-sheet">Balance General</SelectItem>
                <SelectItem value="cash-flow">Flujo de Caja</SelectItem>
                <SelectItem value="inventory">Reporte de Inventario</SelectItem>
                <SelectItem value="sales">Reporte de Ventas</SelectItem>
                <SelectItem value="expenses">Reporte de Gastos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {dateRange.from.toLocaleDateString()} -{" "}
                        {dateRange.to.toLocaleDateString()}
                      </>
                    ) : (
                      dateRange.from.toLocaleDateString()
                    )
                  ) : (
                    "Seleccionar fechas"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: dateRange.from || undefined,
                    to: dateRange.to || undefined,
                  }}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({ from: range.from, to: range.to });
                    } else {
                      setDateRange({ from: undefined, to: undefined });
                    }
                  }}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generar {getReportTypeName(reportType)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para el estado de resultados
function ProfitLossStatement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Resultados</CardTitle>
        <CardDescription>Período: Enero - Diciembre 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Ventas</TableCell>
              <TableCell className="text-right">
                ${financialKPIs.salesRevenue.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Costo de Ventas (COGS)
              </TableCell>
              <TableCell className="text-right">
                ${financialKPIs.cogs.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {financialKPIs.cogsPercentage}%
              </TableCell>
            </TableRow>
            <TableRow className="border-t-2">
              <TableCell className="font-medium">Utilidad Bruta</TableCell>
              <TableCell className="text-right font-medium">
                ${financialKPIs.grossProfit.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {financialKPIs.grossMargin}%
              </TableCell>
            </TableRow>

            <TableRow className="border-t">
              <TableCell
                colSpan={3}
                className="py-2 text-sm font-medium text-muted-foreground"
              >
                Gastos Operativos
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-6">Salarios</TableCell>
              <TableCell className="text-right">$42,000</TableCell>
              <TableCell className="text-right">13.1%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-6">Alquiler</TableCell>
              <TableCell className="text-right">$12,000</TableCell>
              <TableCell className="text-right">3.8%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-6">Servicios</TableCell>
              <TableCell className="text-right">$8,500</TableCell>
              <TableCell className="text-right">2.7%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-6">Marketing</TableCell>
              <TableCell className="text-right">$6,300</TableCell>
              <TableCell className="text-right">2.0%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-6">Otros Gastos</TableCell>
              <TableCell className="text-right">$8,000</TableCell>
              <TableCell className="text-right">2.5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Total Gastos Operativos
              </TableCell>
              <TableCell className="text-right">
                ${financialKPIs.operatingExpenses.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {financialKPIs.operatingExpensesPercentage}%
              </TableCell>
            </TableRow>

            <TableRow className="border-t-2">
              <TableCell className="font-medium">Utilidad Operativa</TableCell>
              <TableCell className="text-right font-medium">
                $
                {(
                  financialKPIs.grossProfit - financialKPIs.operatingExpenses
                ).toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {financialKPIs.grossMargin -
                  financialKPIs.operatingExpensesPercentage}
                %
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">Impuestos</TableCell>
              <TableCell className="text-right">$12,800</TableCell>
              <TableCell className="text-right">4.0%</TableCell>
            </TableRow>

            <TableRow className="border-t-2">
              <TableCell className="font-bold text-lg">Utilidad Neta</TableCell>
              <TableCell className="text-right font-bold text-lg">
                ${financialKPIs.netProfit.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-bold text-lg">
                {financialKPIs.netMargin}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Componente para el balance general
function BalanceSheet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance General</CardTitle>
        <CardDescription>Al 31 de Diciembre de 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium">Activos</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-2 text-sm font-medium text-muted-foreground"
                  >
                    Activos Corrientes
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">
                    Efectivo y Equivalentes
                  </TableCell>
                  <TableCell className="text-right">
                    ${balanceSheetData.assets.current.cash.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Cuentas por Cobrar</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.assets.current.accountsReceivable.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Inventario</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.assets.current.inventory.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Gastos Prepagados</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.assets.current.prepaidExpenses.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Total Activos Corrientes
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {balanceSheetData.assets.current.totalCurrent.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-2 text-sm font-medium text-muted-foreground"
                  >
                    Activos Fijos
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Propiedad</TableCell>
                  <TableCell className="text-right">
                    ${balanceSheetData.assets.fixed.property.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Equipamiento</TableCell>
                  <TableCell className="text-right">
                    ${balanceSheetData.assets.fixed.equipment.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Mobiliario</TableCell>
                  <TableCell className="text-right">
                    ${balanceSheetData.assets.fixed.furniture.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Depreciación Acumulada</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.assets.fixed.accumulatedDepreciation.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Total Activos Fijos
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${balanceSheetData.assets.fixed.totalFixed.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow className="border-t-2">
                  <TableCell className="font-bold">TOTAL ACTIVOS</TableCell>
                  <TableCell className="text-right font-bold">
                    ${balanceSheetData.assets.totalAssets.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Pasivos y Patrimonio</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-2 text-sm font-medium text-muted-foreground"
                  >
                    Pasivos Corrientes
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Cuentas por Pagar</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.liabilities.current.accountsPayable.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Deuda a Corto Plazo</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.liabilities.current.shortTermDebt.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Gastos Acumulados</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.liabilities.current.accruedExpenses.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Total Pasivos Corrientes
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {balanceSheetData.liabilities.current.totalCurrent.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-2 text-sm font-medium text-muted-foreground"
                  >
                    Pasivos a Largo Plazo
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Deuda a Largo Plazo</TableCell>
                  <TableCell className="text-right">
                    $
                    {balanceSheetData.liabilities.longTerm.longTermDebt.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Total Pasivos a Largo Plazo
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {balanceSheetData.liabilities.longTerm.totalLongTerm.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">TOTAL PASIVOS</TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {balanceSheetData.liabilities.totalLiabilities.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-2 text-sm font-medium text-muted-foreground"
                  >
                    Patrimonio
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Capital</TableCell>
                  <TableCell className="text-right">
                    ${balanceSheetData.equity.capital.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Ganancias Retenidas</TableCell>
                  <TableCell className="text-right">
                    ${balanceSheetData.equity.retainedEarnings.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Total Patrimonio
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${balanceSheetData.equity.totalEquity.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow className="border-t-2">
                  <TableCell className="font-bold">
                    TOTAL PASIVOS Y PATRIMONIO
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    $
                    {(
                      balanceSheetData.liabilities.totalLiabilities +
                      balanceSheetData.equity.totalEquity
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente principal
export default function EstadisticasPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Función para refrescar los datos
  const refreshData = () => {
    setIsRefreshing(true);

    // Simulamos la actualización de datos
    setTimeout(() => {
      setIsRefreshing(false);
      toast("Datos actualizados", {
        description: "Los indicadores han sido actualizados correctamente",
      });
    }, 1500);
  };

  // Función para generar reportes
  const generateReport = (
    reportType: ReportType,
    format: string,
    dateRange: { from?: Date; to?: Date }
  ) => {
    const reportNames = {
      "profit-loss": "Estado de Resultados",
      "balance-sheet": "Balance General",
      "cash-flow": "Flujo de Caja",
      inventory: "Reporte de Inventario",
      sales: "Reporte de Ventas",
      expenses: "Reporte de Gastos",
    };

    toast("Reporte generado", {
      description: `${
        reportNames[reportType]
      } en formato ${format.toUpperCase()} ha sido generado correctamente`,
    });
  };

  // Opciones comunes para los gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          title="Estadísticas y Contabilidad"
          subTitle="Análisis financiero y operativo de la farmacia"
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <TimeFilterControl
              currentFilter={timeFilter}
              onFilterChange={setTimeFilter}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="gap-2"
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowReportGenerator(true)}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generar Reporte
                </Button>
              </div>
            </TimeFilterControl>

            <Tabs
              defaultValue="dashboard"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="sales">Ventas</TabsTrigger>
                <TabsTrigger value="inventory">Inventario</TabsTrigger>
                <TabsTrigger value="expenses">Gastos</TabsTrigger>
                <TabsTrigger value="financial">Financiero</TabsTrigger>
              </TabsList>

              {/* Dashboard principal */}
              <TabsContent value="dashboard" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Ventas Totales"
                    value={financialKPIs.salesRevenue}
                    change={financialKPIs.salesGrowth}
                    icon={<ShoppingCart />}
                    trend="up"
                  />
                  <KPICard
                    title="Margen Bruto"
                    value={financialKPIs.grossMargin}
                    change={2.5}
                    icon={<Wallet />}
                    trend="up"
                    format="percentage"
                  />
                  <KPICard
                    title="Utilidad Neta"
                    value={financialKPIs.netProfit}
                    change={3.2}
                    icon={<CreditCard />}
                    trend="up"
                  />
                  <KPICard
                    title="Rotación de Inventario"
                    value={financialKPIs.inventoryTurnover}
                    change={0.3}
                    icon={<Package />}
                    trend="up"
                    format="decimal"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas Mensuales</CardTitle>
                      <CardDescription>
                        Comparativa de ventas 2024-2025
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line data={monthlySalesData} options={chartOptions} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas por Categoría</CardTitle>
                      <CardDescription>
                        Distribución de ventas por tipo de producto
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Pie
                          data={salesByCategoryData}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                position: "right",
                                align: "center",
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Flujo de Caja</CardTitle>
                      <CardDescription>Ingresos vs. Gastos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Bar
                          data={cashFlowData}
                          options={{
                            ...chartOptions,
                            scales: {
                              x: {
                                stacked: false,
                              },
                              y: {
                                stacked: false,
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Gastos por Categoría</CardTitle>
                      <CardDescription>
                        Distribución de gastos operativos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Pie
                          data={expensesByCategoryData}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                position: "right",
                                align: "center",
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                    <CardDescription>
                      Top productos por volumen de ventas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">
                            Unidades Vendidas
                          </TableHead>
                          <TableHead className="text-right">Ingresos</TableHead>
                          <TableHead className="text-right">Utilidad</TableHead>
                          <TableHead className="text-right">Margen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topSellingProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {product.sales.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {product.revenue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {product.profit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {(
                                (product.profit / product.revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña de Ventas */}
              <TabsContent value="sales" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Ventas Totales"
                    value={financialKPIs.salesRevenue}
                    change={financialKPIs.salesGrowth}
                    icon={<ShoppingCart />}
                    trend="up"
                  />
                  <KPICard
                    title="Ticket Promedio"
                    value={financialKPIs.averageTransactionValue}
                    change={1.8}
                    icon={<Receipt />}
                    trend="up"
                  />
                  <KPICard
                    title="Clientes"
                    value={financialKPIs.customerCount}
                    change={5.2}
                    icon={<Users />}
                    trend="up"
                    format="number"
                  />
                  <KPICard
                    title="Tasa de Devolución"
                    value={financialKPIs.returnRate}
                    change={-0.5}
                    icon={<RefreshCw />}
                    trend="down"
                    format="percentage"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas Mensuales</CardTitle>
                      <CardDescription>
                        Comparativa de ventas 2024-2025
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line data={monthlySalesData} options={chartOptions} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas por Categoría</CardTitle>
                      <CardDescription>
                        Distribución de ventas por tipo de producto
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Pie
                          data={salesByCategoryData}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                position: "right",
                                align: "center",
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                    <CardDescription>
                      Top productos por volumen de ventas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">
                            Unidades Vendidas
                          </TableHead>
                          <TableHead className="text-right">Ingresos</TableHead>
                          <TableHead className="text-right">Utilidad</TableHead>
                          <TableHead className="text-right">Margen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topSellingProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {product.sales.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {product.revenue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {product.profit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {(
                                (product.profit / product.revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña de Inventario */}
              <TabsContent value="inventory" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Valor de Inventario"
                    value={120000}
                    icon={<Package />}
                  />
                  <KPICard
                    title="Rotación de Inventario"
                    value={financialKPIs.inventoryTurnover}
                    change={0.3}
                    icon={<RefreshCw />}
                    trend="up"
                    format="decimal"
                  />
                  <KPICard
                    title="Productos en Stock"
                    value={450}
                    icon={<Package />}
                    format="number"
                  />
                  <KPICard
                    title="Productos Agotados"
                    value={15}
                    change={-2}
                    icon={<AlertCircle />}
                    trend="down"
                    format="number"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estado del Inventario</CardTitle>
                      <CardDescription>
                        Distribución por nivel de stock
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Pie
                          data={inventoryStatusData}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                position: "right",
                                align: "center",
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Productos por Categoría</CardTitle>
                      <CardDescription>
                        Distribución del inventario por categoría
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Bar
                          data={{
                            labels: [
                              "Analgésicos",
                              "Antibióticos",
                              "Antiinflamatorios",
                              "Antialérgicos",
                              "Antiácidos",
                              "Suplementos",
                              "Otros",
                            ],
                            datasets: [
                              {
                                label: "Cantidad de Productos",
                                data: [85, 45, 65, 55, 40, 35, 25],
                                backgroundColor: "rgba(59, 130, 246, 0.7)",
                              },
                            ],
                          }}
                          options={chartOptions}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Productos con Stock Bajo</CardTitle>
                    <CardDescription>
                      Productos que requieren reabastecimiento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">
                            Stock Actual
                          </TableHead>
                          <TableHead className="text-right">
                            Stock Mínimo
                          </TableHead>
                          <TableHead className="text-right">
                            Último Pedido
                          </TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Amoxicilina 500mg
                          </TableCell>
                          <TableCell>Antibióticos</TableCell>
                          <TableCell className="text-right">5</TableCell>
                          <TableCell className="text-right">20</TableCell>
                          <TableCell className="text-right">
                            15/03/2025
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">Crítico</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Omeprazol 20mg
                          </TableCell>
                          <TableCell>Antiácidos</TableCell>
                          <TableCell className="text-right">12</TableCell>
                          <TableCell className="text-right">25</TableCell>
                          <TableCell className="text-right">
                            20/03/2025
                          </TableCell>
                          <TableCell>
                            <Badge variant="alert">Bajo</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Loratadina 10mg
                          </TableCell>
                          <TableCell>Antialérgicos</TableCell>
                          <TableCell className="text-right">15</TableCell>
                          <TableCell className="text-right">30</TableCell>
                          <TableCell className="text-right">
                            18/03/2025
                          </TableCell>
                          <TableCell>
                            <Badge variant="alert">Bajo</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Diclofenaco 50mg
                          </TableCell>
                          <TableCell>Antiinflamatorios</TableCell>
                          <TableCell className="text-right">8</TableCell>
                          <TableCell className="text-right">20</TableCell>
                          <TableCell className="text-right">
                            12/03/2025
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">Crítico</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Vitamina C 500mg
                          </TableCell>
                          <TableCell>Suplementos</TableCell>
                          <TableCell className="text-right">10</TableCell>
                          <TableCell className="text-right">25</TableCell>
                          <TableCell className="text-right">
                            10/03/2025
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">Crítico</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña de Gastos */}
              <TabsContent value="expenses" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Gastos Totales"
                    value={financialKPIs.operatingExpenses}
                    change={1.2}
                    icon={<Receipt />}
                    trend="up"
                  />
                  <KPICard
                    title="Gastos/Ventas"
                    value={financialKPIs.operatingExpensesPercentage}
                    change={-0.5}
                    icon={<BarChart3 />}
                    trend="down"
                    format="percentage"
                  />
                  <KPICard
                    title="Costo de Ventas"
                    value={financialKPIs.cogs}
                    change={2.1}
                    icon={<ShoppingCart />}
                    trend="up"
                  />
                  <KPICard
                    title="COGS/Ventas"
                    value={financialKPIs.cogsPercentage}
                    change={-0.8}
                    icon={<LineChart />}
                    trend="down"
                    format="percentage"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gastos por Categoría</CardTitle>
                      <CardDescription>
                        Distribución de gastos operativos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Pie
                          data={expensesByCategoryData}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                position: "right",
                                align: "center",
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evolución de Gastos</CardTitle>
                      <CardDescription>
                        Tendencia mensual de gastos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line
                          data={{
                            labels: [
                              "Ene",
                              "Feb",
                              "Mar",
                              "Abr",
                              "May",
                              "Jun",
                              "Jul",
                              "Ago",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dic",
                            ],
                            datasets: [
                              {
                                label: "Gastos Operativos",
                                data: [
                                  6200, 6500, 6300, 6800, 7100, 6900, 7300,
                                  7500, 7200, 7600, 7800, 8000,
                                ],
                                borderColor: "rgb(239, 68, 68)",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                tension: 0.3,
                                fill: true,
                              },
                            ],
                          }}
                          options={chartOptions}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalle de Gastos</CardTitle>
                    <CardDescription>
                      Desglose de gastos por categoría
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Subcategoría</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead className="text-right">
                            % del Total
                          </TableHead>
                          <TableHead className="text-right">
                            Tendencia
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Salarios
                          </TableCell>
                          <TableCell>Personal de Ventas</TableCell>
                          <TableCell className="text-right">$25,000</TableCell>
                          <TableCell className="text-right">32.6%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="success"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                              2.5%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Salarios
                          </TableCell>
                          <TableCell>Personal Administrativo</TableCell>
                          <TableCell className="text-right">$17,000</TableCell>
                          <TableCell className="text-right">22.1%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="success"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                              1.8%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Alquiler
                          </TableCell>
                          <TableCell>Local Comercial</TableCell>
                          <TableCell className="text-right">$12,000</TableCell>
                          <TableCell className="text-right">15.6%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="secondary"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              0.0%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Servicios
                          </TableCell>
                          <TableCell>Electricidad</TableCell>
                          <TableCell className="text-right">$3,200</TableCell>
                          <TableCell className="text-right">4.2%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="destructive"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                              5.2%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Servicios
                          </TableCell>
                          <TableCell>Agua</TableCell>
                          <TableCell className="text-right">$850</TableCell>
                          <TableCell className="text-right">1.1%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="destructive"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                              3.5%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Servicios
                          </TableCell>
                          <TableCell>Internet y Telefonía</TableCell>
                          <TableCell className="text-right">$950</TableCell>
                          <TableCell className="text-right">1.2%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="secondary"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              0.0%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Marketing
                          </TableCell>
                          <TableCell>Publicidad Digital</TableCell>
                          <TableCell className="text-right">$2,500</TableCell>
                          <TableCell className="text-right">3.3%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="success"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                              12.5%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Marketing
                          </TableCell>
                          <TableCell>Material Impreso</TableCell>
                          <TableCell className="text-right">$1,000</TableCell>
                          <TableCell className="text-right">1.3%</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="alert"
                              className="flex items-center justify-center gap-1 w-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                              5.0%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña Financiera */}
              <TabsContent value="financial" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Ventas Totales"
                    value={financialKPIs.salesRevenue}
                    change={financialKPIs.salesGrowth}
                    icon={<ShoppingCart />}
                    trend="up"
                  />
                  <KPICard
                    title="Utilidad Bruta"
                    value={financialKPIs.grossProfit}
                    change={3.5}
                    icon={<Wallet />}
                    trend="up"
                  />
                  <KPICard
                    title="Margen Neto"
                    value={financialKPIs.netMargin}
                    change={1.2}
                    icon={<LineChart />}
                    trend="up"
                    format="percentage"
                  />
                  <KPICard
                    title="Utilidad Neta"
                    value={financialKPIs.netProfit}
                    change={3.2}
                    icon={<CreditCard />}
                    trend="up"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Flujo de Caja</CardTitle>
                      <CardDescription>Ingresos vs. Gastos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Bar
                          data={cashFlowData}
                          options={{
                            ...chartOptions,
                            scales: {
                              x: {
                                stacked: false,
                              },
                              y: {
                                stacked: false,
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evolución de Márgenes</CardTitle>
                      <CardDescription>
                        Margen bruto y neto por mes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <Line
                          data={{
                            labels: [
                              "Ene",
                              "Feb",
                              "Mar",
                              "Abr",
                              "May",
                              "Jun",
                              "Jul",
                              "Ago",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dic",
                            ],
                            datasets: [
                              {
                                label: "Margen Bruto",
                                data: [
                                  38, 39, 38.5, 40, 39.5, 41, 40.5, 41.5, 42,
                                  41.5, 42.5, 43,
                                ],
                                borderColor: "rgb(16, 185, 129)",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                tension: 0.3,
                                fill: false,
                              },
                              {
                                label: "Margen Neto",
                                data: [
                                  14, 14.5, 14.2, 15, 14.8, 15.5, 15.2, 16,
                                  16.5, 16.2, 16.8, 17,
                                ],
                                borderColor: "rgb(59, 130, 246)",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                tension: 0.3,
                                fill: false,
                              },
                            ],
                          }}
                          options={{
                            ...chartOptions,
                            scales: {
                              y: {
                                ticks: {
                                  callback: (value) => value + "%",
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="profit-loss" className="w-full">
                  <TabsList>
                    <TabsTrigger value="profit-loss">
                      Estado de Resultados
                    </TabsTrigger>
                    <TabsTrigger value="balance-sheet">
                      Balance General
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profit-loss" className="mt-4">
                    <ProfitLossStatement />
                  </TabsContent>

                  <TabsContent value="balance-sheet" className="mt-4">
                    <BalanceSheet />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      {/* Diálogo para generar reportes */}
      <ReportGenerator
        open={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
        onGenerate={generateReport}
      />
    </div>
  );
}
