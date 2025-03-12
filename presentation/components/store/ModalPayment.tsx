import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (open) {
      setPaymentMethod("efectivo");
      setAmountPaid(total.toFixed(2));
      setChange(0);
    }
  }, [open, total]);

  useEffect(() => {
    if (paymentMethod === "efectivo") {
      const paid = Number.parseFloat(amountPaid) || 0;
      setChange(Math.max(0, paid - total));
    } else {
      setChange(0);
    }
  }, [amountPaid, paymentMethod, total]);

  const handleComplete = () => {
    onComplete(paymentMethod, Number.parseFloat(amountPaid));
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
          <div className="rounded-lg bg-muted p-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total a pagar</div>
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
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="efectivo" id="efectivo" />
                <Label htmlFor="efectivo" className="cursor-pointer">
                  Efectivo
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="tarjeta" id="tarjeta" />
                <Label htmlFor="tarjeta" className="cursor-pointer">
                  Tarjeta
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="transferencia" id="transferencia" />
                <Label htmlFor="transferencia" className="cursor-pointer">
                  Transferencia
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="otro" id="otro" />
                <Label htmlFor="otro" className="cursor-pointer">
                  Otro
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "efectivo" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount-paid">Monto recibido</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  min={total}
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="text-right"
                />
              </div>

              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cambio:</span>
                  <span className="font-bold">${change.toFixed(2)}</span>
                </div>
              </div>
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
