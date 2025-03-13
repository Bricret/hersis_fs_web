"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onComplete: (paymentMethod: string, amountPaid: number) => void;
}

export default function ModalPayment({
  open,
  onClose,
  total,
  onComplete,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [amountPaid, setAmountPaid] = useState(total.toFixed(2));
  const [change, setChange] = useState(0);
  const amountPaidInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPaymentMethod("efectivo");
      setAmountPaid(total.toFixed(2));
      setChange(0);
    }
  }, [open, total]);

  useEffect(() => {
    if (open) {
      setPaymentMethod("efectivo");
      setAmountPaid(total.toFixed(2));
      setChange(0);

      // Foco en el input después de un pequeño delay
      setTimeout(() => {
        if (amountPaidInputRef.current) {
          amountPaidInputRef.current.focus();
          amountPaidInputRef.current.select();
        }
      }, 50);
    }
  }, [open, total]);

  useEffect(() => {
    if (paymentMethod === "efectivo") {
      const paid = Number.parseFloat(amountPaid) || 0;
      setChange(paid - total); // <-- Permitir valores negativos
    } else {
      setChange(0);
    }
  }, [amountPaid, paymentMethod, total]);

  const handleComplete = () => {
    onComplete(paymentMethod, Number.parseFloat(amountPaid));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar pago</DialogTitle>
          <DialogDescription>
            Complete los detalles del pago para finalizar la venta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-main-background-color p-4 shadow-md">
            <div className="text-center">
              <div className="text-sm text-black/70">Total a pagar</div>
              <div className="text-3xl font-bold">${total.toFixed(2)}</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Método de pago</Label>
            <RadioGroup
              defaultValue="efectivo"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="efectivo"
                className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer"
              >
                <RadioGroupItem value="efectivo" id="efectivo" />
                <span>Efectivo</span>
              </Label>

              <Label
                htmlFor="tarjeta"
                className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer"
              >
                <RadioGroupItem value="tarjeta" id="tarjeta" />
                <span>Tarjeta</span>
              </Label>

              <Label
                htmlFor="transferencia"
                className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer"
              >
                <RadioGroupItem value="transferencia" id="transferencia" />
                <span>Transferencia</span>
              </Label>

              <Label
                htmlFor="otro"
                className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer"
              >
                <RadioGroupItem value="otro" id="otro" />
                <span>Otro</span>
              </Label>
            </RadioGroup>
          </div>

          <Separator className="bg-border-main" />

          {paymentMethod === "efectivo" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount-paid">Monto recibido</Label>
                <Input
                  id="amount-paid"
                  ref={amountPaidInputRef}
                  type="number"
                  min={total}
                  step="0.01"
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="text-right"
                  onFocus={(e) => e.target.select()}
                />
              </div>

              <div className="rounded-lg bg-main-background-color shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {change >= 0 ? "Cambio:" : "Falta:"}
                  </span>
                  <span
                    className={`font-bold ${change < 0 ? "text-red-500" : ""}`}
                  >
                    ${Math.abs(change).toFixed(2)}
                  </span>
                </div>
              </div>
              <h5 className="text-sm text-muted-foreground">
                *Si no ingresa un monto, se asumirá que el cliente pagó el total
                de la venta.
              </h5>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            disabled={
              paymentMethod === "efectivo" &&
              Number.parseFloat(amountPaid) < total
            }
          >
            Completar venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
