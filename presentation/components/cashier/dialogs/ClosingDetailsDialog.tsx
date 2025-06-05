"use client";

import {
  ArrowDown,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Printer,
} from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
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

import type { Cash } from "@/core/domain/entity/cash.entity";
import { CashStatus } from "@/core/domain/entity/cash.entity";
import type { ICashSummary } from "@/infraestructure/interface/cash/cash.interface";
import {
  formatCurrency,
  formatDateTime,
  parseAmount,
} from "../utils/cashier.utils";

interface ClosingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  closing: Cash | null;
  summary: ICashSummary | null;
}

export function ClosingDetailsDialog({
  open,
  onClose,
  closing,
  summary,
}: ClosingDetailsDialogProps) {
  if (!closing) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de Cierre de Caja</DialogTitle>
          <DialogDescription>
            Reporte completo del cierre de caja #{closing.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium">Cierre #{closing.id}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(closing.fecha_cierre || closing.created_at)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sucursal:</span>
                    <span className="font-medium">{closing.branch.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Usuario apertura:
                    </span>
                    <span className="font-medium">
                      {closing.user_apertura.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Usuario cierre:
                    </span>
                    <span className="font-medium">
                      {closing.user_cierre?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="font-medium">
                      <Badge
                        variant={
                          closing.estado === CashStatus.CERRADA
                            ? "outline"
                            : "default"
                        }
                      >
                        {closing.estado === CashStatus.CERRADA
                          ? "Cerrada"
                          : "Abierta"}
                      </Badge>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monto inicial:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(closing.monto_inicial)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Ventas totales:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(parseAmount(closing.ventas_totales))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monto esperado:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(parseAmount(closing.monto_esperado))}
                    </span>
                  </div>
                  {closing.monto_final !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monto final:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(closing.monto_final)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diferencia:</span>
                    <span
                      className={`font-medium ${
                        closing.diferencia === 0
                          ? ""
                          : closing.diferencia > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {closing.diferencia === 0
                        ? "Sin diferencia"
                        : closing.diferencia > 0
                        ? `Sobrante: ${formatCurrency(closing.diferencia)}`
                        : `Faltante: ${formatCurrency(
                            Math.abs(closing.diferencia)
                          )}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>Desglose de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Por Método de Pago
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span>Efectivo</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.ventas_por_metodo?.efectivo || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <span>Tarjeta</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.ventas_por_metodo?.tarjeta || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="h-4 w-4 text-purple-500" />
                          <span>Transferencia</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.ventas_por_metodo?.transferencia || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Otros</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(summary.ventas_por_metodo?.otro || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Estadísticas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Número de ventas:
                        </span>
                        <span className="font-medium">
                          {summary.estadisticas?.numero_ventas || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Promedio por venta:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            summary.estadisticas?.promedio_venta || 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {closing.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{closing.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
