"use client";

import { Download, Eye, Filter, Loader2, User } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";

import type { Cash } from "@/core/domain/entity/cash.entity";
import { CashStatus } from "@/core/domain/entity/cash.entity";
import { formatCurrency, formatDateTime } from "../utils/cashier.utils";

interface CashHistorySectionProps {
  filteredCash: Cash[];
  isPending: boolean;
  isExporting: boolean;
  onViewDetails: (cash: Cash) => void;
  onExport: () => void;
  onClearFilters: () => void;
}

export function CashHistorySection({
  filteredCash,
  isPending,
  isExporting,
  onViewDetails,
  onExport,
  onClearFilters,
}: CashHistorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Historial de Caja
        </h2>
        <Button
          variant="outline"
          onClick={onExport}
          disabled={isExporting}
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
              Exportar Reportes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Caja</CardTitle>
            <CardDescription>
              {filteredCash.length} registros encontrados
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha de Apertura</TableHead>
                  <TableHead>Fecha de Cierre</TableHead>
                  <TableHead>Usuario Apertura</TableHead>
                  <TableHead>Usuario Cierre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Monto Inicial</TableHead>
                  <TableHead>Monto Final</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : filteredCash.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No se encontraron registros con los filtros seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCash.map((cashItem) => (
                    <TableRow key={cashItem.id}>
                      <TableCell>
                        {formatDateTime(cashItem.fecha_apertura)}
                      </TableCell>
                      <TableCell>
                        {cashItem.fecha_cierre
                          ? formatDateTime(cashItem.fecha_cierre)
                          : "No cerrada"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{cashItem.user_apertura.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cashItem.user_cierre ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{cashItem.user_cierre.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cashItem.estado === CashStatus.CERRADA
                              ? "outline"
                              : "success"
                          }
                        >
                          {cashItem.estado === CashStatus.CERRADA
                            ? "Cerrada"
                            : "Abierta"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(cashItem.monto_inicial)}
                      </TableCell>
                      <TableCell>
                        {cashItem.monto_final !== undefined
                          ? formatCurrency(cashItem.monto_final)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {cashItem.diferencia === 0.0 ? (
                          <Badge variant="secondary">Sin diferencia</Badge>
                        ) : cashItem.diferencia > 0 ? (
                          <Badge variant="success">
                            Sobrante: {formatCurrency(cashItem.diferencia)}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Faltante:{" "}
                            {formatCurrency(Math.abs(cashItem.diferencia))}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(cashItem)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
