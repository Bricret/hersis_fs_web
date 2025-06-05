"use client";

import { useState, useEffect } from "react";
import { Loader2, LockIcon } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Separator } from "@/presentation/components/ui/separator";
import { Textarea } from "@/presentation/components/ui/textarea";
import { toast } from "sonner";

import { useAuthStore } from "@/presentation/store/auth.store";
import type { CloseCashSchema } from "@/infraestructure/schema/cash.schema";
import type { Cash } from "@/core/domain/entity/cash.entity";
import type { ICashSummary } from "@/infraestructure/interface/cash/cash.interface";
import { formatCurrency, parseAmount } from "../utils/cashier.utils";

interface CloseCashRegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onCloseCashRegister: (id: string, data: CloseCashSchema) => void;
  activeCash: Cash | null;
  cashSummary: ICashSummary | null;
}

export function CloseCashRegisterDialog({
  open,
  onClose,
  onCloseCashRegister,
  activeCash,
  cashSummary,
}: CloseCashRegisterDialogProps) {
  const [finalAmount, setFinalAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (open && cashSummary) {
      const montoEsperado = parseAmount(cashSummary.monto_esperado);
      setFinalAmount(montoEsperado.toFixed(2) || "0.00");
      setNotes("");
    }
  }, [open, cashSummary]);

  const handleSubmit = () => {
    if (!activeCash) return;

    const parsedFinalAmount = Number.parseFloat(finalAmount);
    if (Number.isNaN(parsedFinalAmount) || parsedFinalAmount < 0) {
      toast.error("El monto final debe ser un número positivo o cero");
      return;
    }

    setIsSubmitting(true);

    const closingData: CloseCashSchema = {
      user_cierre_id: user?.sub || "",
      monto_final: parsedFinalAmount,
      observaciones: notes.trim() || undefined,
    };

    onCloseCashRegister(activeCash.id, closingData);
    setIsSubmitting(false);
  };

  if (!activeCash || !cashSummary) return null;

  const montoEsperadoNumerico = parseAmount(cashSummary.monto_esperado);
  const difference = Number.parseFloat(finalAmount) - montoEsperadoNumerico;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cierre de Caja</DialogTitle>
          <DialogDescription>
            Registre el monto final y genere el reporte de cierre
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Resumen de Operaciones</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto inicial:</span>
                <span className="font-medium">
                  {formatCurrency(activeCash.monto_inicial)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas totales:</span>
                <span className="font-medium">
                  {formatCurrency(parseAmount(cashSummary.ventas_totales))}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-medium">
                <span>Monto esperado en caja:</span>
                <span>{formatCurrency(montoEsperadoNumerico)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="final-amount">Monto Final en Caja</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="final-amount"
                type="number"
                min="0"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="pl-7"
              />
            </div>

            {Number.parseFloat(finalAmount) !== 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm">Diferencia:</span>
                <Badge
                  variant={
                    difference === 0
                      ? "outline"
                      : difference > 0
                      ? "default"
                      : "destructive"
                  }
                >
                  {difference === 0
                    ? "Sin diferencia"
                    : difference > 0
                    ? `Sobrante: ${formatCurrency(difference)}`
                    : `Faltante: ${formatCurrency(Math.abs(difference))}`}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Observaciones o comentarios adicionales"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <LockIcon className="mr-2 h-4 w-4" />
                Cerrar Caja
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
