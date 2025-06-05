"use client";

import { useState, useEffect } from "react";
import { Loader2, UnlockIcon } from "lucide-react";

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
import { Textarea } from "@/presentation/components/ui/textarea";
import { toast } from "sonner";

import { useAuthStore } from "@/presentation/store/auth.store";
import type { OpenCashSchema } from "@/infraestructure/schema/cash.schema";

interface OpenCashRegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenCashRegister: (data: OpenCashSchema) => void;
}

export function OpenCashRegisterDialog({
  open,
  onClose,
  onOpenCashRegister,
}: OpenCashRegisterDialogProps) {
  const [initialAmount, setInitialAmount] = useState("2000.00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const resetForm = () => {
    setInitialAmount("2000.00");
    setNotes("");
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = () => {
    const amount = Number.parseFloat(initialAmount);
    if (Number.isNaN(amount) || amount < 0) {
      toast.error("El monto inicial debe ser un número positivo");
      return;
    }

    if (!user?.sub) {
      toast.error("Usuario no autenticado");
      return;
    }

    setIsSubmitting(true);

    const openingData: OpenCashSchema = {
      monto_inicial: amount,
      branch_id: "dcdfcc7a-b5fa-444f-b6c1-bcff84365f64",
      observaciones: notes.trim() || undefined,
      user_apertura_id: user.sub,
    };

    onOpenCashRegister(openingData);
    setIsSubmitting(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apertura de Caja</DialogTitle>
          <DialogDescription>
            Registre el monto inicial con el que inicia operaciones
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="initial-amount">Monto Inicial</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="initial-amount"
                type="number"
                min="0"
                step="0.01"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="pl-7"
              />
            </div>
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
                <UnlockIcon className="mr-2 h-4 w-4" />
                Abrir Caja
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
