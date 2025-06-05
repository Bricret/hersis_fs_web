"use client";

import { useState, useEffect } from "react";
import {
  History,
  Eye,
  Calendar,
  DollarSign,
  Package,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { Badge } from "@/presentation/components/ui/badge";
import { Input } from "@/presentation/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { toast } from "sonner";
import {
  getAllSales,
  getSaleById,
} from "@/presentation/services/server/sale.server";
import type { Sale } from "@/core/domain/entity/sale.entity";

export default function SalesHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const salesData = await getAllSales();
      setSales(salesData);
    } catch (error) {
      toast.error("Error al cargar las ventas", {
        description:
          error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSale = async (saleId: string) => {
    try {
      const sale = await getSaleById(saleId);
      setSelectedSale(sale);
      setIsDetailOpen(true);
    } catch (error) {
      toast.error("Error al cargar el detalle de la venta", {
        description:
          error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.id.toString().includes(searchTerm) ||
      sale.branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      fetchSales();
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            Historial
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Ventas
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID de venta o sucursal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchSales}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Actualizar"
                )}
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Cargando ventas...</span>
                  </div>
                ) : filteredSales.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No se encontraron ventas</p>
                  </div>
                ) : (
                  filteredSales.map((sale) => (
                    <Card
                      key={sale.id.toString()}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Venta #{sale.id.toString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {sale.branch.name}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(sale.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {sale.saleDetails.length} productos
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-semibold text-emerald-600">
                                {formatCurrency(sale.total)}
                              </div>
                              {sale.cash_register && (
                                <div className="text-xs text-gray-500">
                                  Caja: {sale.cash_register.id.slice(0, 8)}...
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSale(sale.id.toString())}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para el detalle de la venta */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Detalle de Venta #{selectedSale?.id.toString()}
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Fecha
                  </label>
                  <p className="font-medium">{formatDate(selectedSale.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Sucursal
                  </label>
                  <p className="font-medium">{selectedSale.branch.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Total
                  </label>
                  <p className="font-semibold text-emerald-600 text-lg">
                    {formatCurrency(selectedSale.total)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Productos
                  </label>
                  <p className="font-medium">
                    {selectedSale.saleDetails.length} items
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Productos vendidos</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {selectedSale.saleDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <p className="font-medium">
                            Producto #{detail.productId}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>
                              {detail.quantity} ×{" "}
                              {formatCurrency(detail.unit_price)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {detail.product_type === "medicine"
                                ? "Medicina"
                                : "General"}
                            </Badge>
                          </div>
                        </div>
                        <div className="font-medium text-emerald-600">
                          {formatCurrency(detail.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
