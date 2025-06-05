"use client";

import { Loader2, LockIcon, UnlockIcon } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";

import type { Cash } from "@/core/domain/entity/cash.entity";
import { CashStatus } from "@/core/domain/entity/cash.entity";
import type { ICashSummary } from "@/infraestructure/interface/cash/cash.interface";
import {
  formatCurrency,
  formatDateTime,
  parseAmount,
} from "../utils/cashier.utils";

interface CashStatusSectionProps {
  activeCash: Cash | null;
  activeCashSummary: ICashSummary | null;
  isPending: boolean;
  onOpenCash: () => void;
  onCloseCash: () => void;
}

export function CashStatusSection({
  activeCash,
  activeCashSummary,
  isPending,
  onOpenCash,
  onCloseCash,
}: CashStatusSectionProps) {
  console.log(activeCashSummary);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Estado de Caja
          <Badge
            variant={
              activeCash?.estado === CashStatus.ABIERTA ? "success" : "default"
            }
          >
            {activeCash?.estado === CashStatus.ABIERTA ? "Abierta" : "Cerrada"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {activeCash?.estado === CashStatus.ABIERTA
            ? "La caja está abierta. Cierre la caja para finalizar las operaciones"
            : "La caja está actualmente cerrada. Haga clic en 'Abrir Caja' para iniciar operaciones"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeCash?.estado === CashStatus.ABIERTA ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Información de Apertura</h3>
                <div className="mt-1 rounded-lg border p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">
                      Fecha de apertura:
                    </div>
                    <div className="font-medium">
                      {formatDateTime(activeCash?.fecha_apertura || "")}
                    </div>
                    <div className="text-muted-foreground">Usuario:</div>
                    <div className="font-medium">
                      {activeCash?.user_apertura?.name}
                    </div>
                    <div className="text-muted-foreground">Sucursal:</div>
                    <div className="font-medium">
                      {activeCash?.branch?.name}
                    </div>
                    <div className="text-muted-foreground">Monto inicial:</div>
                    <div className="font-medium">
                      {formatCurrency(activeCash?.monto_inicial || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Resumen del Día</h3>
                <div className="mt-1 rounded-lg border p-3">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Ventas totales:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          parseAmount(activeCashSummary?.ventas_totales)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monto esperado:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          parseAmount(activeCashSummary?.monto_esperado)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Número de ventas:
                      </span>
                      <span className="font-medium">
                        {activeCashSummary?.cantidad_ventas || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={onCloseCash}
                className="w-full gap-2"
                variant="destructive"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LockIcon className="h-4 w-4" />
                )}
                Cerrar Caja
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
            <LockIcon className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">Caja Cerrada</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              La caja está actualmente cerrada. Haga clic en "Abrir Caja" para
              iniciar operaciones.
            </p>
            <Button
              onClick={onOpenCash}
              className="mt-4 gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UnlockIcon className="h-4 w-4" />
              )}
              Abrir Caja
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
