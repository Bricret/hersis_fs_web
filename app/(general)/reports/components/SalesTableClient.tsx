"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Loader2,
  Search,
  ShoppingCart,
  User,
  CreditCard,
  Package,
  Clock,
  ChevronLeft,
  ChevronRight,
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
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import { toast } from "sonner";
import {
  ReportSales,
  Datum as Sale,
} from "@/core/domain/entity/report-sales.entity";

// Tipos de filtros
interface SalesFilters {
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
  branches: string[];
  users: string[];
  minAmount?: number;
  maxAmount?: number;
}

interface SalesTableClientProps {
  initialData: ReportSales;
  initialPage: number;
  initialSearch: string;
}

// Componente para mostrar detalles de una venta
function SaleDetailsDialog({
  sale,
  open,
  onClose,
}: {
  sale: Sale | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!sale) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeStyle: "medium",
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Detalles de la Venta #{sale.id}
          </DialogTitle>
          <DialogDescription>
            Información completa de la venta realizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información general */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Información de la Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{formatDate(sale.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID Venta:</span>
                  <span className="font-medium">#{sale.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-green-600">
                    ${parseFloat(sale.total).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vendedor:</span>
                  <span className="font-medium">{sale.user.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sucursal:</span>
                  <span className="font-medium">{sale.branch.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge
                    variant={sale.user.is_active ? "default" : "secondary"}
                  >
                    {sale.user.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productos vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos Vendidos ({sale.saleDetails.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.saleDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className="font-medium">
                        {detail.productName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {detail.product_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {detail.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${parseFloat(detail.unit_price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${parseFloat(detail.subtotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Información de caja */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Información de Caja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Caja:</span>
                <span className="font-medium">{sale.cash_register.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Apertura:</span>
                <span className="font-medium">
                  {formatDate(sale.cash_register.fecha_apertura)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado:</span>
                <Badge
                  variant={
                    sale.cash_register.estado === "abierta"
                      ? "default"
                      : "secondary"
                  }
                >
                  {sale.cash_register.estado}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SalesTableClient({
  initialData,
  initialPage,
  initialSearch,
}: SalesTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);

  const [filters, setFilters] = useState<SalesFilters>({
    search: initialSearch,
    branches: [],
    users: [],
  });

  // Datos del servidor
  const { data: sales, metadata } = initialData;

  // Obtener datos únicos para filtros
  const uniqueBranches =
    sales.length > 0
      ? Array.from(new Set(sales.map((sale) => sale.branch.id))).map((id) => {
          const sale = sales.find((s) => s.branch.id === id);
          return { id, name: sale?.branch.name || "" };
        })
      : [];

  const uniqueUsers =
    sales.length > 0
      ? Array.from(new Set(sales.map((sale) => sale.user.id))).map((id) => {
          const sale = sales.find((s) => s.user.id === id);
          return { id, name: sale?.user.name || "" };
        })
      : [];

  // Filtrar ventas localmente (filtros adicionales)
  const filteredSales = sales.filter((sale) => {
    const matchesBranch =
      filters.branches.length === 0 ||
      filters.branches.includes(sale.branch.id);
    const matchesUser =
      filters.users.length === 0 || filters.users.includes(sale.user.id);

    const saleDate = new Date(sale.date);
    const matchesDateFrom = !filters.dateFrom || saleDate >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || saleDate <= filters.dateTo;

    const saleAmount = parseFloat(sale.total);
    const matchesMinAmount =
      !filters.minAmount || saleAmount >= filters.minAmount;
    const matchesMaxAmount =
      !filters.maxAmount || saleAmount <= filters.maxAmount;

    return (
      matchesBranch &&
      matchesUser &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  // Función para navegar con nuevos parámetros
  const navigateWithParams = (
    newParams: Record<string, string | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/reports?${params.toString()}`);
  };

  // Función para buscar
  const handleSearch = (value: string) => {
    setSearchValue(value);
    navigateWithParams({ search: value || undefined, page: undefined });
  };

  // Función para cambiar página
  const goToPage = (page: number) => {
    navigateWithParams({ page: page.toString() });
  };

  // Función para exportar reportes
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Reporte exportado exitosamente", {
        description: `Se ha generado un reporte con ${filteredSales.length} ventas`,
      });
    }, 2000);
  };

  // Función para mostrar detalles de una venta
  const showSaleDetailsDialog = (sale: Sale) => {
    setSelectedSale(sale);
    setShowSaleDetails(true);
  };

  // Función para formatear fecha
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <>
      {/* Sección de filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtros de Búsqueda</CardTitle>
              <CardDescription>
                Utilice los filtros para encontrar ventas específicas
              </CardDescription>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting || filteredSales.length === 0}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Buscar por ID, vendedor..."
                  className="pl-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(searchValue);
                    }
                  }}
                />
              </div>
            </div>

            {/* Filtro por sucursal */}
            <div className="space-y-2">
              <Label>Sucursal</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filters.branches.length === 0
                      ? "Todas las sucursales"
                      : `${filters.branches.length} seleccionadas`}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sucursales</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueBranches.map((branch) => (
                    <DropdownMenuCheckboxItem
                      key={branch.id}
                      checked={filters.branches.includes(branch.id)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          branches: checked
                            ? [...prev.branches, branch.id]
                            : prev.branches.filter((id) => id !== branch.id),
                        }));
                      }}
                    >
                      {branch.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filtro por usuario */}
            <div className="space-y-2">
              <Label>Vendedor</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filters.users.length === 0
                      ? "Todos los vendedores"
                      : `${filters.users.length} seleccionados`}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Vendedores</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueUsers.map((user) => (
                    <DropdownMenuCheckboxItem
                      key={user.id}
                      checked={filters.users.includes(user.id)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          users: checked
                            ? [...prev.users, user.id]
                            : prev.users.filter((id) => id !== user.id),
                        }));
                      }}
                    >
                      {user.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filtro por fecha */}
            <div className="space-y-2">
              <Label>Rango de fechas</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {filters.dateFrom ? (
                        filters.dateTo ? (
                          <>
                            {filters.dateFrom.toLocaleDateString()} -{" "}
                            {filters.dateTo.toLocaleDateString()}
                          </>
                        ) : (
                          filters.dateFrom.toLocaleDateString()
                        )
                      ) : (
                        "Seleccionar fechas"
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: filters.dateFrom,
                      to: filters.dateTo,
                    }}
                    onSelect={(range) => {
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: range?.from,
                        dateTo: range?.to,
                      }));
                    }}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de ventas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>
              {filteredSales.length} de {metadata?.total || 0} ventas
              encontradas
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({
                search: "",
                branches: [],
                users: [],
              });
              setSearchValue("");
              navigateWithParams({ search: undefined, page: undefined });
            }}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Venta</TableHead>
                  <TableHead>Fecha y hora</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No se encontraron ventas con los filtros seleccionados
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{sale.id}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDateTime(sale.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{sale.user.name}</div>
                          <Badge
                            variant={
                              sale.user.is_active ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {sale.user.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{sale.branch.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {sale.saleDetails.length} items
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-green-600">
                          ${parseFloat(sale.total).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => showSaleDetailsDialog(sale)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {metadata && metadata.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Página {metadata.page} de {metadata.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(initialPage - 1)}
                  disabled={!metadata.hasPreviousPage}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(initialPage + 1)}
                  disabled={!metadata.hasNextPage}
                  className="gap-2"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de detalles de venta */}
      <SaleDetailsDialog
        sale={selectedSale}
        open={showSaleDetails}
        onClose={() => setShowSaleDetails(false)}
      />
    </>
  );
}
